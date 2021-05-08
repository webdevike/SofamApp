import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, Button, TouchableOpacity, StyleSheet } from "react-native"
import { Screen, Text } from "../components"
import { AntDesign } from '@expo/vector-icons'
import { color, spacing } from "../theme"
import { ImageSlider } from "../components/Slider/ImageSlider"
import { CommonActions, useNavigation } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"

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
  zIndex: 10,
  backgroundColor: color.palette.black
} as React.CSSProperties

const STORY_COUNT: ViewStyle = {
  backgroundColor: color.palette.white,
  height: 4,
  width: 30,
  borderRadius: 100,
  margin: 3
}

export const StoryScreen: Component = observer(function StoryScreen({ route }) {
  console.log("🚀 ~ file: story-screen.tsx ~ line 35 ~ StoryScreen ~ route", route)
  const navigation = useNavigation()
  return (
    <View style={IMAGE_OVERLAY_CONTAINER as ViewStyle}>
      <ImageSlider entries={route.params.User.Stories}/>
      {/* <View style={styles.indicators}>
        {[...Array(storyCount)].map((e, i) => <View style={STORY_COUNT} key={i}></View>)}
      </View> */}
      <TouchableOpacity onPress={() => navigation.dispatch(CommonActions.goBack())} style={{ position: "absolute", right: 25, top: 125, backgroundColor: "lightgray", borderRadius: 100, width: 25, height: 25, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <AntDesign name="close" size={15} color="black" />
      </TouchableOpacity>
      <StatusBar style='light' />
    </View>
  )
})

const styles = StyleSheet.create({
  indicators: {
    flexDirection: 'row',
    justifyContent: "center",
    left: 0,
    paddingHorizontal: 8,
    position: "absolute",
    right: 0,
    top: 50
  },
})
