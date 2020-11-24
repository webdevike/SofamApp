import React, { FunctionComponent as Component } from "react"
import { View, ViewStyle, TextStyle, Image, ImageStyle } from "react-native"
import { HeaderProps } from "./header.props"
import { Button } from "../button/button"
import { Text } from "../text/text"
import { Icon } from "../icon/icon"
import { color, spacing } from "../../theme"
import { translate } from "../../i18n/"
import { ProgressiveImage } from ".."
import { currentUser } from "../../utils/currentUser"

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

  const user = currentUser()
  console.log("user", user)

  return (
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
      {rightIcon ? (
        <Button preset="link" onPress={onRightPress}>

          <View>
            <ProgressiveImage
              thumbnailSource={{ uri: `https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1915&q=80` }}
              source={{ uri: user?.me.profilePicture }}
              style={PROFILE_IMAGE} />
          </View>

        </Button>
      ) : (
        <View style={RIGHT} />
      )}
    </View>
  )
}
