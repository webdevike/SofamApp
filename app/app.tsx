import "./i18n"
import "./utils/ignore-warnings"
import React, { useState, useEffect, useRef, FunctionComponent as Component } from "react"
import { NavigationContainerRef } from "@react-navigation/native"
import { SafeAreaProvider, initialWindowSafeAreaInsets } from "react-native-safe-area-context"
import { createUploadLink } from 'apollo-upload-client'
import { initFonts } from "./theme/fonts"
import * as storage from "./utils/storage"
import {
  useBackButtonHandler,
  RootNavigator,
  canExit,
  setRootNavigation,
  useNavigationPersistence,
} from "./navigation"
import { RootStore, RootStoreProvider, setupRootStore } from "./models"
import { ApolloClient, ApolloProvider, gql, createHttpLink } from "@apollo/client"
import { setContext } from '@apollo/client/link/context'
import { cache } from './cache'
// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
import { enableScreens } from "react-native-screens"
import { loadString } from "./utils/storage"

// const s3 = new AWS.S3({
//   accessKeyId: "minioadmin",
//   secretAccessKey: "minioadmin",
//   endpoint: "http://192.168.1.196:9001",
//   s3ForcePathStyle: true,
//   signatureVersion: "v4"
// })
// https://www.digitalocean.com/community/questions/upload-aws-s3-getsignedurl-with-correct-permissions-and-content-type
// s3.getSignedUrl

// s3.getSignedUrl('putObject', {
//   Bucket: 'sofam',
//   ContentType: type,
//   ACL: 'public-read',
//   Key: 'random-key'
// }, (error, url) => {
//   if (error) {
//     console.log(error)
//   }
//   console.log('KEY:', key)
//   console.log('URL:', url)
//   res.send({ key, url })
// })

// s3.listObjects({ Bucket: "sofam" }, (err, data) => {
//   console.log(err, 'this is the error')
//   console.log(data, 'this is the data')
// })

enableScreens()

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

/**
 * This is the root component of our app.
 */
const App: Component<{}> = () => {
  const navigationRef = useRef<NavigationContainerRef>()
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)

  setRootNavigation(navigationRef)
  useBackButtonHandler(navigationRef, canExit)
  const { initialNavigationState, onNavigationStateChange } = useNavigationPersistence(
    storage,
    NAVIGATION_PERSISTENCE_KEY,
  )

  const uploadLink = createUploadLink({
    uri: 'https://sofam-api.ikey2244.vercel.app/graphql'
    // uri: 'http://localhost:4000/graphql'
  })

  const authLink = setContext(async (_, { headers }) => {
    const token = await loadString("@authToken")
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  })

  const checkAuth = async () => {
    cache.writeQuery({
      query: gql`{isLoggedIn @client}`,
      data: {
        isLoggedIn: await !!loadString("@authToken"),
      },
    })
  }

  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    ; (async () => {
      await checkAuth()
      await initFonts()
      setupRootStore().then(setRootStore)
    })()
  }, [])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color. You can replace
  // with your own loading component if you wish.
  if (!rootStore) return null

  const client = new ApolloClient({
    link: authLink.concat(uploadLink),
    cache
  })

  // otherwise, we're ready to render the app
  return (
    <ApolloProvider client={client}>
      <RootStoreProvider value={rootStore}>
        <SafeAreaProvider initialSafeAreaInsets={initialWindowSafeAreaInsets}>
          <RootNavigator
            ref={navigationRef}
            initialState={initialNavigationState}
            onStateChange={onNavigationStateChange}
          />
        </SafeAreaProvider>
      </RootStoreProvider>
    </ApolloProvider>
  )
}

export default App
