import { decodeToken } from './../app'
import { MeDocument } from './../generated/graphql'
import { gql, useQuery } from "@apollo/client"
import { loadString } from './storage'

const ME = gql`
  query me($userId: String_comparison_exp = {_eq: ""}) {
    User(where: {userId: $userId}) {
      id
      name
      profilePicture
    }
  }
`

export async function currentUser() {
  const { loading, data, error } = useQuery(ME)

  if (!loading) return data
}
