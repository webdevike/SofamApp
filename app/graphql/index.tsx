// * mutations
import { gql } from "@apollo/client"

const CREATE_STORY = gql`
  mutation createStory($file: Upload!) {
    createStory(file: $file) {
      id
      url
      signedRequest
    }
  }
`

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
const REGISTER = gql`
  mutation register(
    $email: String!
    $password: String!
    $name: String!
    $secretCode: String!
    $profilePicture: Upload!
  ) {
    register(
      data: {
        email: $email
        password: $password
        name: $name
        secretCode: $secretCode
        profilePicture: $profilePicture
      }
    ) {
      accessToken
      signedRequest
      user {
        id
        name
        profilePicture
      }
    }
  }
`

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

// * Queries
const USERS = gql`
  query getUsers{
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
const MEMORIES = gql`
query allMemories {
  memories {
    id
    title
    description
    location
    thumbnail
  }
}
`

// * Local Cache
const IS_LOGGED_IN = gql`
  query isLoggedIn{
    isLoggedIn @client
  }
`

export { CREATE_STORY, REGISTER, LOGIN, USERS, CREATE_MEMORY, MEMORIES, IS_LOGGED_IN }
