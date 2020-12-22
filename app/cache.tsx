import { makeVar, InMemoryCache } from "@apollo/client"

export const accessTokenVar = makeVar("")
export const cache: InMemoryCache = new InMemoryCache()
