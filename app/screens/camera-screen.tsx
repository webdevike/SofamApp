import React, { FunctionComponent as Component, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageBackground, Platform, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
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
import { handleCreateStory } from "../utils/createStory"

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
let camera: Camera

export const CameraScreen: Component = observer(function CameraScreen() {
  const [startCamera, setStartCamera] = React.useState(false)
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedImage, setCapturedImage] = React.useState<any>(null)
  const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)
  const [flashMode, setFlashMode] = React.useState('off')
  const [createStory] = useMutation(CREATE_STORY)
  const navigation = useNavigation()


  const __startCamera = async () => {
    const {status} = await Camera.requestPermissionsAsync()
    console.log(status)
    if (status === 'granted') {
      setStartCamera(true)
    } else {
      Alert.alert('Access denied')
    }
  }

  const handleCreateStory = async () => {
    const filename = capturedImage.uri.split('/').pop()
    const file = new ReactNativeFile({
      uri: capturedImage.uri,
      name: filename,
      type: 'jpeg'
    })
    try {
      const { data } = await createStory({
        variables: {
          url: file.uri,
          file
        },
        // optimisticResponse: {
        //   __typename: 'Mutation',
        //   createStory: {
        //     __typename: "User",
        //     id: Math.round(Math.random() * -1000000),
        //     name: 'Isaac',
        //     stories: [
        //       {
        //         id: Math.round(Math.random() * -1000000),
        //         url: file.uri,
        //       }
        //     ]
        //   }
        // },
        // update: (proxy, { data: { createStory } }) => {
        //   const data = proxy.readQuery({ query: USERS })
        //   proxy.writeQuery({
        //     query: USERS,
        //     data: {
        //       users: [...data.users, createStory]
        //     }
        //   })
        // }
      })
      uploadImage(file, data.createStory.signedRequest)
      navigation.navigate('home')
    } catch (error) {
      console.log("AddStoryScreen -> error", error)
    }
  }
  const __takePicture = async () => {
    const photo: any = await camera.takePictureAsync()
    console.log(photo)
    setPreviewVisible(true)
    //setStartCamera(false)
    setCapturedImage(photo)
  }
  const __savePhoto = () => {
    handleCreateStory()
  }
  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }
  const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }
  }
  const __switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
  }


  return (
    <View style={styles.container}>
    {startCamera ? (
      <View
        style={{
          flex: 1,
          width: '100%'
        }}
      >
        {previewVisible && capturedImage ? (
          <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
        ) : (
          <Camera
            type={cameraType}
            flashMode={flashMode}
            style={{flex: 1}}
            ref={(r) => {
              camera = r
            }}
          >
            <View
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: 'transparent',
                flexDirection: 'row'
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  left: '5%',
                  top: '10%',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <TouchableOpacity
                  onPress={__handleFlashMode}
                  style={{
                    backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                    borderRadius: '50%',
                    height: 25,
                    width: 25
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20
                    }}
                  >
                    ⚡️
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={__switchCamera}
                  style={{
                    marginTop: 20,
                    borderRadius: '50%',
                    height: 25,
                    width: 25
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20
                    }}
                  >
                    {cameraType === 'front' ? '🤳' : '📷'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  flexDirection: 'row',
                  flex: 1,
                  width: '100%',
                  padding: 20,
                  justifyContent: 'space-between'
                }}
              >
                <View
                  style={{
                    alignSelf: 'center',
                    flex: 1,
                    alignItems: 'center'
                  }}
                >
                  <TouchableOpacity
                    onPress={__takePicture}
                    style={{
                      width: 70,
                      height: 70,
                      bottom: 0,
                      borderRadius: 50,
                      backgroundColor: '#fff'
                    }}
                  />
                </View>
              </View>
            </View>
          </Camera>
        )}
      </View>
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity
          onPress={__startCamera}
          style={{
            width: 130,
            borderRadius: 4,
            backgroundColor: '#14274e',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            Take picture
          </Text>
        </TouchableOpacity>
      </View>
    )}

    <StatusBar style="auto" />
  </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})


const CameraPreview = ({photo, retakePicture, savePhoto}: any) => {
  console.log('sdsfds', photo)
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <ImageBackground
        source={{uri: photo && photo.uri}}
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                Re-take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                save photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}
