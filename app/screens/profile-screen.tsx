import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, Text, TouchableOpacity, FlatList } from "react-native"
import { Screen } from "../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"
import { color } from "../theme"
import { cache } from "../cache"
import { gql } from "@apollo/client"
import { remove } from "../utils/storage"
import { otherwise } from "ramda"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

export const ProfileScreen: Component = observer(function ProfileScreen() {
  const renderItem = ({ item }) => {
    return (
      <Text>{item.title}</Text>
    )
  }

  const data = [
    { id: 1, title: 'hello' },
    { id: 2, title: 'w' },
    { id: 3, title: 'wer' },
  ]

  return (
    <Screen style={ROOT} preset="scroll">
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </Screen>
  )
})
