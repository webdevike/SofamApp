import * as React from "react"
import { StyleSheet, Text, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
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
    left: 0,
    margin: spacing[4],
    padding: spacing[4],
    position: 'absolute',
    right: 0,
    top: 50,
    zIndex: 10000
  }
})

export function ErrorPopup(props: ErrorPopupProps) {
  const [isShowing, toggleShowing] = React.useState(true)
  React.useEffect(() => {
    setTimeout(() => {
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
