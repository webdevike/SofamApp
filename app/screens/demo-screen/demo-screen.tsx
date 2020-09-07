import React, { FunctionComponent as Component } from "react"
import { Image, ImageStyle, Platform, TextStyle, View, ViewStyle } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from "@react-navigation/native"

import { observer } from "mobx-react-lite"
import { BulletItem, Button, Header, Text, Screen, Wallpaper } from "../../components"
import { color, spacing } from "../../theme"
// import CREATE_STORY from '../../graphql/story/mutation/createStory.js'
import { useMutation, gql } from "@apollo/client"
import { ReactNativeFile } from 'apollo-upload-client'
export const logoIgnite = require("./logo-ignite.png")
export const heart = require("./heart.png")
const CREATE_STORY = gql`
         mutation createStory($name: String!, $type: String!, $uri: String!) {
           createStory(name: $name, type: $type, uri: $uri) {
             id
             createdAt
             file {
               name
               type
               uri
             }
           }
         }
       `

const UPLOAD_FILE = gql`
mutation uploadFile($file: Upload!) {
  uploadFile(file: $file) {
    filename
    mimetype
    encoding
    signedRequest
    url
  }
}
`
const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const DEMO: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const BOLD: TextStyle = { fontWeight: "bold" }
const DEMO_TEXT: TextStyle = {
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE: TextStyle = {
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
}
const TAGLINE: TextStyle = {
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[4] + spacing[1],
}
const IGNITE: ImageStyle = {
  marginVertical: spacing[6],
  alignSelf: "center",
}
const LOVE_WRAPPER: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "center",
}
const LOVE: TextStyle = {
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
}
const HEART: ImageStyle = {
  marginHorizontal: spacing[2],
  width: 10,
  height: 10,
  resizeMode: "contain",
}
const HINT: TextStyle = {
  color: "#BAB6C8",
  fontSize: 12,
  lineHeight: 15,
  marginVertical: spacing[2],
}

export const DemoScreen: Component = observer(function DemoScreen() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()
  const [createStory] = useMutation(CREATE_STORY)
  const [uploadFile] = useMutation(UPLOAD_FILE)

  function uploadImage(file, signedRequest, url) {
    fetch(signedRequest, {
      method: "PUT",
      body: file,
      headers: {
        'Content-type': "image/jpeg"
      }
    }).then((res) => {
      console.log(res, url)
    }).catch((e) => {
      console.log(e)
    })
  }

  const _pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync()

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!")
        return
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      const filename = result.uri.split('/').pop()

      const file = new ReactNativeFile({
        uri: result.uri,
        name: filename,
        type: result.type
      })

      const { data } = await uploadFile({
        variables: {
          file
        }
      })

      uploadImage(file, data.uploadFile.signedRequest, data.uploadFile.url)
    } catch (E) {
      console.log(E, 'error is here!')
    }
  }

  return (
    <View style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header
          headerTx="demoScreen.howTo"
          leftIcon="back"
          onLeftPress={goBack}
          style={HEADER}
          titleStyle={HEADER_TITLE}
        />
        <Text style={TITLE} preset="header" tx="demoScreen.title" />
        <Text style={TAGLINE} tx="demoScreen.tagLine" />
        <BulletItem text="Load up Reactotron!  You can inspect your app, view the events, interact, and so much more!" />
        <BulletItem text="Integrated here, Navigation with State, TypeScript, Storybook, Solidarity, and i18n." />
        <View>
          <Button
            style={DEMO}
            textStyle={DEMO_TEXT}
            tx="demoScreen.reactotron"
            onPress={_pickImage}
          />
          <Text style={HINT} tx={`demoScreen.${Platform.OS}ReactotronHint`} />
        </View>
        <Image source={logoIgnite} style={IGNITE} />
        <View style={LOVE_WRAPPER}>
          <Text style={LOVE} text="Made with" />
          <Image source={heart} style={HEART} />
          <Text style={LOVE} text="by Infinite Red" />
        </View>
      </Screen>
    </View>
  )
})
