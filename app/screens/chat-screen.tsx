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

const MESSAGE: ViewStyle = {
  borderBottomWidth: 1,
  borderColor: color.palette.lightGrey,
  padding: spacing[4],
  flexDirection: "row",
  alignItems: "center"
}

const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
  marginLeft: spacing[4]
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
  marginTop: 7,
  height: 39,
  width: 39,
  borderRadius: 50
}

interface Message {
  id: string,
  text: string,
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
    await schedulePushNotification();
    e.preventDefault()

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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
            <View style={MESSAGE} key={msg.id}>
              <Image style={PROFILE_IMAGE} source={{ uri: "https://ui-avatars.com/api/?name=Isaac+Weber" }} />
              <Text text={msg.text} style={TEXT} />
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
      <StatusBar style="dark" />
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
    console.log(token);
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
