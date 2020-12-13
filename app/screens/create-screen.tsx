import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { Image, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { Screen, Text, Button } from "../components"
import { color, spacing } from "../theme"
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'

import { gql, useMutation } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import { ReactNativeFile } from 'apollo-upload-client'
import { uploadImage } from "../utils/uploadImage"
import { cache } from "../cache"
// import { handleCreateStory } from "../utils/createStory"

const ROOT: ViewStyle = {
  flex: 1,
  backgroundColor: 'black'
}

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
  rightButton: {
    alignItems: 'center',
    backgroundColor: color.palette.lightGreen,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: "space-evenly",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  }
})

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

export const CreateScreen: Component = observer(function CreateScreen({ route }) {
  const photo = route.params
  const [createStory] = useMutation(CREATE_STORY)
  const navigation = useNavigation()

  const handleCreateStory = async () => {
    const filename = photo.uri.split('/').pop()

    const file = new ReactNativeFile({
      uri: photo.uri,
      name: filename,
      type: 'image/jpeg',
    })
    console.log("🚀 ~ file: create-screen.tsx ~ line 95 ~ handleCreateStory ~ file", file)
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

        // ! WHATEVER IS WRONG WITH THIS I THINK IT HAS TO DO WITH THE CACHE
        // ! WHEN I UPLOAD A PICTURE WITHOUT CACHE IT SEEMS TO WORK MORE TIMES THAN NOT
        // ! IF I UPLOAD SOMETHING WITH OPTIMSTIC UI ENABLED IT BREAKS LIKE 3/5 TIMES

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

      const success = await uploadImage(file, data.createStory.signedRequest)
      console.log("🚀 ~ file: create-screen.tsx ~ line 134 ~ handleCreateStory ~ success", success)
      if (success) {
        navigation.navigate('home')
      } else {
        alert('someting when wrong')
      }
    } catch (error) {
      console.log("🚀 ~ file: create-screen.tsx ~ line 140 ~ handleCreateStory ~ error", error)
    }
  }

  return (
    <View style={ROOT} >
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: photo.uri }} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.leftButton} onPress={handleCreateStory}>
          {/* <MaterialCommunityIcons name="camera-plus" size={30} color="white" /> */}
          <Text style={styles.leftButtonText}>Add To Story</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightButton} onPress={() => console.log('hello')}>
          <Text>Create Memory</Text>
          <Entypo name="chevron-right" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
})
