import { ViewStyle, TextStyle } from "react-native"
import { spacing } from "../../theme"
import { color, typography } from "../theme"

export const progressiveImageStyles = {
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  } as ViewStyle,
  container: {
    borderRadius: 20,
    // marginVertical: spacing[2],
    backgroundColor: '#e1e4e8',
  },
}
