import React, { useContext, useEffect, useState } from "react"
import { NavigationContainer, NavigationContainerRef, useNavigation } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { PrimaryNavigator } from "./primary-navigator"
import { AuthNavigator } from "./auth-navigator"
import { useReactiveVar } from "@apollo/client"
import { AddMemoryScreen, AddStoryScreen, CameraScreen, CreateScreen, LoginScreen, StoryScreen } from "../screens"
import { accessTokenVar } from "../cache"
import { color } from "../theme"
import { AuthContext } from "../context/AuthProvider"
import { Text } from "react-native"
import * as firebase from 'firebase'
import { saveString } from "../utils/storage"

export type RootParamList = {
  primaryStack: undefined
  authStack: undefined
}

const Stack = createStackNavigator<RootParamList>()

const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="primaryStack"
        component={PrimaryNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="story"
        component={StoryScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-memory"
        component={AddMemoryScreen}
        options={{
          headerStyle: {
            backgroundColor: color.palette.black,
          },
          headerTitle: "",
          headerBackTitleVisible: false,
          headerTintColor: color.palette.white
        }}
      />
      <Stack.Screen
        name="camera-screen"
        component={CameraScreen}
        options={{
          headerStyle: {
            backgroundColor: color.palette.black,
          },
          headerTitle: "",
          headerBackTitleVisible: false,
          headerTintColor: color.palette.white
        }}
      />
      <Stack.Screen
        name="create"
        component={CreateScreen}
        options={{
          headerStyle: {
            backgroundColor: color.palette.black,
          },
          headerTitle: "",
          headerBackTitleVisible: false,
          headerTintColor: color.palette.white
        }}
      />
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="authStack"
        component={AuthNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}

export const RootNavigator = React.forwardRef<NavigationContainerRef, Partial<React.ComponentProps<typeof NavigationContainer>>>((props, ref) => {
  const { user, setUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(true)
  const loggedIn = useReactiveVar(accessTokenVar)

  async function onAuthStateChanged(user) {
    setUser(user)
    if (user) console.log(user.apiKey)
    if (initializing) setInitializing(false)
    setLoading(false)
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber // unsubscribe on unmount
  }, [])

  if (loading) {
    return <Text>Helllo</Text>
  }

  return (
    <>
      <NavigationContainer {...props} ref={ref}>
        {user ? <RootStack /> : <AuthStack />}
      </NavigationContainer>
    </>
  )
})

RootNavigator.displayName = "RootNavigator"
