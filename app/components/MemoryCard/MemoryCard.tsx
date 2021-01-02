import React, { FunctionComponent as Component } from "react"
import { View, Text, Image } from "react-native"
import { currentUser } from "../../utils/currentUser"
import { memoryCardStyles as styles } from "./MemoryCard.styles"

export interface MemoryCardProps {
  data: {
    title: string,
    description: string,
  }
}

export const MemoryCard: Component<MemoryCardProps> = ({ data }) => {
  const user = currentUser()
  return (
    <View style={styles.WRAPPER}>
      <Text style={styles.TITLE}>{data.title}</Text>
      <Text style={styles.DESCRIPTION}>{data.description}</Text>
      <Image style={styles.PROFILE_IMAGE} source={{ uri: user?.me?.profilePicture || 'https://images.unsplash.com/photo-1529405643518-5cf24fddfc0b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80' }} />
    </View>
  )
}
