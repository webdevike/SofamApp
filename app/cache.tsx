import { makeVar, InMemoryCache } from "@apollo/client"

export const accessTokenVar = makeVar(true)
export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn() {
          return accessTokenVar()
        }
      }
    }
  }
})
