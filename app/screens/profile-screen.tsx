import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { Image, SafeAreaView, TextStyle, View, ViewStyle } from 'react-native'
import { color, spacing } from "../theme"
import { Header, Button } from "../components"
import { useNavigation } from "@react-navigation/native"
import { accessTokenVar } from "../cache"
import { clear } from "../utils/storage"

export const ProfileScreen: Component = observer(function ProfileScreen() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()
  const logout = async () => {
    accessTokenVar(false)
    await clear()
  }
  const ROOT = {
    flex: 1,
    margin: spacing[4],
  }
  const CONTENT_CONTAINER: ViewStyle = {
    flex: 1,
    justifyContent: "space-between"
  }

  const PROFILE_IMAGE = {
    height: 400,
    width: "100%"
  }

  const HEADER: TextStyle = {
    paddingTop: spacing[4],
    paddingBottom: spacing[4] - 1,
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2]
  }

  const HEADER_TITLE: TextStyle = {
    color: color.palette.black,
    fontSize: 18,
    fontWeight: "800"
  }

  const LOGIN_BUTTON: ViewStyle = {
    backgroundColor: color.palette.black,
    height: 50,
  }

  const LOGIN_BUTTON_TEXT: TextStyle = {
    fontSize: 16,
  }

  return (
    <SafeAreaView style={ROOT}>
      <Header
        leftIcon="back"
        onLeftPress={goBack}
        style={HEADER}
        titleStyle={HEADER_TITLE}
      />
      <View style={CONTENT_CONTAINER}>
        <Image style={PROFILE_IMAGE} source={{ uri: "https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1915&q=80" }}/>
        <Button style={LOGIN_BUTTON} textStyle={LOGIN_BUTTON_TEXT} onPress={logout} text="Logout"/>
      </View>
    </SafeAreaView>
  )
})
