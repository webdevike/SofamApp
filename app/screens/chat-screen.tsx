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
import { gql, useQuery } from "@apollo/client"

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

const NOTIFICATION_TOKENS = gql`
query {
 users {
   id
  notificationToken
 }
}
`

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
  const {user} = currentUser()
  
  const {loading, data} = useQuery(NOTIFICATION_TOKENS)
  const filteredResults = data?.users.filter(x => !!x.notificationToken && x.notificationToken !== user?.me?.notificationToken)

  async function sendPushNotification() {
    const notifications = filteredResults.map((item) => {
      return {
        to: item.notificationToken,
        body: 'hello',
        badge: 1,
      }
    })
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notifications),
    });
  }

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
    await sendPushNotification(expoPushToken)
    e.preventDefault()

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      userId,
      profilePicture: user?.me.profilePicture || 'https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif',
      expoPushToken
    }).catch((e) => {
      console.log(e)
    })

    setFormValue('')
  }

  return (
    <KeyboardAvoidingView style={ROOT}>
      <ScrollView ref={ref => {scrollView = ref}} onContentSizeChange={() => scrollView.scrollToEnd({animated: true})}>
        <View style={MESSAGES_CONTAINER}>
          {messages?.map(msg =>
            <View style={msg.userId ===  userId ? SENT : RECIEVED } key={msg.id}>
              <Image style={PROFILE_IMAGE} source={{ uri: msg.profilePicture || 'https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif' }} />
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
          onSubmitEditing={(e) => sendMessage(e)}
          returnKeyType="send"
        />
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  )
})




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
