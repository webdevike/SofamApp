import React, { FunctionComponent as Component } from "react"
import { View, Image, ViewStyle, TextStyle, ImageStyle, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Wallpaper } from "../../components"
import { color, spacing, typography } from "../../theme"
import { useQuery, gql, useMutation } from "@apollo/client"
import { cache } from '../../cache'
import { TextInput } from "react-native-gesture-handler"

const bowserLogo = require("./bowser.png")

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const ALMOST: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 26,
  fontStyle: "italic",
}
const BOWSER: ImageStyle = {
  alignSelf: "center",
  marginVertical: spacing[5],
  maxWidth: "100%",
}
const CONTENT: TextStyle = {
  ...TEXT,
  color: "#BAB6C8",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[5],
}
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}

const TEXT_INPUT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  marginBottom: spacing[5],
  backgroundColor: "white",
}

const FOOTER: ViewStyle = { backgroundColor: "#20162D" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}

const USERS = gql`
  {
  users {
    name
  }
}`

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

const IS_LOGGED_IN = gql`
    query IsUserLoggedIn {
      isLoggedIn @client
    }
  `

export const WelcomeScreen: Component = observer(function WelcomeScreen() {
  const navigation = useNavigation()
  const nextScreen = () => {
    cache.writeQuery({
      query: IS_LOGGED_IN,
      data: {
        isLoggedIn: false
      },
    })
  }
  // const { loading, error, data } = useQuery(USERS)
  const [login, { data }] = useMutation(LOGIN)
  const { data: loggedIn } = useQuery(IS_LOGGED_IN)

  const [password, onPasswordChange] = React.useState("")
  const [email, onEmailChange] = React.useState("")

  // TODO image picker
  // const _pickImage = async () => {
  //   try {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.All,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     })
  //     console.log(result)
  //   } catch (E) {
  //     console.log(E)
  //   }
  // }

  // if (loading) {
  //   return (
  //     <View style={FULL}>
  //       <Wallpaper />
  //       <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
  //         <Text>..loading</Text>
  //       </Screen>
  //     </View>
  //   )
  // }
  // if (error) {
  //   return (
  //     <View style={FULL}>
  //       <Wallpaper />
  //       <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
  //         <Text>{JSON.stringify(error, undefined, 2)}</Text>
  //       </Screen>
  //     </View>
  //   )
  // }
  return (
    <Text>Hello</Text>
  )
})
