import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { Image, SafeAreaView, Text, TextStyle, View, ViewStyle } from 'react-native'
import { color, spacing } from "../theme"
import { Button, ProgressiveImage } from "../components"
import { accessTokenVar, cache } from "../cache"
import { clear, loadString } from "../utils/storage"
import { currentUser } from "../utils/currentUser"
import { useImagePicker } from "../hooks/useImagePicker"
import { MeDocument, useUpdateUserMutation } from "../generated/graphql"
import { ReactNativeFile } from "apollo-upload-client"
import { gql, useMutation, useQuery } from "@apollo/client"
import { uploadImage } from "../utils/uploadImage"
import { useNotifcations } from "../hooks/useNotifications"

const UPDATE_USER = gql`
mutation updateUser(
  $id: ID
  $profilePicture: Upload!
  $name: String 
  $notificationToken: String
) {
  updateUser(id: $id, profilePicture: $profilePicture, name: $name, notificationToken: $notificationToken) {
    profilePicture
  }
}
`

const NOTIFICATION_TOKENS = gql`
 query {
  users {
    id
   notificationToken
  }
}
`

export const ProfileScreen: Component = observer(function ProfileScreen() {
  const [updateUser] = useMutation(UPDATE_USER)
  // const { loading, data } = useQuery(NOTIFICATION_TOKENS)

  // if (!loading) console.log("🚀 ~ file: profile-screen.tsx ~ line 38 ~ ProfileScreen ~ data", data)
  const [media, pickImage, takePicture] = useImagePicker()
  const user = currentUser()

  const logout = async () => {
    cache.evict({ fieldName: 'me' })
    cache.gc()
    await clear()
    accessTokenVar(false)
  }

  async function updateProfilePicture() {
    const notificationToken = await useNotifcations()
    const filename = media.uri.split('/').pop()
    if (media) {
      const file = new ReactNativeFile({
        uri: media.uri,
        name: filename,
        type: "image/jpeg"
      })
      const { data } = await updateUser({
        variables: {
          id: user.me.id,
          profilePicture: file,
          notificationToken
        },
        update: (proxy, { data: { updateUser } }) => {
          const data = proxy.readQuery({ query: MeDocument })
          proxy.writeQuery({
            query: MeDocument,
            data: {
              me: { data, ...updateUser }
            }
          })
        }
      })
      uploadImage(file, data.updateUser.profilePicture)
    }
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

  const LOGIN_BUTTON: ViewStyle = {
    backgroundColor: color.palette.black,
    height: 50,
  }

  const LOGIN_BUTTON_TEXT: TextStyle = {
    fontSize: 16,
  }

  return (
    <SafeAreaView style={ROOT}>
      <View style={CONTENT_CONTAINER}>
        <View>
          <ProgressiveImage
            source={{ uri: user?.me?.profilePicture || 'https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif' }}
            style={PROFILE_IMAGE} />
          <Text>{user?.me?.name}</Text>
          <Button style={LOGIN_BUTTON} textStyle={LOGIN_BUTTON_TEXT} onPress={pickImage} text="Pick Image" />
          {media && <Button style={LOGIN_BUTTON} textStyle={LOGIN_BUTTON_TEXT} onPress={updateProfilePicture} text="Save" />}
        </View>
        <Button style={LOGIN_BUTTON} textStyle={LOGIN_BUTTON_TEXT} onPress={logout} text="Logout" />
      </View>
    </SafeAreaView>
  )
})
