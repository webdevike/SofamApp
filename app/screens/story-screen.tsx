import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, Button, TouchableOpacity } from "react-native"
import { Screen, Text } from "../components"
import { AntDesign } from '@expo/vector-icons'
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
  backgroundColor: "red",
  zIndex: 10,
} as React.CSSProperties

export const StoryScreen: Component = observer(function StoryScreen({ route }) {
  const navigation = useNavigation()
  return (
    <View style={IMAGE_OVERLAY_CONTAINER as ViewStyle}>
      <ImageSlider entries={route.params.stories}/>
      <TouchableOpacity onPress={() => navigation.dispatch(CommonActions.goBack())} style={{ position: "absolute", right: 25, top: 75, backgroundColor: "lightgray", borderRadius: "100%", width: 25, height: 25, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <AntDesign name="close" size={15} color="black" />
      </TouchableOpacity>
    </View>
  )
})
