import React, { FunctionComponent as Component, useContext, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextInput, ImageStyle, TextStyle, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, Image, ActivityIndicator } from "react-native"
import { Button, ErrorPopup, Text } from "../components"
import { color, spacing, typography } from "../theme"
import { gql, useMutation, useReactiveVar } from "@apollo/client"
import { saveString, loadString, save, load } from "../utils/storage"
import { StatusBar } from 'expo-status-bar';
import { accessTokenVar, cache } from '../cache'
import * as ImagePicker from 'expo-image-picker'
// import { ReactNativeFile } from 'apollo-upload-client'
import { uploadImage } from "../utils/uploadImage"
import { Camera } from 'expo-camera';
import { IS_LOGGED_IN, USERS } from "../graphql"
import { GetUsersDocument, GetUsersQuery, useGetUsersQuery, useRegisterMutation } from "../generated/graphql"
import { useNavigation } from "@react-navigation/native"
import * as firebase from 'firebase'
import { AuthContext } from "../context/AuthProvider"

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

interface FileDataObject {
  uri: string
  type: string
}

export const RegisterScreen: Component = observer(function RegisterScreen(props) {
  // const [register, { true, error }] = useRegisterMutation({
  //   onCompleted: () => {
  //     accessTokenVar(true)
  //   },
  //   refetchQueries: [
  //     { query: GetUsersDocument }
  //   ]
  // })
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [secretCode, setsecretCode] = useState("")
  const [hasPermission, setHasPermission] = useState(null)
  const [pickerResult, setPickerResult] = useState<FileDataObject>()
  const loggedIn = useReactiveVar(accessTokenVar)
  const navigation = useNavigation()

  const { register } = useContext(AuthContext)


  const handleRegister = async () => {


    // const notificationToken = await loadString('@notificationToken')

    register('ikey2244@gmail.com', 'Qazplm100!')

    // const { data }: any = await register({
    //   variables: {
    //     email: email,
    //     password: password,
    //     name,
    //     secretCode: 'Wehavethecoolestfamilyontheplanet!!',
    //     // profilePicture: file
    //     notificationToken
    //   }
    // })

    
    // if (!error) {
    //   // uploadImage(file, data.register.signedRequest)
    //   await saveString("@authToken", data.register.accessToken)
    // }
  }
  return (
    <View style={FULL}>
      {/* {error && <ErrorPopup error={error} />} */}
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
        {/* <TextInput
          placeholderTextColor="#BDBDBD"
          style={TEXT_INPUT}
          secureTextEntry={true}
          onChangeText={text => setsecretCode(text)}
          value={secretCode}
          placeholder="Secret Code"
          autoCapitalize="none"
        /> */}
        {/* <Text style={IMAGE_PICKER_LABEL}>{pickerResult ? 'Nice! Totes cute 😉' : 'Pick a selfie for your profile picture! 📸'}</Text> */}
        {/* <View style={IMAGE_PICKER_CONTAINER}>
          {pickerResult ? <Image source={{ uri: pickerResult.uri }} style={{ height: 225, width: 250, marginBottom: spacing[2] }} /> : <Button
            style={IMAGE_PICKER_BUTTON}
            textStyle={LOGIN_BUTTON_TEXT}
            text="Pick An Image"
            onPress={pickImage}
          />}
        </View> */}
        {/* {pickerResult &&
        } */}
          <Button
            style={LOGIN_BUTTON}
            textStyle={LOGIN_BUTTON_TEXT}
            text={false ? '' : 'Signup'}
            onPress={handleRegister}
          >
            {false && <ActivityIndicator size="small" color="white" />}
          </Button>

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
