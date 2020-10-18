import React, { FunctionComponent as Component } from "react"
import { View, Text, Image } from "react-native"
import { memoryCardStyles as styles } from "./MemoryCard.styles"

export interface MemoryCardProps {
  data: {
    title: string,
  }
}

export const MemoryCard: Component<MemoryCardProps> = ({ data }) => {
  return (
    <View style={styles.WRAPPER}>
      <Text style={styles.TITLE}>{data.title}</Text>
      <Text style={styles.DESCRIPTION}>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet</Text>
      <Image style={styles.PROFILE_IMAGE} source={{ uri: "https://api.adorable.io/avatars/285/abott@adorable.png" }} />
    </View>
  )
}
