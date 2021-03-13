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
import jwtDecode from "jwt-decode"
import { Text } from "react-native"

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

const setToken = async () => {
  const token = await loadString("@authToken")
  accessTokenVar(!!token)
  return token
}

const decodeToken = (token) => {
  return jwtDecode(token)
}

async function getUser() {
  const token = await loadString("@authToken")
  return decodeToken(token)
}

const AuthContext = React.createContext(null)
function AuthProvider({ children }) {
  const [state, setState] = React.useState({
    status: 'pending',
    error: null,
    user: null,
  })
  React.useEffect(() => {
    getUser().then(
      user => setState({ status: 'success', error: null, user }),
      error => setState({ status: 'error', error, user: null }),
    )
  }, [])

  return (
    <AuthContext.Provider value={state}>
      {state.status === 'pending' ? (
        <Text>Loading</Text>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export function useAuthState() {
  const state = React.useContext(AuthContext)
  const isPending = state.status === 'pending'
  const isError = state.status === 'error'
  const isSuccess = state.status === 'success'
  const isAuthenticated = state.user && isSuccess
  return {
    ...state,
    isPending,
    isError,
    isSuccess,
    isAuthenticated,
  }
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const firestore = firebase.firestore()

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

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
    uri: 'https://tops-phoenix-38.hasura.app/v1/graphql',
    // uri: 'https://sofam-api.ikey2244.vercel.app/graphql'
    // uri: 'https://sofam-api.herokuapp.com/graphql'
    // uri: Platform.OS === 'android' ? 'http://192.168.0.12:4000/graphql' : 'http://192.168.1.113:4000/graphql'
  })

  const authLink = setContext(async (_, { headers }) => {
    const token = await setToken()
    const decodedToken = decodeToken(token)
    const hasuraHeaders = decodedToken['https://hasura.io/jwt/claims']
    return {
      headers: {
        // 'x-hasura-admin-secret': 'qqzN2LIvQyzDU8XUn07mw3vJFyE3iTEYrgCgDyxZh07zy4F',
        ...hasuraHeaders,
        'X-Hasura-User-ID': hasuraHeaders['x-hasura-user-id'],
        'X-Hasura-Role': hasuraHeaders['x-hasura-default-role'],
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  })

  useEffect(() => {
    ; (async () => {
      await setToken()
      // await checkAuth()
      await initFonts()
      setupRootStore().then(setRootStore)
    })()
  }, [])
  if (!rootStore) return null

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    console.log("🚀 ~ file: app.tsx ~ line 108 ~ errorLink ~ networkError", networkError)
    console.log("🚀 ~ file: app.tsx ~ line 108 ~ errorLink ~ graphQLErrors", graphQLErrors)
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
          <AuthProvider>
            <RootNavigator
              ref={navigationRef}
              initialState={initialNavigationState}
              onStateChange={onNavigationStateChange}
            />
          </AuthProvider>
        </SafeAreaProvider>
      </RootStoreProvider>
    </ApolloProvider>
  )
}

export default App
