/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { HomeScreen, DemoScreen, ProfileScreen, MemoryScreen, ChatScreen, CalendarScreen, AddMemoryScreen, CameraScreen } from "../screens"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { AntDesign, Octicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { ReactNativeFile } from 'apollo-upload-client'
import { View, TouchableOpacity, ViewStyle, TextStyle, Platform, Alert } from "react-native"
import * as Haptics from 'expo-haptics'
import { color } from '../theme/color'
import { Header } from "../components"
import { spacing } from "../theme"
import { useNavigation, useRoute } from "@react-navigation/native"

export type PrimaryParamList = {
  home: undefined,
  story: undefined
}

const Tab = createBottomTabNavigator()

const DEMO: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.black,
  marginTop: 20
}
const BOLD: TextStyle = { fontWeight: "bold" }
const DEMO_TEXT: TextStyle = {
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}

const HEADER_TITLE: TextStyle = {
  color: color.palette.black,
  fontSize: 18,
  fontWeight: "800"
}

export function PrimaryNavigator(props) {
  const route = useRoute()
  const navigation = useNavigation()
  const currentScreen = route.state?.index

  const goToPage = () => {
    navigation.navigate('profile')
  }

  const getCurrentScreen = () => {
    if (currentScreen === 0) return 'Stories'
    if (currentScreen === 2) return 'Profile'
    if (currentScreen === 3) return 'Memories'
    if (currentScreen === 4) return 'Group Chat'
    if (currentScreen === 5) return 'Calendar'
    else return 'Stories'
  }

  return (
    <>
      <Header
        onRightPress={goToPage}
        headerText={getCurrentScreen()}
        rightIcon="bullet"
        titleStyle={HEADER_TITLE}
      />
      <Tab.Navigator
        tabBarOptions={{
          style: {
            display: "none"
          }
        }}>
        <Tab.Screen name="home" component={HomeScreen} />
        <Tab.Screen name="demo" component={DemoScreen} />
        <Tab.Screen name="profile" component={ProfileScreen} />
        <Tab.Screen name="memory" component={MemoryScreen} />
        <Tab.Screen name="chat" component={ChatScreen} />
        <Tab.Screen name="calendar" component={CalendarScreen} />
      </Tab.Navigator>

      <View style={{
        flexDirection: "row",
        height: 75,
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
        backgroundColor: "white"
      }}>
        <TouchableOpacity onPress={() => props.navigation.navigate("home")}>
          <Octicons name="home" size={30} color={currentScreen === 0 ? color.palette.orange : color.palette.black} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("memory")}>
          <Octicons name="file-media" size={30} color={currentScreen === 3 ? color.palette.orange : color.palette.black} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          Haptics.notificationAsync()
          navigation.navigate('camera-screen')
        }} style={{
          marginBottom: 25,
          backgroundColor: color.palette.black,
          borderRadius: 100,
          width: 40,
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>

          <AntDesign name="plus" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("chat")}>
          <Octicons name="comment-discussion" size={30} color={currentScreen === 4 ? color.palette.orange : color.palette.black} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("calendar")}>
          <Octicons name="calendar" size={30} color={currentScreen === 5 ? color.palette.orange : color.palette.black} />
        </TouchableOpacity>
      </View>
    </>
  )
}

export const canExit = (routeName: string) => exitRoutes.includes(routeName)
