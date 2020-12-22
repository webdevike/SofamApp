import * as React from "react"
import { Animated, StyleSheet, Text, View, ViewStyle } from "react-native"
import { color, spacing } from "../../theme"

export interface ErrorPopupProps {
  error: {
    message: string
  }
}

const styles = StyleSheet.create({
  errorMessage: {
    color: color.palette.white,
    fontWeight: 'bold'
  },
  errorMessageContainer: {
    backgroundColor: color.palette.angry,
    borderRadius: 10,
    flex: 1,
    height: 50,
    left: 0,
    margin: spacing[4],
    padding: spacing[4],
    position: 'absolute',
    right: 0,
    top: 50
  }
})

export function ErrorPopup(props: ErrorPopupProps) {
  const [isShowing, toggleShowing] = React.useState(true)
  // const slideIn = React.useRef(new Animated.Value(50)).current

  // const slide = () => {
  //   Animated.timing(slideIn, {
  //     toValue: 0,
  //     duration: 5000,
  //     useNativeDriver: true
  //   }).start()
  // }
  React.useEffect(() => {
    setTimeout(() => {
      // slide()
      toggleShowing(false)
    }, 5000)
  }, [])

  return (
    <>
      {isShowing && <>
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{props.error.message}</Text>
        </View>
      </>
      }
    </>
  )
}
