import "./i18n"
import "./utils/ignore-warnings"
import React, { useState, useEffect, useRef, FunctionComponent as Component } from "react"
import { NavigationContainerRef } from "@react-navigation/native"
import { SafeAreaProvider, initialWindowSafeAreaInsets } from "react-native-safe-area-context"
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
import { ApolloClient, ApolloProvider, gql, ApolloLink } from "@apollo/client"
import { onError } from "@apollo/client/link/error"
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context'
import { cache } from './cache'
// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
import { enableScreens } from "react-native-screens"
import { loadString } from "./utils/storage"

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
    // uri: 'https://infinite-wave-95577.herokuapp.com/graphql'
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
    const token = await loadString("@authToken")
    cache.writeQuery({
      query: gql`{isLoggedIn @client}`,
      data: {
        isLoggedIn: !!token,
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

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    // console.log("errorLink -> graphQLErrors", graphQLErrors)
    // console.log("errorLink -> networkError", networkError)
  })

  const client = new ApolloClient({
    link: ApolloLink.from([authLink, errorLink, uploadLink]),
    cache,
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
