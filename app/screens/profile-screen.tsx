import React, { FunctionComponent as Component, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, Platform, SafeAreaView, Text, TextStyle, View, ViewStyle } from 'react-native'
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
import { StatusBar } from "expo-status-bar"
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from "@react-navigation/native"

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

const styles = {
  changeProfileText: {
    color: color.palette.orange,
    padding: spacing[2],
    fontWeight: '600',
    marginTop: spacing[2]
  },
  Header: {
    fontSize: 21,
    fontWeight: 'bold',
  }
}

export const ProfileScreen: Component = observer(function ProfileScreen({ route }) {

  
  const [hasSaved, setSaved] = useState(false);
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setSaved(true)
    }
  })
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const navigation = useNavigation()
  const [show, setShow] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const [media, pickImage, takePicture] = useImagePicker()
  const { loading: userLoading, user } = currentUser()

  const logout = async () => {
    cache.gc()
    await clear()
    accessTokenVar(false)
  }

  useEffect(() => {
    if(route?.params?.uri) setSaved(false)
  }, [route?.params?.uri])

  async function updateProfilePicture() {
    const notificationToken = await useNotifcations()
    const filename = route?.params?.uri.split('/').pop()
    const file = new ReactNativeFile({
      uri: route?.params?.uri,
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

  const ROOT = {
    flex: 1,
    // margin: spacing[4],
  }
  const CONTENT_CONTAINER: ViewStyle = {
    flex: 1,
    marginHorizontal: spacing[4]
  }

  const IMAGE_CONTAINER: ViewStyle = {
    flex: 1,
    alignItems: 'center',
  }

  const PROFILE_IMAGE: ImageStyle = {
    height: 150,
    width: 150,
    borderRadius: 100,
  }

  const SAVE_BUTTON: ViewStyle = {
    backgroundColor: color.palette.orange,
    height: 40,
  }
  const LOGOUT_BUTTON: ViewStyle = {
    backgroundColor: 'transparent',
    borderColor: color.palette.angry,
    borderWidth: 2,
    marginHorizontal: spacing[8],
    height: 40,
  }
  
  const SAVE_BUTTON_TEXT: TextStyle = {
    // color: color.palette.black,
    fontSize: 16,
  }
  const LOGOUT_BUTTON_TEXT: TextStyle = {
    color: color.palette.angry,
    fontSize: 16,
  }

  return (
    <SafeAreaView style={ROOT}>
      <View style={CONTENT_CONTAINER}>
        <View style={IMAGE_CONTAINER}>
          {route?.params?.uri ? <ProgressiveImage
            source={{ uri: route?.params?.uri }}
            style={PROFILE_IMAGE} /> :
            <ProgressiveImage
              source={{ uri: user?.me?.profilePicture || '"https://images.unsplash.com/photo-1529405643518-5cf24fddfc0b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"' }}
              style={PROFILE_IMAGE} />}

          <Text style={styles.changeProfileText} onPress={() => navigation.navigate('camera-screen', { profile: true })}>Change Profile Picture</Text>
          {route?.params?.uri && !hasSaved && <Button style={SAVE_BUTTON} textStyle={SAVE_BUTTON_TEXT} onPress={updateProfilePicture} text="Save" />}
        </View>
        <View style={{flex: 1, marginTop: spacing[8]}}>
          <Text style={styles.Header}>Info</Text>
          <Text style={{marginTop: spacing[4]}}>Birthday: 10/20/1994</Text>
          <Text style={{marginTop: spacing[4]}}>Username: Ike</Text>
        </View>
        <View style={{flex: 1}}>
          <Button style={LOGOUT_BUTTON} textStyle={LOGOUT_BUTTON_TEXT} onPress={logout} text="Logout" />
        </View>
        {/* <View style={{ flex: 5, marginTop: 100 }}>

          <Button style={LOGIN_BUTTON} textStyle={LOGIN_BUTTON_TEXT} onPress={showDatepicker} text="Pick Date" />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}

          <Text>{user?.me?.name}</Text>
          <Button style={LOGIN_BUTTON} textStyle={LOGIN_BUTTON_TEXT} onPress={pickImage} text="Pick Image" />
          {route?.params?.uri && <Button style={LOGIN_BUTTON} textStyle={LOGIN_BUTTON_TEXT} onPress={updateProfilePicture} text="Save" />}
        </View> */}
      </View>
      <StatusBar style='dark' />
    </SafeAreaView>
  )
})
