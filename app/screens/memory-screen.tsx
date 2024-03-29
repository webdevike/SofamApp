import React, { FunctionComponent as Component, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, Image, View, ImageStyle, Dimensions, FlatList, ActivityIndicator, SafeAreaView, Text, RefreshControl } from "react-native"
import { MemoryCard, ProgressiveImage, Screen } from "../components"
import { gql, useQuery } from "@apollo/client"
import { StatusBar } from 'expo-status-bar'
import { Video } from "expo-av"

const dimensions = Dimensions.get('window')
const imageWidth = dimensions.width

const IMAGE_MEMORY: ImageStyle = {
  width: imageWidth,
  height: 400,
}

const MEMORY_WRAPPER: ViewStyle = {
  position: 'relative',
  marginBottom: 32
}

const MEMORIES = gql`
{
  memories {
    id
    title
    location
    description
    createdAt
    thumbnail
  }
}
`
const renderMemories = ({ item }) => {
  const uri = item?.thumbnail
  const renderVidoeOrThumbnail = () => {
    if (uri.includes('.mov')) {
      return (
        <Video
          source={{ uri }}
          rate={1.0}
          volume={0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={{
            height: 400,
            flex: 1,
          }}
        />
      )
    } else {
      return (
        <ProgressiveImage 
          source={{ uri: item?.thumbnail }}
          style={IMAGE_MEMORY} 
        />
      )
    }
  }
  return (
    <View style={MEMORY_WRAPPER}>
      {renderVidoeOrThumbnail()}
      <MemoryCard data={item}/>
    </View>
  )
}

export const MemoryScreen: Component = observer(function MemoryScreen() {
  const { loading: memoryIsLoading, data: allMemories, refetch, } = useQuery(MEMORIES)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = React.useCallback(async () => {
    refetch()
    if (memoryIsLoading) {
      setRefreshing(true)
    }
    setRefreshing(false)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {
        memoryIsLoading
          ? <ActivityIndicator />
          : <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={allMemories?.memories}
            renderItem={renderMemories}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
      }
      <StatusBar style="auto" />
    </SafeAreaView>
  )
})
