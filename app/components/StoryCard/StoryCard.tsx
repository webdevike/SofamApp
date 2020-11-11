import React, { FunctionComponent as Component } from "react"
import { View } from "react-native"
import { ProgressiveImage } from "../ProgressiveImage/ProgressiveImage"
import { storyCardStyles as styles } from "./StoryCard.styles"

export interface StoryCardProps {
  uri: string,
  name: string,
}

export const StoryCard: Component<StoryCardProps> = ({ uri }) => {
  return (
    <View style={styles.IMAGE_CONTAINER}>
      <ProgressiveImage
        thumbnailSource={{ uri: `https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1915&q=80` }}
        source={{ uri }}
        style={styles.IMAGE}
      />
    </View>
  )
}
