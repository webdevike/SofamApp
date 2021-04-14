import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, SafeAreaView, Text, TextStyle, View, ViewStyle } from 'react-native'
import { color, spacing } from "../theme"
import { Button, ProgressiveImage } from "../components"
import { accessTokenVar, cache } from "../cache"
import { clear } from "../utils/storage"
import { currentUser } from "../utils/currentUser"
import { useImagePicker } from "../hooks/useImagePicker"
import { MeDocument, useUpdateUserMutation } from "../generated/graphql"
import { ReactNativeFile } from "apollo-upload-client"
import { gql, useMutation } from "@apollo/client"
import { uploadImage } from "../utils/uploadImage"
import { useNotifcations } from "../hooks/useNotifications"
import { ScrollView } from "react-native-gesture-handler"

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
  const { loading: userLoading, user } = currentUser()

  const logout = async () => {
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
          id: user?.me.id,
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
    // margin: spacing[4],
  }
  const CONTENT_CONTAINER: ViewStyle = {
    flex: 1,
  }

  const IMAGE_CONTAINER: ViewStyle = {
    flex: 1,
    alignItems: 'center',
  }

  const PROFILE_IMAGE: ImageStyle = {
    height: 150,
    width: 150,
    borderRadius: 100,
    // marginTop: 20
    // position: 'absolute',
    // top: 75,
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
        <View style={IMAGE_CONTAINER}>
          <ProgressiveImage
            source={{ uri: user?.me?.profilePicture || '"https://images.unsplash.com/photo-1529405643518-5cf24fddfc0b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"' }}
            style={PROFILE_IMAGE} />
        </View>
        <View style={{ flex: 5, marginTop: 100 }}>
          <Text>{user?.me?.name}</Text>
          <Button style={LOGIN_BUTTON} textStyle={LOGIN_BUTTON_TEXT} onPress={pickImage} text="Pick Image" />
          {media && <Button style={LOGIN_BUTTON} textStyle={LOGIN_BUTTON_TEXT} onPress={updateProfilePicture} text="Save" />}
          <Button style={LOGIN_BUTTON} textStyle={LOGIN_BUTTON_TEXT} onPress={logout} text="Logout" />
        </View>
      </View>
    </SafeAreaView>
  )
})
