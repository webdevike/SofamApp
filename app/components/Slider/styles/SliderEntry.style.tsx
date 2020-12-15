import { StyleSheet, Dimensions, Platform } from 'react-native'
import { color } from '../../../theme'

const IS_IOS = Platform.OS === 'ios'
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100
  return Math.round(value)
}

const slideHeight = viewportHeight * 0.36
const slideWidth = wp(75)
const itemHorizontalMargin = wp(2)

export const sliderWidth = viewportWidth
export const itemWidth = slideWidth + itemHorizontalMargin * 2

const entryBorderRadius = 8

export default StyleSheet.create({
  slideInnerContainer: {
    height: slideHeight,
    paddingBottom: 18,
    paddingHorizontal: itemHorizontalMargin,
    width: itemWidth // needed for shadow
  },
  shadow: {
    borderRadius: entryBorderRadius,
    bottom: 18,
    left: itemHorizontalMargin,
    position: 'absolute',
    right: itemHorizontalMargin,
    shadowColor: color.palette.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    top: 0
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
  },
  imageContainerEven: {
    backgroundColor: color.palette.black
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
    resizeMode: 'cover'
  },
  // image's border radius is buggy on iOS; let's hack it!
  radiusMask: {
    backgroundColor: 'white',
    bottom: 0,
    height: entryBorderRadius,
    left: 0,
    position: 'absolute',
    right: 0
  },
  radiusMaskEven: {
    backgroundColor: color.palette.black
  },
  textContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
    justifyContent: 'center',
    paddingBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 20 - entryBorderRadius
  },
  textContainerEven: {
    backgroundColor: color.palette.black
  },
  title: {
    color: color.palette.black,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  titleEven: {
    color: 'white'
  },
  subtitle: {
    color: color.palette.black,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 6
  },
  subtitleEven: {
    color: 'rgba(255, 255, 255, 0.7)'
  }
})
