import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, Button } from "react-native"
import { Screen, Text } from "../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"
import { color } from "../theme"
import { ImageSlider } from "../components/Slider/ImageSlider"
import { CommonActions, useNavigation } from "@react-navigation/native"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

const IMAGE_OVERLAY_CONTAINER = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  width: "100%",
  height: "100%",
  flex: 1,
  backgroundColor: "black",
  zIndex: 10,
} as React.CSSProperties

export const StoryScreen: Component = observer(function StoryScreen({ route }) {
  const navigation = useNavigation()
  return (
    <View style={IMAGE_OVERLAY_CONTAINER as ViewStyle}>
      <ImageSlider entries={route.params.stories}/>
      <Button title="Press" onPress={() => navigation.dispatch(CommonActions.goBack())}/>
    </View>
  )
})
