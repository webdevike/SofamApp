import React, { FunctionComponent as Component, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../components"
import { color, spacing, typography } from "../theme"
import { clear } from "../utils/storage"
import { accessTokenVar, cache } from "../cache"
import { useReactiveVar } from "@apollo/client"
import { Agenda } from 'react-native-calendars'
const testIDs = require('../testIDs')

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const TEXT: TextStyle = {
  color: color.palette.black
}

const LOGIN_BUTTON: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: color.palette.orange,
  borderRadius: 50,
}

const LOGIN_BUTTON_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 14,
  letterSpacing: 2,
}

const styles = StyleSheet.create({
  emptyDate: {
    flex: 1,
    height: 15,
    paddingTop: 30
  },
  item: {
    backgroundColor: '#00adf5',
    borderBottomWidth: 1,
    color: color.palette.black,
    flex: 1,
    marginRight: 10,
    marginTop: 17,
    padding: 10
  }
})

export const CalendarScreen: Component = observer(function CalendarScreen() {
  const [items, setItems] = useState({})

  const timeToString = (time) => {
    const date = new Date(time)
    return date.toISOString().split('T')[0]
  }

  const loadItems = (day) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000
        const strTime = timeToString(time)
        if (!items[strTime]) {
          items[strTime] = []
          const numItems = Math.floor(Math.random() * 3 + 1)
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150))
            })
          }
        }
      }
      const newItems = {}
      Object.keys(items).forEach(key => { newItems[key] = items[key] })
      setItems(newItems)
    }, 1000)
  }

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, { height: item.height }]}
        onPress={() => Alert.alert(item.name)}
      >
        <Text>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    )
  }

  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name
  }

  const currentDate = new Date()
  const formattedCurrentDate = currentDate.toISOString().split('T')[0]

  return (
    <Agenda
      testID={testIDs.agenda.CONTAINER}
      theme={{
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
        textSectionTitleColor: '#b6c1cd',
        textSectionTitleDisabledColor: '#d9e1e8',
        selectedDayBackgroundColor: '#00adf5',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#00adf5',
        dayTextColor: '#2d4150',
        textDisabledColor: '#d9e1e8',
        dotColor: '#00adf5',
        selectedDotColor: '#ffffff',
        arrowColor: 'orange',
        disabledArrowColor: '#d9e1e8',
        monthTextColor: '#00adf5',
        indicatorColor: '#00adf5',
        textDayFontFamily: typography.primary,
        textMonthFontFamily: typography.primary,
        textDayHeaderFontFamily: typography.primary,
        textDayFontWeight: '300',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '300',
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16
      }}
      items={items}
      loadItemsForMonth={loadItems}
      selected={formattedCurrentDate}
      markingType={'simple'}
      renderEmptyDate={renderEmptyDate}
      rowHasChanged={rowHasChanged}
      renderItem={renderItem}
    />
  )
})
