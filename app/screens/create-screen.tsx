import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { ActivityIndicator, Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { Text, ErrorPopup } from "../components"
import { color, spacing } from "../theme"
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { useMutation } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import { ReactNativeFile } from 'apollo-upload-client'
import { uploadImage } from "../utils/uploadImage"
import { CREATE_STORY, USERS } from "../graphql"
import { Video } from "expo-av"
import { useCreateStoryMutation } from "../generated/graphql"
import * as ImageManipulator from 'expo-image-manipulator'

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: "space-between",
    marginBottom: spacing[5],
    marginHorizontal: spacing[2],
    marginTop: spacing[2],
  },
  image: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flex: 1,

  },
  imageContainer: {
    backgroundColor: color.palette.lightGreen,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flex: 1,
  },
  leftButton: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: spacing[2],
  },
  leftButtonText: {
    marginLeft: spacing[2]
  },
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
  },
  rightButton: {
    alignItems: 'center',
    backgroundColor: color.palette.lightGreen,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: "space-evenly",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  root: {
    backgroundColor: color.palette.black,
    flex: 1
  },
  video: {
    flex: 1,
    height: 250
  },
})

export const CreateScreen: Component = observer(function CreateScreen({ route }) {
  const photo = route.params
  const filename = photo.uri.split('/').pop()
  const navigation = useNavigation()

  const [createStory, { error, loading }] = useCreateStoryMutation({
    onCompleted: async () => {
      navigation.navigate('home')
    },
  })

  const handleCreateStory = async () => {
    const resizedPhoto = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 300 } }],
    )

    const file = new ReactNativeFile({
      uri: resizedPhoto.uri,
      name: filename,
      type: "image/jpeg"
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
          id: Math.round(Math.random() * -1000000).toString(),
          name: 'Isaac',
          stories: [
            {
              id: Math.round(Math.random() * -1000000).toString(),
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
            ...createStory,
            users: [...data.users, createStory]
          }
        })
      }
    })

    await uploadImage(file, data.createStory.signedRequest)
  }

  const renderVideoOrImage = () => {
    if (photo?.uri.includes('.mov')) {
      return (
        <Video
          source={{ uri: photo?.uri }}
          rate={1.0}
          volume={0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={styles.video}
        />
      )
    } else {
      return (
        <Image style={styles.image} source={{ uri: photo?.uri }} />
      )
    }
  }

  return (
    <View style={styles.root}>
      {error && <ErrorPopup error={error} />}
      <View style={styles.imageContainer}>
        {renderVideoOrImage()}
        {loading &&
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color="white" />
        </View>
        }
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.leftButton} onPress={handleCreateStory}>
          <MaterialCommunityIcons name="camera-plus" size={30} color="white" />
          <Text style={styles.leftButtonText}>Add To Story</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightButton} onPress={() => navigation.navigate('add-memory', { ...photo })}>
          <Text>Create Memory</Text>
          <Entypo name="chevron-right" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
})
