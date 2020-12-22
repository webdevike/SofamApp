import React, { FunctionComponent as Component, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  SafeAreaView,
  FlatList,
  ImageStyle,
  ViewStyle,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  TextStyle,
} from "react-native"
import { Video } from 'expo-av'
import { color, spacing, typography } from "../../theme"
import { useQuery } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import { ProgressiveImage } from "../../components"
import SkeletonContent from "react-native-skeleton-content"
import { StatusBar } from 'expo-status-bar';
import { USERS } from '../../graphql'

const ROOT: ViewStyle = {
  flex: 1,
}

const WRAPPER: ViewStyle = {
  flex: 1,
  marginHorizontal: spacing[1]
}

const VIDEO: ViewStyle = {
  height: 225,
  flex: 1,
  borderRadius: 20,
}

const IMAGE: ImageStyle = {
  height: 225,
  flex: 1,
  borderRadius: 20,
  resizeMode: 'cover'
}

const IMAGE_CONTAINER: ViewStyle = {
  flex: 1,
  marginLeft: spacing[2],
  marginRight: spacing[2],
  marginBottom: spacing[4]
}

const OVERLAY: ViewStyle = {
  height: '100%',
  position: "absolute",
  bottom: 0,
  right: 0,
  left: 0,
  backgroundColor: 'rgba(0, 0, 0, .25)',
  borderRadius: 20,
  justifyContent: 'flex-end'
}

const OVERLAY_TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
  fontWeight: '700',
  fontSize: 18,
  margin: spacing[4],
}

export const HomeScreen: Component = observer(function HomeScreen() {
  const navigation = useNavigation()
  const { loading, data: userAndStories, refetch } = useQuery(USERS)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = React.useCallback(async () => {
    refetch()
    if (loading) {
      setRefreshing(true)
    }
    setRefreshing(false)
  }, [])

  const renderUsers = ({ item }) => {
    const uri = item.stories[0]?.url
    const renderFirstStory = () => {
      if (uri?.includes('.mov')) {
        return (
          <Video
            source={{ uri }}
            rate={1.0}
            volume={0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={VIDEO}
          />
        )
      } else if (uri?.includes('.jpg' || '.jpeg')) {
        return (
          <ProgressiveImage
            thumbnailSource={{ uri: `https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1915&q=80` }}
            source={{ uri }}
            style={IMAGE}
          />
        )
      }
    }
    return (
      <View style={IMAGE_CONTAINER}>
        <TouchableOpacity
          disabled={!uri}
          onPress={() => uri ? navigation.navigate('story', { ...item }) : null}>
          {renderFirstStory() ? renderFirstStory() : <ProgressiveImage
            thumbnailSource={{ uri: `https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1915&q=80` }}
            source={{ uri: item?.profilePicture }}
            style={IMAGE}
          />}
          <View style={OVERLAY}>
            <Text style={OVERLAY_TEXT}>{item.name}</Text>
          </View>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    )
  }

  const firstLayout = [
    {
      flexDirection: 'row',
      flexWrap: 'wrap',
      flex: 1,
      justifyContent: 'center',
      children: [
        {
          margin: spacing[2],
          // flex: 1,
          height: 250,
          width: "45%"
        },
        {
          margin: spacing[2],
          // flex: 1,
          height: 250,
          width: "45%"
        },
        {
          margin: spacing[2],
          height: 250,
          width: "45%"
        },
        {
          margin: spacing[2],
          height: 250,
          width: "45%"
        },
        {
          margin: spacing[2],
          height: 250,
          width: "45%"
        },
        {
          margin: spacing[2],
          height: 250,
          width: "45%"
        },
      ]
    },
  ]

  return (
    <SafeAreaView style={ROOT}>
      {
        loading
          ? <SkeletonContent
            isLoading={true}
            layout={firstLayout}
          />
          : <View style={WRAPPER}>
            <FlatList
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              data={userAndStories?.users}
              renderItem={renderUsers}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              numColumns={2}
              />
          </View> 
      }
    </SafeAreaView>
  )
})
