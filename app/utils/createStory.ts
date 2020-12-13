import { gql, useMutation } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import { ReactNativeFile } from 'apollo-upload-client'
import { uploadImage } from './uploadImage'

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
export const handleCreateStory = async (photo) => {
  const navigation = useNavigation()
  const [createStory] = useMutation(CREATE_STORY)
  const filename = photo.uri.split('/').pop()

  const file = new ReactNativeFile({
    uri: photo.uri,
    name: filename,
    type: 'jpeg'
  })
  try {
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
    uploadImage(file, data.createStory.signedRequest)
    navigation.navigate('home')
  } catch (error) {
    console.log("AddStoryScreen -> error", error)
  }
}
