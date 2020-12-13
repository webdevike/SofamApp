import React, { FunctionComponent as Component, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, Platform, TouchableOpacity, View, ViewStyle } from "react-native"
import { Screen, Text } from "../components"
import { Camera } from "expo-camera"
import { spacing } from "../theme"
import { uploadImage } from "../utils/uploadImage"
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

export const CameraScreen: Component = observer(function CameraScreen() {
  const navigation = useNavigation()
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [createStory] = useMutation(CREATE_STORY)
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
        quality: 1,
      })
      // result
      // {
      //   "cancelled": false,
      //   "height": 1168,
      //   "type": "image",
      //   "uri": "file:///var/mobile/Containers/Data/Application/37B16834-4910-42B3-9450-E7CBB2C11679/Library/Caches/ExponentExperienceData/%2540ikey2244%252FSofamApp/ImagePicker/B2C2B5F9-5251-41AD-90E9-B5C9871ED974.jpg",
      //   "width": 1166,
      // }
      
      const filename = result.uri.split('/').pop()

      const file = new ReactNativeFile({
        uri: result.uri,
        name: filename,
        type: 'image'
      })

      const { data } = await createStory({
        variables: {
          url: file.uri,
          file
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createStory: {
            __typename: "User",
            id: Math.round(Math.random() * -1000000),
            name: 'Isaac',
            stories: [
              {
                id: Math.round(Math.random() * -1000000),
                url: file.uri,
              }
            ]
          }
        },
        update: (proxy, { data: { createStory } }) => {
          const data = proxy.readQuery({ query: USERS })
          proxy.writeQuery({
            query: USERS,
            data: {
              users: [...data.users, createStory]
            }
          })
        }
      })
      if(!data) {
        alert('nothing happened')
      }
      navigation.navigate('home')
      uploadImage(file, data.createStory.signedRequest)
    } catch (error) {
      console.log(error, 'error is here! in camera screen')
    }
  }

//   const _takePhoto = async () => {
//     const {
//       status: cameraPerm
//     } = await Permissions.askAsync(Permissions.CAMERA);
    
//     const {
//       status: cameraRollPerm
//     } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    
//     // only if user allows permission to camera AND camera roll
//     if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
//       let pickerResult = await ImagePicker.launchCameraAsync({
//         allowsEditing: true,
//         aspect: [4, 3],
//       });
//       console.log("🚀 ~ file: camera-screen.tsx ~ line 144 ~ const_takePhoto= ~ pickerResult", pickerResult)
      
//       navigation.navigate('create', { ...pickerResult })
// };
// }

  const _takePhoto = async () => {
    const {
            status: cameraPerm
          } = await Permissions.askAsync(Permissions.CAMERA);
          
          const {
            status: cameraRollPerm
          } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    try {
      if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
        const photo = await ref.current.takePictureAsync()
        navigation.navigate('create', { ...photo })
      }
    }
    catch(error ) {
    alert(error)

    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={ref}>
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
