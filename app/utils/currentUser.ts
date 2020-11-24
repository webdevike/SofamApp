import { gql, useQuery } from "@apollo/client"

const ME = gql`
   {
    me {
      id
      name
      profilePicture
    }
  }
`

export function currentUser() {
  const { loading, data } = useQuery(ME)

  if (!loading) return data
}
