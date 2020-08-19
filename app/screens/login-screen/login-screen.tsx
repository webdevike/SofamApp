import React, { FunctionComponent as Component, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextInput, ImageStyle, TextStyle, ImageBackground } from "react-native"
import { Button, Text } from "../../components"
import { color, spacing, typography } from "../../theme"
import { gql, useMutation } from "@apollo/client"
import { saveString, loadString } from "../../utils/storage"
import { cache } from '../../cache'
const patternBg = require("./pattern.png")

// Styles
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}

const TEXT_CONTAINER: ViewStyle = {
  marginBottom: spacing[8]
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

const BACKGROUND_IMAGE: ImageStyle = {
  flex: 1,
  resizeMode: "cover",
  justifyContent: "center",
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
  backgroundColor: "#E14C9F",
  borderRadius: 50,
}

const LOGIN_BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 14,
  letterSpacing: 2,
}

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

const IS_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`

export const LoginScreen: Component = observer(function LoginScreen() {
  const [login] = useMutation(LOGIN)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return (
    <View style={FULL}>
      <ImageBackground style={BACKGROUND_IMAGE} source={patternBg}>
        <View style={CONTAINER}>
          <View style={TEXT_CONTAINER}>
            <Text style={HEADING}>Welcome To Sofam</Text>
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
            value={password}
            placeholder="Password"
            autoCapitalize="none"
          />
          <Button
            style={LOGIN_BUTTON}
            textStyle={LOGIN_BUTTON_TEXT}
            text="Login"
            onPress={async () => {
              const { data }: any = await login({
                variables: {
                  email: email,
                  password: password,
                },
              })
              saveString("@authToken", data.login)
              cache.writeQuery({
                query: IS_LOGGED_IN,
                data: {
                  isLoggedIn: Boolean(loadString("@authToken")),
                },
              })
            }}
          />
        </View>
      </ImageBackground>
    </View>
  )
})
