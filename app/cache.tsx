import { makeVar, InMemoryCache } from "@apollo/client"

export const accessTokenVar = makeVar("")
export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        stories: {
          // Short for always preferring incoming over existing data.
          merge: false,
        },
      },
    },
  },
})
