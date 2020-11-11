import React, { Component } from "react"
import Carousel from "react-native-snap-carousel"
import { View, Image, ImageStyle, Dimensions, Text } from "react-native"
import { Video } from "expo-av"

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
          <Image style={IMAGE_OVERLAY} source={{ uri: item.url }} />
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
