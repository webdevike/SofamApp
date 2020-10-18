import { makeVar, InMemoryCache } from "@apollo/client"

export const accessTokenVar = makeVar("")
export const cache: InMemoryCache = new InMemoryCache({
  // this may cause issues down the line but it works soo YOLO
  typePolicies: {
    User: {
      fields: {
        stories: {
          merge(existing, incoming) {
            // Better, but not quite correct.
            return incoming
          },
        },
      },
    },
  },
})
