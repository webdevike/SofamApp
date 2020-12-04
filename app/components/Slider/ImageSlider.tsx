import React, { Component } from "react"
import Carousel from "react-native-snap-carousel"
import { View, Image, ImageStyle, Dimensions, Text } from "react-native"
import { Video } from "expo-av"
import { ProgressiveImage } from ".."

const dimensions = Dimensions.get('window')
const imageWidth = dimensions.width

const IMAGE_OVERLAY: ImageStyle = {
  height: 550,
  width: imageWidth
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
              height: 550,
            }}
          />
        )
      } else {
        return (
          <ProgressiveImage
            thumbnailSource={{ uri: `https://images.pexels.com/photos/593158/pexels-photo-593158.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260&buster=${Math.random()}` }}
            source={{ uri: item.url }}
            style={IMAGE_OVERLAY}
          />
        )
      }
    }
    return (
      <>
        { renderVidoeOrThumbnail() }
      </>
    )
  }

  render() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
      }}>
        <Carousel
          ref={c => { this._carousel = c }}
          data={this.props.entries}
          renderItem={this._renderItem}
          sliderWidth={imageWidth}
          itemWidth={imageWidth}
        />
        {/* <Text>Hello?</Text> */}
      </View>
    )
  }
}
