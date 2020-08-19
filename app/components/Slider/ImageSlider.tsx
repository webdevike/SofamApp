import React, { Component } from "react"
import Carousel from "react-native-snap-carousel"
import { View, Image, ImageStyle } from "react-native"
const IMAGE_OVERLAY: ImageStyle = {
  backgroundColor: 'orange',
  height: "100%",
  width: "100%"
}

export class ImageSlider extends Component {
  [x: string]: any
  _renderItem = ({ item }) => {
    return (
      <View>
        <Image style={IMAGE_OVERLAY} source={{ uri: item.url }} />
      </View>
    )
  }

  render() {
    return (
      <Carousel
        ref={c => { this._carousel = c }}
        data={this.props.entries}
        renderItem={this._renderItem}
        sliderWidth={500}
        itemWidth={500}
      />
    )
  }
}
