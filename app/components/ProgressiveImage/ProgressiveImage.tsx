import React, { FunctionComponent as Component } from "react"
import { Image, View, Animated } from "react-native"
import { progressiveImageStyles as styles } from "./ProgressiveImage.styles"

export interface ProgressiveImageProps {
  source: {
    uri: string;
  };
  [x: string]: any;
}

export const ProgressiveImage: Component<ProgressiveImageProps> = props => {
  const thumbnailAnimated = new Animated.Value(0)

  const imageAnimated = new Animated.Value(0)

  const handleThumbnailLoad = () => {
    Animated.timing(thumbnailAnimated, {
      useNativeDriver: true,
      toValue: 1,
    }).start()
  }

  const onImageLoad = () => {
    Animated.timing(imageAnimated, {
      useNativeDriver: true,
      toValue: 1,
    }).start()
  }
  const {
    thumbnailSource,
    source,
    style,
  } = props
  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: "https://images.unsplash.com/photo-1529405643518-5cf24fddfc0b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" }}
        style={[style, { opacity: thumbnailAnimated }]}
        onLoad={handleThumbnailLoad}
        blurRadius={10}
      />
      <Animated.Image
        {...props}
        source={source}
        style={[styles.imageOverlay, { opacity: imageAnimated }, style]}
        onLoad={onImageLoad}
      />
    </View>
  )
}
