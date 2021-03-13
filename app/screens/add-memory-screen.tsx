import React, { FunctionComponent as Component, useState } from "react"
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View, ViewStyle } from "react-native"
import { FormRow, Button, ErrorPopup } from "../components"
import { color, spacing, typography } from "../theme"
import { ReactNativeFile } from 'apollo-upload-client'
import { useNavigation, } from "@react-navigation/native"
import { uploadImage } from "../utils/uploadImage"
import { Video } from "expo-av"
import { AllMemoriesDocument, AllMemoriesQuery, useCreateMemoryMutation } from "../generated/graphql"

const styles = StyleSheet.create({
  IMAGE_WITH_STORY: {
    flex: 1,
  },
  LOGIN_BUTTON: {
    backgroundColor: color.palette.black,
    borderRadius: 50,
    fontFamily: typography.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  LOGIN_BUTTON_TEXT: {
    color: color.palette.white,
    fontFamily: typography.primary,
    fontSize: 14,
    letterSpacing: 2,
  },
  ROOT: {
    backgroundColor: color.palette.white,
    flex: 1,
    position: 'relative'
  },
  TEXT_INPUT: {
    borderRadius: 50,
    marginBottom: spacing[5],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
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
  video: {
    flex: 1,
    height: 250
  },
})

export const AddMemoryScreen: Component = function AddMemoryScreen(props) {
  const fileData = props.route.params
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [createMemory, { loading, error }] = useCreateMemoryMutation()
  const navigation = useNavigation()

  const handleCreateMemory = async () => {
    const filename = fileData.uri.split('/').pop()
    const file = new ReactNativeFile({
      uri: fileData.uri,
      name: filename,
      type: "image/jpeg"
    })
    try {
      const { data } = await createMemory({
        variables: {
          file,
          title,
          description
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createMemory: {
            __typename: "Memory",
            id: Math.round(Math.random() * -1000000).toString(),
            thumbnail: file.uri,
            title: "TESTING IF OPTIMSTIC RESPONSE IS WORKING",
          }
        },
        update: (proxy, { data: { createMemory } }) => {
          const data: AllMemoriesQuery = proxy.readQuery({ query: AllMemoriesDocument })
          proxy.writeQuery({
            query: AllMemoriesDocument,
            data: {
              memories: [...data.memories, createMemory]
            }
          })
        }
      })
      if (data && !loading && !error) {
        navigation.navigate('memory')
        uploadImage(file, data.createMemory.signedRequest)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const renderVideoOrImage = () => {
    if (fileData?.uri.includes('.mov')) {
      return (
        <Video
          source={{ uri: fileData?.uri }}
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
        <Image style={styles.IMAGE_WITH_STORY} source={{ uri: fileData?.uri }} />
      )
    }
  }
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.ROOT} >
      {renderVideoOrImage()}
      <FormRow preset="top">
        <TextInput
          placeholderTextColor="#BDBDBD"
          style={styles.TEXT_INPUT}
          onChangeText={text => setTitle(text)}
          value={title}
          placeholder="Title"
          autoCapitalize="none"
        />
        <TextInput
          placeholderTextColor="#BDBDBD"
          style={styles.TEXT_INPUT}
          onChangeText={text => setDescription(text)}
          value={description}
          placeholder="Description"
          autoCapitalize="none"
        />
        <Button
          style={styles.LOGIN_BUTTON}
          textStyle={styles.LOGIN_BUTTON_TEXT}
          text="Create Memory"
          onPress={handleCreateMemory}
        />
      </FormRow>
      {loading &&
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color="white" />
        </View>}
      {error && <ErrorPopup error={error} />}
    </KeyboardAvoidingView>
  )
}
