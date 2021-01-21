import React, { FunctionComponent as Component } from "react"
import { View } from "react-native"
import { Button, Text } from "../"
// import { observer } from "mobx-react-lite"
// import { useStores } from "../../models"
import { errorFallbackStyles as styles } from "./ErrorFallback.styles"

export interface ErrorFallbackProps {
  error: string
}

export const ErrorFallback: Component<ErrorFallbackProps> = ({ error }) => {
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <Text>{error}</Text>
    </View>
  )
}
