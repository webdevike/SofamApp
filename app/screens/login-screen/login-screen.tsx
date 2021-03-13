import React, { FunctionComponent as Component, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextInput, TextStyle, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { Button, ErrorPopup, Text } from "../../components"
import { color, spacing, typography } from "../../theme"
import { useReactiveVar } from "@apollo/client"
import { saveString } from "../../utils/storage"
import { accessTokenVar, cache } from '../../cache'
import { IS_LOGGED_IN } from '../../graphql'
import { StatusBar } from "expo-status-bar"
import { useLoginMutation } from "../../generated/graphql"
import jwtDecode from "jwt-decode"
import * as AuthSession from 'expo-auth-session';


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

const auth0ClientId = "xDqa07SH6QNX6J1i0lq1UILY1KsOVJjT";
const authorizationEndpoint = "https://ikey2244.auth0.com/authorize";

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });


export const LoginScreen: Component<Props> = observer(function LoginScreen(props) {
  const [login, { loading, error }] = useLoginMutation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const loggedIn = useReactiveVar(accessTokenVar)

  // TODO refactor
  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: auth0ClientId,
      // id_token will return a JWT token
      responseType: 'id_token',
      // retrieve the user's profile
      scopes: ['openid', 'profile'],
      extraParams: {
        // ideally, this will be a random value
        nonce: 'nonce',
      },
    },
    { authorizationEndpoint }
    );
    
    React.useEffect(() => {
      if (result) {
        if (result.error) {
          Alert.alert(
            'Authentication error',
              result.params.error_description || 'something went wrong'
            );
            return;
          }
          if (result.type === 'success') {
            // Retrieve the JWT token and decode it
            const jwtToken = result.params.id_token;
            const decoded = jwtDecode(jwtToken);
            saveString("@authToken", jwtToken)
            accessTokenVar(true)
          }
        }
      }, [result]);
      
      
  // const handleLogin = async () => {
  //   const { data }: any = await login({
  //     variables: {
  //       email: email,
  //       password: password,
  //     },
  //   })
  //   console.log(data, 'login data')
  //   saveString("@authToken", data.login)
  //   accessTokenVar(true)
  // }

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
          onPress={() => promptAsync({ useProxy })}
        >
          {loading && <ActivityIndicator size="large" color="white" />}
        </Button>
        <View style={BOTTOM_TEXT_CONTAINER}>
          <Text style={{ marginRight: spacing[1] }}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate("register")}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>Signup</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {error && <ErrorPopup error={error} />}
      <StatusBar style="light" />
    </View>
  )
})
