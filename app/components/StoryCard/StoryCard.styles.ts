import { ViewStyle, TextStyle, ImageStyle } from "react-native"
import { spacing } from "../../theme"

export const storyCardStyles = {
  IMAGE_CONTAINER: {
    flex: 1,
    margin: spacing[2],
  } as ViewStyle,
  IMAGE: {
    height: 250,
    flex: 1,
    borderRadius: 20,
  } as ImageStyle
}
