import React, { FunctionComponent as Component, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, Platform, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../components"
import { color, spacing, typography } from "../theme"
import { clear } from "../utils/storage"
import { accessTokenVar, cache } from "../cache"
import { useReactiveVar } from "@apollo/client"
import { Agenda } from 'react-native-calendars'
import * as Calendar from 'expo-calendar'
import * as Permissions from 'expo-permissions'
import { usePermissions } from '@use-expo/permissions'
import dayjs from "dayjs"
import * as Localization from 'expo-localization'
const testIDs = require('../testIDs')

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: color.palette.white,
    flex: 1,
    justifyContent: 'space-around',
  },
})

const _findCalendars = async () => {
  const calendars = await Calendar.getCalendarsAsync()

  return calendars
}

const _createNewCalendar = async () => {
  const calendars = await _findCalendars()
  const newCalendar = {
    title: 'test',
    entityType: Calendar.EntityTypes.EVENT,
    color: '#2196F3',
    sourceId:
      Platform.OS === 'ios'
        ? calendars.find(cal => cal.source && cal.source.name === 'iCloud').source.id
        : undefined,
    source:
      Platform.OS === 'android'
        ? {
          name: calendars.find(
            cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
          ).source.name,
          isLocalAccount: true,
        }
        : undefined,
    name: 'test',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
    ownerAccount:
      Platform.OS === 'android'
        ? calendars.find(
          cal => cal.accessLevel === Calendar.CalendarAccessLevel.OWNER
        ).ownerAccount
        : undefined,
  }

  let calendarId = null

  try {
    calendarId = await Calendar.createCalendarAsync(newCalendar)
  } catch (e) {
    Alert.alert(e.message)
  }

  console.log("🚀 ~ file: calendar-screen.tsx ~ line 64 ~ const_createNewCalendar= ~ calendarId", calendarId)
  return calendarId
}

const _addEventsToCalendar = async calendarId => {
  const alarmTime = dayjs().format()
  const event = {
    title: 'TESTING EVENT CREATION',
    notes: 'This is a note with the events',
    startDate: dayjs(alarmTime)
      .add(0, 'm')
      .toDate(),
    endDate: dayjs(alarmTime)
      .add(5, 'm')
      .toDate(),
    timeZone: Localization.timezone,
  }

  try {
    const createEventAsyncRes = await Calendar.createEventAsync(
      calendarId.toString(),
      event
    )

    return createEventAsyncRes
  } catch (error) {
    console.log(error)
  }
}

const synchronizeCalendar = async value => {
  const calendarId = await _createNewCalendar()
  try {
    await _addEventsToCalendar(calendarId)
  } catch (e) {
    Alert.alert(e.message)
  }
}

export const CalendarScreen: Component = observer(function CalendarScreen() {
  const [permission, askForPermission] = usePermissions(Permissions.REMINDERS, { ask: true })
  const [calendarPermissions, askForCalendarPermission] = usePermissions(Permissions.CALENDAR, { ask: true })

  return (
    <View style={styles.container}>
      <Text>Calendar Module Example</Text>
      <Button text="Create a new calendar" onPress={synchronizeCalendar} />
    </View>
  )
})
