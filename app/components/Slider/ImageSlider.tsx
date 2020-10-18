import React, { Component } from "react"
import Carousel from "react-native-snap-carousel"
import { View, Image, ImageStyle, Dimensions } from "react-native"
import { Video } from "expo-av"

const IMAGE_OVERLAY: ImageStyle = {
  height: "100%",
  width: "100%"
}

export class ImageSlider extends Component {
  [x: string]: any
  _renderItem = ({ item }) => {
    const uri = item?.url
    const renderVidoeOrThumbnail = () => {
      if (uri.includes('.mov')) {
        return (
          <Video
            source={{ uri }}
            rate={1.0}
            volume={0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={{
              height: "100%",
            }}
          />
        )
      } else {
        return (
          <Image style={IMAGE_OVERLAY} source={{ uri: item.url }} />
        )
      }
    }
    return (
      <View style={{ flex: 1 }}>
        {renderVidoeOrThumbnail()}
      </View>
    )
  }

  render() {
    return (
      <Carousel
        ref={c => { this._carousel = c }}
        data={this.props.entries}
        layout={'tinder'}
        renderItem={this._renderItem}
        sliderWidth={500}
        itemWidth={500}
      />
    )
  }
}
