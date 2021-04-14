import React, { FunctionComponent as Component, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, ImageStyle } from "react-native"
import { HeaderProps } from "./header.props"
import { Button } from "../button/button"
import { Text } from "../text/text"
import { Icon } from "../icon/icon"
import { color, spacing } from "../../theme"
import { translate } from "../../i18n/"
import { ProgressiveImage } from ".."
import { currentUser } from "../../utils/currentUser"
import * as Updates from 'expo-updates'
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation, useRoute } from "@react-navigation/native"

// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingTop: spacing[8],
  paddingBottom: spacing[5],
  paddingHorizontal: spacing[6],
  backgroundColor: "#F2F2F2"
}

const PROFILE_IMAGE: ImageStyle = {
  height: 35,
  width: 35,
  borderRadius: 50,
  backgroundColor: 'lightgray'
}

const TITLE: TextStyle = { textAlign: "center" }
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: "center" }
const LEFT: ViewStyle = { width: 32 }
const RIGHT: ViewStyle = { width: 32 }

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */

export const Header: Component<HeaderProps> = props => {
  const route = useRoute()
  const currentScreen = route.state?.index ?? 0
  // const [isCurrentScreen, setCurrentScreen] = useState()

  // useEffect(() => {
  //   setCurrentScreen(currentScreen)
  // }, [currentScreen, isCurrentScreen])
  const {
    onLeftPress,
    onRightPress,
    rightIcon,
    leftIcon,
    headerText,
    headerTx,
    style,
    titleStyle,
  } = props
  const header = headerText || (headerTx && translate(headerTx)) || ""

  const [update, setUpdate] = useState({})

  useEffect(() => {
    (async () => {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync()
        if (update) setUpdate(update)
      }
    })()
  }, [])

  const updateApp = async () => {
    try {
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync()
        // ... notify user of update ...
        await Updates.reloadAsync()
      }
    } catch (e) {
      console.log(e)
    }
  }

  const { loading, user } = currentUser()
  return (
    <>
      <View style={{ ...ROOT, ...style }}>
        {leftIcon ? (
          <Button preset="link" onPress={onLeftPress}>
            <Icon icon={leftIcon} />
          </Button>
        ) : (
          <View style={LEFT} />
        )}
        <View style={TITLE_MIDDLE}>
          <Text style={{ ...TITLE, ...titleStyle }} text={header} />
        </View>
        {rightIcon && currentScreen !== 2 ? (
          <Button preset="link" onPress={onRightPress}>
            <View>
              <ProgressiveImage
                source={{ uri: user?.me?.profilePicture || '"https://images.unsplash.com/photo-1529405643518-5cf24fddfc0b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"' }}
                style={PROFILE_IMAGE} />
            </View>

          </Button>
        ) : (
          <View style={RIGHT} />
        )}
      </View>
      {update.isAvailable && <TouchableOpacity onPress={updateApp} style={{ backgroundColor: color.palette.lightGreen, padding: spacing[2], marginBottom: spacing[2] }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Click me to update App
        </Text>
      </TouchableOpacity>}

    </>
  )
}
