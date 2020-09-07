/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { HomeScreen, DemoScreen, ProfileScreen } from "../screens"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { AntDesign } from '@expo/vector-icons'
import BottomSheet from 'reanimated-bottom-sheet'
import { Text, View, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import * as Haptics from 'expo-haptics'
import { color } from '../theme/color'
import { Button } from "../components"
import { spacing } from "../theme"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type PrimaryParamList = {
  home: undefined,
  story: undefined
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Tab = createBottomTabNavigator()
// const Stack = createStackNavigator<PrimaryParamList>()

const DEMO: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#5D2555",
  marginTop: 20
}
const BOLD: TextStyle = { fontWeight: "bold" }
const DEMO_TEXT: TextStyle = {
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
}

export function PrimaryNavigator(props) {
  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      <View style={{ width: 100, height: 5, borderRadius: 10, backgroundColor: 'lightgray', marginTop: -40 }}></View>
      <Button
        style={DEMO}
        textStyle={DEMO_TEXT}
        tx="modal.createStory"
      />
      <Button
        style={DEMO}
        textStyle={DEMO_TEXT}
        tx="modal.createMemory"
      />
    </View>
  )
  const sheetRef = React.useRef(null)
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName
            if (route.name == 'home') {
              iconName = 'home'
            } else if (route.name == 'demo') {
              iconName = 'plussquareo'
            } else if (route.name == 'profile') {
              iconName = 'user'
            }

            return <AntDesign name={iconName} size={size} color={color} />
          }
        })}
        tabBarOptions={{
          showLabel: false,
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
          style: {
            display: "none"
          }
        }}>
        <Tab.Screen name="home" component={HomeScreen} />
        <Tab.Screen name="demo" component={DemoScreen} />
        <Tab.Screen name="profile" component={ProfileScreen} />
      </Tab.Navigator>

      <View style={{ flexDirection: "row", height: 75, justifyContent: "space-evenly", alignItems: "center", width: "100%", backgroundColor: "white" }}>
        <TouchableOpacity onPress={() => props.navigation.navigate("home")}><AntDesign name="home" size={25} color="#5D2555" /></TouchableOpacity>
        <TouchableOpacity onPress={() => {
          sheetRef.current.snapTo(0)
          Haptics.notificationAsync()
        }
        } style={{ marginBottom: 25, backgroundColor: color.primaryDarker, borderRadius: "100%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center" }}>

          <AntDesign name="plus" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("profile")}><AntDesign name="user" size={25} color="#5D2555" /></TouchableOpacity>
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[250, 0]}
        initialSnap={1}
        borderRadius={10}
        renderContent={renderContent}
      />
    </>
  )
}

export const canExit = (routeName: string) => exitRoutes.includes(routeName)
