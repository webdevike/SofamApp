import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, ViewStyle } from "react-native"
import { Screen, Text } from "../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"
import { color } from "../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const TEXT: TextStyle = {
  color: color.palette.black
}

export const ChatScreen: Component = observer(function ChatScreen() {
  return (
    <Screen style={ROOT} preset="scroll">
      <Text preset="header" text="Coming Soon" style={TEXT} />
    </Screen>
  )
})
