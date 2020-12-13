import React from "react"
import { NavigationContainer, NavigationContainerRef, useNavigation } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { PrimaryNavigator } from "./primary-navigator"
import { AuthNavigator } from "./auth-navigator"
import { useReactiveVar } from "@apollo/client"
import { AddMemoryScreen, AddStoryScreen, CameraScreen, CreateScreen, LoginScreen, StoryScreen } from "../screens"
import { accessTokenVar } from "../cache"
import { color } from "../theme"

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
      {/* <Stack.Screen
        name="add-story"
        component={AddStoryScreen}
        options={{
          headerStyle: {
            backgroundColor: color.palette.black,
          },
          headerTitle: "",
          headerBackTitleVisible: false,
          headerTintColor: color.palette.white
        }}
      /> */}
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
  const loggedIn = useReactiveVar(accessTokenVar)
  return (
    <>
      <NavigationContainer {...props} ref={ref}>
        {loggedIn ? <RootStack /> : <AuthStack />}
      </NavigationContainer>
    </>
  )
})

RootNavigator.displayName = "RootNavigator"
