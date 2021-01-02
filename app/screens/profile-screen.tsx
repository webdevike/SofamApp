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
    cache.evict({ fieldName: 'me' })
    cache.gc()
    await clear()
    accessTokenVar(false)
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
            source={{ uri: user?.me?.profilePicture || 'https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif' }}
            style={PROFILE_IMAGE} />
          <Text>{user?.me?.name}</Text>
        </View>
        <Button style={LOGIN_BUTTON} textStyle={LOGIN_BUTTON_TEXT} onPress={logout} text="Logout" />
      </View>
    </SafeAreaView>
  )
})
