import React, { FunctionComponent as Component } from "react"
import { View, Text, Image } from "react-native"
import { memoryCardStyles as styles } from "./MemoryCard.styles"

export interface MemoryCardProps {
  data: {
    title: string,
    description: string,
  }
}

export const MemoryCard: Component<MemoryCardProps> = ({ data }) => {
  console.log("data", data)
  return (
    <View style={styles.WRAPPER}>
      <Text style={styles.TITLE}>{data.title}</Text>
      <Text style={styles.DESCRIPTION}>{data.description}</Text>
      {/* <Image style={styles.PROFILE_IMAGE} source={{ uri: "https://api.adorable.io/avatars/285/abott@adorable.png" }} defaultSource={ require('../../../assets/loading.png')} /> */}
    </View>
  )
}
