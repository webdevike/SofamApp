import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { Image, SafeAreaView, Text, TextStyle, View, ViewStyle } from 'react-native'
import { color, spacing } from "../theme"
import { Button, ProgressiveImage } from "../components"
import { accessTokenVar, cache } from "../cache"
import { clear } from "../utils/storage"
import { currentUser } from "../utils/currentUser"

export const ProfileScreen: Component = observer(function ProfileScreen() {
  const logout = async () => {
    accessTokenVar(false)
    await clear()
    cache.gc()
  }

  const user = currentUser()

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

  const LOGIN_BUTTON: ViewStyle = {
    backgroundColor: color.palette.black,
    height: 50,
  }

  const LOGIN_BUTTON_TEXT: TextStyle = {
    fontSize: 16,
  }

  const firstLayout = [
    {
      height: 400,
      width: "100%"
    },
  ]

  return (
    <SafeAreaView style={ROOT}>
      <View style={CONTENT_CONTAINER}>
        <View>
          <ProgressiveImage
            thumbnailSource={{ uri: `https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1915&q=80` }}
            source={{ uri: user?.me.profilePicture }}
            style={PROFILE_IMAGE} />
          <Text>{user?.me.name}</Text>
        </View>
        <Button style={LOGIN_BUTTON} textStyle={LOGIN_BUTTON_TEXT} onPress={logout} text="Logout" />
      </View>
    </SafeAreaView>
  )
})
