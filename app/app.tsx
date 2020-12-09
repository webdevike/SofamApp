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
import { ApolloClient, ApolloProvider, gql, ApolloLink, useReactiveVar } from "@apollo/client"
import { onError } from "@apollo/client/link/error"
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context'
import { accessTokenVar, cache } from './cache'
import * as firebase from 'firebase'
import 'firebase/firestore'
import { enableScreens } from "react-native-screens"
import { loadString } from "./utils/storage"
import { Platform } from "react-native"

enableScreens()

const firebaseConfig = {
  apiKey: "AIzaSyAq-F_nrtxrHYHRA7q534GQQ6RPJloBukM",
  authDomain: "sofam-448ea.firebaseapp.com",
  databaseURL: "https://sofam-448ea.firebaseio.com",
  projectId: "sofam-448ea",
  storageBucket: "sofam-448ea.appspot.com",
  messagingSenderId: "910753072077",
  appId: "1:910753072077:web:2538140ccf4efa85d97a84",
  measurementId: "G-1RLFNSRZRH"
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const firestore = firebase.firestore()

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

/**
 * This is the root component of our app.
 */
const App: Component<{}> = () => {
  const navigationRef = useRef<NavigationContainerRef>()
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined)
  const loggedIn = useReactiveVar(accessTokenVar)

  setRootNavigation(navigationRef)
  useBackButtonHandler(navigationRef, canExit)
  const { initialNavigationState, onNavigationStateChange } = useNavigationPersistence(
    storage,
    NAVIGATION_PERSISTENCE_KEY,
  )

  const uploadLink = createUploadLink({
    // uri: 'https://sofam-api.ikey2244.vercel.app/graphql'
    // uri: 'https://infinite-wave-95577.herokuapp.com/graphql'
    uri: Platform.OS === 'android' ? 'http://192.168.0.12:4000/graphql' : 'http://localhost:4000/graphql'
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

  const setToken = async () => {
    const token = await loadString("@authToken")
    accessTokenVar(!!token)
  }
  const checkAuth = async () => {
    cache.writeQuery({
      query: gql`{isLoggedIn @client}`,
      data: {
        isLoggedIn: loggedIn,
      },
    })
  }

  // Kick off initial async loading actions, like loading fonts and RootStore
  useEffect(() => {
    let isMounted = true
    ; (async () => {
      if (isMounted) {
        await setToken()
        await checkAuth()
        await initFonts()
        setupRootStore().then(setRootStore)
      }
    })()
    return () => { isMounted = false }
  }, [])

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color. You can replace
  // with your own loading component if you wish.
  if (!rootStore) return null

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    console.log("errorLink -> graphQLErrors", graphQLErrors)
    console.log("errorLink -> networkError", networkError)
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
