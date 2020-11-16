import { ViewStyle, TextStyle, Dimensions, ImageStyle } from "react-native"
import { color, typography } from "../../theme"
import { autorun } from "mobx"
const windowWidth = Dimensions.get("window").width

export const memoryCardStyles = {
  WRAPPER: {
    height: 'auto',
    padding: 16,
    backgroundColor: "white",
    width: windowWidth - 32,
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  } as ViewStyle,
  TITLE: {
    fontFamily: typography.primary,
    fontSize: 24,
    color: "#000000",
  } as TextStyle,
  DESCRIPTION: {
    fontFamily: typography.primary,
    fontSize: 14,
    color: "#000000",
  } as TextStyle,
  PROFILE_IMAGE: {
    marginTop: 7,
    height: 39,
    width: 39,
    borderRadius: 50
  } as ImageStyle,
}
