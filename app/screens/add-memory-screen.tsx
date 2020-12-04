import { gql, useMutation } from "@apollo/client"
import React, { FunctionComponent as Component, useEffect, useState } from "react"
// import { observer } from "mobx-react-lite"
import { Image, ImageStyle, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { FormRow, Button } from "../components"
import { color, spacing, typography } from "../theme"
import { load } from "../utils/storage"
import { ReactNativeFile } from 'apollo-upload-client'
import { useNavigation, } from "@react-navigation/native"
import { uploadImage } from "../utils/uploadImage"
import { Video } from "expo-av"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1
}

const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}

const TEXT_INPUT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  marginBottom: spacing[5],
  borderRadius: 50,
  ...TEXT
}

const IMAGE_WITH_STORY: ImageStyle = {
  flex: 1,
}

const LOGIN_BUTTON: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.black,
  borderRadius: 50,
}

const LOGIN_BUTTON_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 14,
  color: color.palette.white,
  letterSpacing: 2,
}

const CREATE_MEMORY = gql`
mutation createMemory($file: Upload!, $title: String!, $location: String, $description: String ) {
  createMemory(file: $file, title: $title, location: $location, description: $description) {
    id
    title
    description
    thumbnail
    signedRequest
    url
  }
}`

const MEMORIES = gql`
{
  memories {
    id
    title
    description
    location
    thumbnail
  }
}
`
interface FileDataObject {
  uri: string
}
export const AddMemoryScreen: Component = function AddMemoryScreen() {
  const [fileData, setFileData] = useState<FileDataObject>()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [createMemory] = useMutation(CREATE_MEMORY)
  const navigation = useNavigation()
  useEffect(() => {
    ; (async () => {
      const fileObject = await load("@fileObject")
      // the file that was chosen from the pickImage function
      setFileData(fileObject)
    })()
  }, [])

  const handleCreateMemory = async () => {
    navigation.navigate('memory')
    const filename = fileData.uri.split('/').pop()

    const file = new ReactNativeFile({
      uri: fileData.uri,
      name: filename,
      type: fileData.type
    })

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
          id: Math.round(Math.random() * -1000000),
          location: "testing",
          thumbnail: file.uri,
          title: "TESTING IF OPTIMSTIC RESPONSE IS WORKING",
        }
      },
      update: (proxy, { data: { createMemory } }) => {
        const data = proxy.readQuery({ query: MEMORIES })
        proxy.writeQuery({
          query: MEMORIES,
          data: {
            memories: [...data.memories, createMemory]
          }
        })
      }
    })
    uploadImage(file, data.createMemory.signedRequest)
  }
  const renderVideoOrImage = () => {
    if (fileData?.uri.includes('.mov')) {
      return (
        <Video
          source={{ uri: fileData?.uri }}
          rate={1.0}
          volume={0}
          isMuted={false}
          resizeMode="contain"
          shouldPlay
          isLooping
          style={{
            height: 250,
            flex: 1,
          }}
        />
      )
    } else {
      return (
        <Image style={IMAGE_WITH_STORY} source={{ uri: fileData?.uri }} />
      )
    }
  }
  return (
    <View style={ROOT} >
      {renderVideoOrImage()}
      <FormRow preset="top">
        <TextInput
          placeholderTextColor="#BDBDBD"
          style={TEXT_INPUT}
          onChangeText={text => setTitle(text)}
          value={title}
          placeholder="Title"
          autoCapitalize="none"
        />
        <TextInput
          placeholderTextColor="#BDBDBD"
          style={TEXT_INPUT}
          onChangeText={text => setDescription(text)}
          value={description}
          placeholder="Description"
          autoCapitalize="none"
        />
        <Button
          style={LOGIN_BUTTON}
          textStyle={LOGIN_BUTTON_TEXT}
          text="Create Memory"
          onPress={handleCreateMemory}
        />
      </FormRow>
    </View>
  )
}
