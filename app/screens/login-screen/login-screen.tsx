import React, { FunctionComponent as Component, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextInput, ImageStyle, TextStyle, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from "react-native"
import { Button, ErrorPopup, Text } from "../../components"
import { color, spacing, typography } from "../../theme"
import { gql, useMutation, useReactiveVar } from "@apollo/client"
import { saveString, loadString } from "../../utils/storage"
import { accessTokenVar, cache } from '../../cache'
import { useNavigation } from "@react-navigation/native"
import { LOGIN } from '../../graphql'
const patternBg = require("./pattern.png")

interface Props {
  navigation: any
}

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
  backgroundColor: color.palette.orange,
  borderRadius: 50,
}

const LOGIN_BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 14,
  letterSpacing: 2,
}

const IS_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`

export const LoginScreen: Component<Props> = observer(function LoginScreen(props) {
  const [login, { loading, error }] = useMutation(LOGIN)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const loggedIn = useReactiveVar(accessTokenVar)
  const handleLogin = async () => {
    const { data }: any = await login({
      variables: {
        email: email,
        password: password,
      },
    })
    saveString("@authToken", data.login)
    accessTokenVar(true)
    cache.writeQuery({
      query: IS_LOGGED_IN,
      data: {
        isLoggedIn: loggedIn
      },
    })
  }
  return (
    <View style={FULL}>
      <KeyboardAvoidingView
        style={CONTAINER}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
          secureTextEntry={true}
          value={password}
          placeholder="Password"
          autoCapitalize="none"
        />
        <Button
          style={LOGIN_BUTTON}
          textStyle={LOGIN_BUTTON_TEXT}
          text={loading ? '' : 'Login'}
          onPress={handleLogin}
        >
          {loading && <ActivityIndicator size="large" color="black" />}
        </Button>
        <View style={BOTTOM_TEXT_CONTAINER}>
          <Text style={{ marginRight: spacing[1] }}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate("register")}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>Signup</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {error && <ErrorPopup error={error} />}
    </View>
  )
})
