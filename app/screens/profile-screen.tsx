import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, Text, View, Button } from 'react-native'
import Animated from 'react-native-reanimated'
import BottomSheet from 'reanimated-bottom-sheet'

export const ProfileScreen: Component = observer(function ProfileScreen() {
  const renderContent = () => (
    <View
      style={{
        backgroundColor: 'white',
        padding: 16,
        height: 500,
      }}
    >
      <Text>Swipe down to close</Text>
    </View>
  )

  const sheetRef = React.useRef(null)

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: 'papayawhip',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          title="Open Bottom Sheet"
          onPress={Login}
        />
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={[500, 100]}
        borderRadius={10}
        renderContent={renderContent}
      />
    </>
  )
})
