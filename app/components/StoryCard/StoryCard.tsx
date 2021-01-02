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
        source={{ uri }}
        style={styles.IMAGE}
      />
    </View>
  )
}
