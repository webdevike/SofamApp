import React, { FunctionComponent as Component, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { ActivityIndicator, Alert, Image, Platform, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { Screen, Text } from "../components"
import { Camera } from "expo-camera"
import { color, spacing } from "../theme"
import { getFileType, uploadImage } from "../utils/uploadImage"
import { gql, useMutation } from "@apollo/client"
import { ReactNativeFile } from 'apollo-upload-client'
import { StatusBar } from "expo-status-bar"
import { useNavigation } from "@react-navigation/native"
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker"
import * as Permissions from 'expo-permissions'

const CREATE_STORY = gql`
mutation createStory($file: Upload!) {
  createStory(file: $file) {
    id
    url
    signedRequest
  }
}`

const USERS = gql`
  {
  users {
    id
    name
    profilePicture
    stories {
      id
      url
    }
  }
}
`

export const CameraScreen: Component = observer(function CameraScreen({route}) {
  const navigation = useNavigation()
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [createStory] = useMutation(CREATE_STORY)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await Camera.requestPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
        setHasPermission(status === 'granted')
      }
    })()
  }, [])

  if (hasPermission === null) {
    return <View />
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  const _pickImage = async (screen: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: .1,
        videoExportPreset: 2
      })

      if(!result.cancelled) {
        if(route?.params?.profile) {
          console.log('this was called')
          navigation.navigate('profile', { ...result })
        } else {
          console.log('that was called')
          navigation.navigate('create', { ...result })
          
        }
      }

    } catch (error) {
      console.log(error)
    }
  }


  const _takePhoto = async () => {
    const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);

    const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    try {
      if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
        const photo = await ref.current.takePictureAsync({
          quality: 0.1,
        })
        if(route?.params?.profile) {
          navigation.navigate('profile', { ...photo })
        } else {
          navigation.navigate('create', { ...photo })
        }
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  const styles = StyleSheet.create({
    loadingOverlay: {
      alignItems: 'center',
      backgroundColor: color.palette.black,
      bottom: 0,
      justifyContent: 'center',
      left: 0,
      opacity: 0.8,
      position: 'absolute',
      right: 0,
      top: 0,
    }
  })

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={ref}>
        {loading &&
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size='large' color="white" />
          </View>
        }
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: "space-evenly",
            alignItems: 'flex-end',
            marginBottom: spacing[8]
          }}>
          <TouchableOpacity
            onPress={_pickImage}>
            <MaterialIcons name="photo-library" size={50} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderWidth: 8,
              borderColor: 'white',
              borderRadius: 100,
              width: 100,
              height: 100,
            }}
            onLongPress={() => Alert.alert('You found an easter egg 🐰! Soon enough when you hold this button down it will start recording. So fancy! 🎊🎉')}
            onPress={_takePhoto}
          >
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              )
            }}>
            <Feather name="rotate-ccw" size={50} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
      <StatusBar style="light" />
    </View>
  )
})
