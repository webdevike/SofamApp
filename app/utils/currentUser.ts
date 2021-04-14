import { MeDocument } from './../generated/graphql'
import { useQuery } from "@apollo/client"

export function currentUser() {
  const { loading, data } = useQuery(MeDocument)

  return {
    loading,
    user: data
  }
}
