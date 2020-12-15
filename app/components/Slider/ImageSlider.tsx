import React, { Component } from "react"
import Carousel, { Pagination } from "react-native-snap-carousel"
import { View, Image, ImageStyle, Dimensions, Text, Platform } from "react-native"
import { Video } from "expo-av"
import { ProgressiveImage } from ".."
import { sliderWidth, itemWidth } from './styles/SliderEntry.style'
import { color } from "../../theme"
import styles from "./styles"

const dimensions = Dimensions.get('window')
const imageWidth = dimensions.width

const IS_ANDROID = Platform.OS === 'android'
const SLIDER_1_FIRST_ITEM = 0

const IMAGE_OVERLAY: ImageStyle = {
  height: 500,
  width: imageWidth,
}

export class ImageSlider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM
    }
  }

  [x: string]: any
  _renderItem = ({ item, index }) => {
    const uri = item?.url
    const renderVidoeOrThumbnail = () => {
      if (uri.includes('.mov')) {
        return (
          <Video
            source={{ uri }}
            rate={1.0}
            volume={1}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            // isLooping
            style={{
              height: 500,
            }}
          />
        )
      } else {
        return (
          <>
            {/* <View style={{ backgroundColor: 'red' }}>
              <Text>{index}</Text>
            </View> */}
            <ProgressiveImage
              thumbnailSource={{ uri: `https://images.pexels.com/photos/593158/pexels-photo-593158.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260&buster=${Math.random()}` }}
              source={{ uri: item.url }}
              style={IMAGE_OVERLAY}
            />
          </>
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
    const { slider1ActiveSlide } = this.state
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
          // sliderWidth={sliderWidth}
          // itemWidth={itemWidth}
          // hasParallaxImages={true}
          firstItem={SLIDER_1_FIRST_ITEM}
          // inactiveSlideScale={0.94}
          // inactiveSlideOpacity={0.7}
          // containerCustomStyle={styles.slider}
          // contentContainerCustomStyle={styles.sliderContentContainer}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
        />
        {/* <Pagination
          dotsLength={this.props.entries.length}
          activeDotIndex={slider1ActiveSlide}
          containerStyle={styles.paginationContainer}
          dotColor={'rgba(255, 255, 255, 0.92)'}
          dotStyle={styles.paginationDot}
          inactiveDotColor={color.palette.lightGrey}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={this._carousel}
          tappableDots={!!this._carousel}
        /> */}
      </View>
    )
  }
}
