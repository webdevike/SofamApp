import React, { FunctionComponent as Component, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../components"
import { firestore } from '../app'
import { color, spacing, typography } from "../theme"
import { useCollectionData } from 'react-firebase-hooks/firestore'
import firebase from "firebase"
import { StatusBar } from "expo-status-bar"
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { currentUser } from "../utils/currentUser"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const ROOT: ViewStyle = {
  flex: 1,
}

const MESSAGES_CONTAINER: ViewStyle = {
  flex: 1,
  flexDirection: "column-reverse",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  color: 'white',
}

const BUTTON_TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}

const TEXT_INPUT: ViewStyle = {
  paddingVertical: spacing[5],
  paddingHorizontal: spacing[5],
  backgroundColor: color.palette.lighterGrey,
  ...BUTTON_TEXT
}

const PROFILE_IMAGE: ImageStyle = {
  position: "absolute",
  bottom: 30,
  zIndex: 10,
  marginTop: 7,
  height: 39,
  width: 39,
  borderRadius: 50
}

const MESSAGE_ROW: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: spacing[3],
  marginHorizontal: spacing[4]
}

const SENT: ViewStyle = {
  ...MESSAGE_ROW,
  flexDirection: "row-reverse",
}
const RECIEVED: ViewStyle = {
  ...MESSAGE_ROW
}

const BUBBLE: ViewStyle = {
  width: "50%",
  padding: spacing[4],
  marginHorizontal: spacing[4],
  borderRadius: 11,
}

const BUBBLE_SENT: ViewStyle = {
  ...BUBBLE,
  backgroundColor: color.palette.lightGreen,
}

const BUBBLE_RECIEVED: ViewStyle = {
  ...BUBBLE,
  backgroundColor: color.palette.orange,
}

interface Message {
  id: string,
  text: string,
  userId: string,
  profilePicture: string
}

export const ChatScreen: Component = observer(function ChatScreen() {
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt', 'desc').limit(25)
  const [messages] = useCollectionData<Message>(query, { idField: 'id' })
  const [formValue, setFormValue] = useState('')
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const dummy = useRef();

  const user = currentUser()
  const userId = user?.me.id

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const sendMessage = async (e) => {
    await schedulePushNotification()
    e.preventDefault()

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      userId,
      profilePicture: user?.me.profilePicture,
      expoPushToken
    }).catch((e) => {
      console.log(e)
    })

    setFormValue('')
  }

  
  return (
    <SafeAreaView style={ROOT}>
      <ScrollView ref={ref => {scrollView = ref}} onContentSizeChange={() => scrollView.scrollToEnd({animated: true})}>
        <View style={MESSAGES_CONTAINER}>
          {messages?.map(msg =>
            <View style={msg.userId ===  userId ? SENT : RECIEVED } key={msg.id}>
              <Image style={PROFILE_IMAGE} source={{ uri: msg.profilePicture }} />
              <View style={msg.userId ===  userId ? BUBBLE_SENT : BUBBLE_RECIEVED}>
                <Text text={msg.text} style={TEXT} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TextInput
          placeholderTextColor={color.palette.lightGrey}
          style={TEXT_INPUT}
          onChangeText={text => setFormValue(text)}
          value={formValue}
          placeholder="Message"
          autoCapitalize="none"
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
})

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
