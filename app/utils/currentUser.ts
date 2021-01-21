import { MeDocument } from './../generated/graphql'
import { gql, useQuery } from "@apollo/client"

export function currentUser() {
  const { loading, data } = useQuery(MeDocument)

  if (!loading) return data
}
