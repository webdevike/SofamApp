import React, { FunctionComponent as Component, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextInput, ImageStyle, TextStyle, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native"
import { Button, Text } from "../components"
import { color, spacing, typography } from "../theme"
import { gql, useMutation, useReactiveVar } from "@apollo/client"
import { saveString, loadString, save, load } from "../utils/storage"
import { StatusBar } from 'expo-status-bar';
import { accessTokenVar, cache } from '../cache'
import * as ImagePicker from 'expo-image-picker'
import { ReactNativeFile } from 'apollo-upload-client'
import { uploadImage } from "../utils/uploadImage"
import { Camera } from 'expo-camera';

// Styles
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}

const TEXT_CONTAINER: ViewStyle = {
  marginBottom: spacing[8]
}

const BOTTOM_TEXT_CONTAINER: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  marginTop: spacing[3]
}

const HEADING: TextStyle = {
  ...TEXT,
  fontSize: 32,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: spacing[2],
}

const CAPTION: TextStyle = {
  ...TEXT,
  fontSize: 20,
  textAlign: "center"
}

const BOLD: TextStyle = { fontWeight: "bold" }

const FULL: ViewStyle = {
  flex: 1,
  alignItems: "stretch",
  justifyContent: "center",
  backgroundColor: "#1F1944",
}

const CONTAINER: ViewStyle = {
  margin: spacing[5]
}

const TEXT_INPUT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  marginBottom: spacing[5],
  backgroundColor: "#413D48",
  borderRadius: 50,
  ...TEXT
}

const LOGIN_BUTTON: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  borderRadius: 50,
}

const LOGIN_BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 14,
  letterSpacing: 2,
}

const IMAGE_PICKER_CONTAINER: ViewStyle = {
  marginBottom: spacing[2],
  flexDirection: "row",
  justifyContent: "space-between"
}

const IMAGE_PICKER_BUTTON: ViewStyle = {
  marginBottom: spacing[4],
  height: 45,
  backgroundColor: 'transparent',
  borderWidth: 2,
  borderColor: color.palette.white
}

const IMAGE_PICKER_LABEL: ViewStyle = {
  ...TEXT,
  marginBottom: spacing[2]
}

const REGISTER_MUTATION = gql`
  mutation register($email: String!, $password: String!, $name: String!, $secretCode: String!, $profilePicture: Upload!) {
    register(data: {
      email: $email, 
      password: $password,
      name: $name,
      secretCode: $secretCode
      profilePicture: $profilePicture
      }) {
        accessToken
        signedRequest
        user {
          id
          name
          profilePicture
        }
      }
  }
`

const USERS = gql`
{
  users {
    id
    name
  }
}
`
interface FileDataObject {
  uri: string
}

export const RegisterScreen: Component = observer(function RegisterScreen(props) {
  const [register] = useMutation(REGISTER_MUTATION)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [secretCode, setsecretCode] = useState("")
  const [fileData, setFileData] = useState<FileDataObject>()

  useEffect(() => {
    ; (async () => {
      const fileObject = await load("@fileObject")
      // the file that was chosen from the pickImage function
      setFileData(fileObject)
    })()
  }, [])

  const pickImage = async (screen: string) => {
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

      if (!result.cancelled) {
        await save("@fileObject", result)
      }
    } catch (error) {
      console.log(error, 'error is here!')
    }
  }

  const handleRegister = async () => {

      const filename = fileData.uri.split('/').pop()

      const file = new ReactNativeFile({
        uri: fileData.uri,
        name: filename,
        type: fileData.type
      })
      const { data }: any = await register({
        variables: {
          email: email,
          password: password,
          name,
          secretCode,
          profilePicture: file
        },
        // update: (proxy, { data: { register } }) => {
        //   const data = proxy.readQuery({ query: USERS })
        //   proxy.writeQuery({
        //     query: USERS,
        //     data: {
        //       users: [...data.users, register]
        //     }
        //   })
        // }
      })
      uploadImage(file, data.register.signedRequest)
      saveString("@authToken", data.register.accessToken)
      accessTokenVar(true)
  }
  return (
    <View style={FULL}>
      <KeyboardAvoidingView
        style={CONTAINER}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={TEXT_CONTAINER}>
          <Text style={HEADING}>Signup!</Text>
          <Text style={CAPTION}>The only social media for families</Text>
        </View>
        <TextInput
          placeholderTextColor="#BDBDBD"
          style={TEXT_INPUT}
          onChangeText={text => setEmail(text)}
          value={email}
          placeholder="Email"
          autoCapitalize="none"
        />
        <TextInput
          placeholderTextColor="#BDBDBD"
          style={TEXT_INPUT}
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
          value={password}
          placeholder="Password"
          autoCapitalize="none"
        />
        <TextInput
          placeholderTextColor="#BDBDBD"
          style={TEXT_INPUT}
          onChangeText={text => setName(text)}
          value={name}
          placeholder="Name"
          autoCapitalize="none"
        />
        <TextInput
          placeholderTextColor="#BDBDBD"
          style={TEXT_INPUT}
          secureTextEntry={true}
          onChangeText={text => setsecretCode(text)}
          value={secretCode}
          placeholder="Secret Code"
          autoCapitalize="none"
        />
          <Text kaynbstyle={IMAGE_PICKER_LABEL}>Upload profile Picture</Text>
        <View style={IMAGE_PICKER_CONTAINER}>
          <Button
            style={IMAGE_PICKER_BUTTON}
            textStyle={LOGIN_BUTTON_TEXT}
            text="Take A Picture"
            onPress={pickImage}
          />
          <Button
            style={IMAGE_PICKER_BUTTON}
            textStyle={LOGIN_BUTTON_TEXT}
            text="Pick An Image"
            onPress={pickImage}
          />
        </View>
        
        <Button
          style={LOGIN_BUTTON}
          textStyle={LOGIN_BUTTON_TEXT}
          text="Signup"
          onPress={handleRegister}
        />
        <View style={BOTTOM_TEXT_CONTAINER}>
          <Text style={{ marginRight: spacing[1] }}>Already have an Account?</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate("login")}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>Login</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </KeyboardAvoidingView>
    </View>
  )
})
