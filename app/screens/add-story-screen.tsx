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
    stories {
      id
      url
    }
  }
}
`
export const AddStoryScreen: Component = function AddStoryScreen(props) {
  const [fileData, setFileData] = useState({})
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [createStory] = useMutation(CREATE_STORY)
  const navigation = useNavigation()
  useEffect(() => {
    ; (async () => {
      const fileObject = await load("@fileObject")
      // the file that was chosen from the pickImage function
      setFileData(fileObject)
    })()
  }, [])

  const handleCreateStory = async () => {
    navigation.navigate('home')
    const filename = fileData.uri.split('/').pop()

    const file = new ReactNativeFile({
      uri: fileData.uri,
      name: filename,
      type: fileData.type
    })

    const { data } = await createStory({
      variables: {
        url: file.uri,
        file
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
    uploadImage(file, data.createStory.signedRequest, data.createStory.url)
  }
  return (
    <View style={ROOT} >
      <Image style={IMAGE_WITH_STORY} source={{ uri: fileData?.uri }} />
      <FormRow preset="top">
        <Button
          style={LOGIN_BUTTON}
          textStyle={LOGIN_BUTTON_TEXT}
          text="Create Memory"
          onPress={handleCreateStory}
        />
      </FormRow>
    </View>
  )
}
