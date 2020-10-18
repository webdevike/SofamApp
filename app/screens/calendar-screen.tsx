import React, { FunctionComponent as Component, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../components"
import { color, spacing } from "../theme"
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
    backgroundColor: 'red',
    flex: 1,
    height: 15,
    paddingTop: 30
  },
  item: {
    backgroundColor: 'green',
    borderRadius: 5,
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
      setItems({
        items: newItems
      })
    }, 1000)
  }

  const renderItem = (item) => {
    console.log("renderItem -> item", item)
    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, { height: item.height }]}
        onPress={() => Alert.alert(item.name)}
      >
        <Text>{item.name} TESTING</Text>
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

  return (
    <Agenda
      testID={testIDs.agenda.CONTAINER}
      items={{
        '2020-05-15': [{ name: 'item 1 - any js object' }],
        '2020-05-16': [{ name: 'item 2 - any js object', height: 80 }],
        '2020-05-17': [],
        '2020-05-18': [{ name: 'item 3 - any js object' }, { name: 'any js object' }]
      }}
      selected={'2020-05-22'}
      markingType={'period'}
      markedDates={{
        '2020-05-15': { marked: true, dotColor: '#50cebb' },
        '2020-05-16': { marked: true, dotColor: '#50cebb' },
        '2020-05-21': { startingDay: true, color: '#50cebb', textColor: 'white' },
        '2020-05-22': { color: '#70d7c7', textColor: 'white' },
        '2020-05-23': { color: '#70d7c7', textColor: 'white', marked: true, dotColor: 'white' },
        '2020-05-24': { color: '#70d7c7', textColor: 'white' },
        '2020-05-25': { endingDay: true, color: '#50cebb', textColor: 'white' },
      }}
      renderEmptyDate={renderEmptyDate}
      rowHasChanged={rowHasChanged}
      renderItem={renderItem}
    />
  )
})
