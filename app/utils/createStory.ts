import { gql } from '@apollo/client'
import { ReactNativeFile } from 'apollo-upload-client'
import { Alert } from 'react-native'
import { uploadImage } from './uploadImage'

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
export const handleCreateStory = async (photo, createStory, navigation) => {
  try {
    const filename = photo.uri.split('/').pop()

    const file = new ReactNativeFile({
      uri: photo.uri,
      name: filename,
      type: 'image/jpeg',
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

      // ! WHATEVER IS WRONG WITH THIS I THINK IT HAS TO DO WITH THE CACHE
      // ! WHEN I UPLOAD A PICTURE WITHOUT CACHE IT SEEMS TO WORK MORE TIMES THAN NOT
      // ! IF I UPLOAD SOMETHING WITH OPTIMSTIC UI ENABLED IT BREAKS LIKE 3/5 TIMES

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
    const success = await uploadImage(file, data.createStory.signedRequest)
    if (success) {
      navigation.navigate('home')
    } else {
      Alert.alert('someting when wrong')
    }
  } catch (error) {
    console.log(error)
  }
}
