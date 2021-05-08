import React, { FunctionComponent as Component, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { Video } from 'expo-av'
import { color, spacing, typography } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { Button, ErrorPopup, ProgressiveImage } from "../../components"
import SkeletonContent from "react-native-skeleton-content"
import { StatusBar } from 'expo-status-bar'
import { useGroupQuery } from "../../generated/graphql"
import { currentUser } from "../../utils/currentUser"
import useSWR from "swr"
import { GraphQLClient } from 'graphql-request'

const client = new GraphQLClient('https://tops-phoenix-38.hasura.app/v1/graphql')
const requestHeaders = {
  'x-hasura-admin-secret': "qqzN2LIvQyzDU8XUn07mw3vJFyE3iTEYrgCgDyxZh07zy4F",
}
const variables = {}

const GROUP_QUERY =  `
query GetGroupByID($id: Int!) {
  _GroupToUser(order_by: {User: {Stories_aggregate: {count: desc}}}, where: {Group: {id: {_eq: $id}}}) {
    User {
      id
      name
      profilePicture
      Stories(order_by: {createdAt: desc}) {
        id
        url
        createdAt
      }
    }
  }
}`

const fetcher = (query, variables) => {
  
  return client.request(query, variables, requestHeaders)
}

const styles = StyleSheet.create({
  IMAGE: {
    borderRadius: 20,
    flex: 1,
    height: 225,
    resizeMode: 'cover',
  },
  newIndicator: {
    position: 'absolute',
    backgroundColor: color.palette.darkGreen,
    padding: spacing[3],
    borderRadius: 5,
    right: 0,
    top: 0,
  },
  newIndicatorText: {
    color: color.palette.white,
  },
  IMAGE_CONTAINER: {
    flex: 1,
    marginBottom: spacing[4],
    marginLeft: spacing[2],
    marginRight: spacing[2]
  },
  OVERLAY: {
    borderRadius: 20,
    bottom: 0,
    height: '100%',
    justifyContent: 'flex-end',
    left: 0,
    position: "absolute",
    right: 0
  },
  OVERLAY_TEXT: {
    color: color.palette.white,
    fontFamily: typography.primary,
    fontSize: 18,
    fontWeight: '700',
    margin: spacing[4],
  },
  ROOT: {
    flex: 1,
  },
  VIDEO: {
    borderRadius: 20,
    flex: 1,
    height: 225,
  },
  WRAPPER: {
    flex: 1,
    marginHorizontal: spacing[1]
  },
  profilePicture: {
    borderRadius: 20,
    flex: 1,
    height: 225,
    width: 100,
  },
  profilePictureContainer: {
    flex: 1,
  }
})
export const HomeScreen: Component = observer(function HomeScreen() {
  const navigation = useNavigation()
   const {loading: userLoading, user} = currentUser()
  // const { loading, data: userStories, refetch } = useGroupQuery({
  //   skip: !user,
  //   variables: {
  //     id: user?.me?.groups[0].id
  //   }
  // })

  const id = user?.me?.groups[0].id
  const variables = useMemo(() => ({ id }), [id])
  const { data, error } = useSWR([GROUP_QUERY, variables], fetcher, {refreshInterval: 500});
  const loading = !data
  
  const [refreshing, setRefreshing] = useState(false)
  

  // const onRefresh = React.useCallback(async () => {
  //   refetch()
  //   if (loading) {
  //     setRefreshing(true)
  //   }
  //   setRefreshing(false)
  // }, [])


  const renderStories = ({ item }) => {
    const uri = item.User.Stories[0]?.url
    const storyPreview = () => {
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
            style={styles.VIDEO}
          />
        )
      } else if (uri?.includes('.jpg' || '.jpeg')) {
        return (
          <>
            <ProgressiveImage
              source={{ uri }}
              style={styles.IMAGE}
            />
          </>
        )
      }
    }
    return (
      <View style={styles.IMAGE_CONTAINER}>
        <TouchableOpacity
          disabled={!uri}
          onPress={() => {
            uri ? navigation.navigate('story', { ...item }) : null}
            }>
          {storyPreview() ? storyPreview() : <ProgressiveImage
            source={{ uri: item?.User.profilePicture || 'https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif'  }}
            style={styles.IMAGE}
          />}
          <View style={{...styles.OVERLAY, backgroundColor: storyPreview() ? 'rgba(0, 0, 0, .25)' : 'rgba(0, 0, 0, .55)' ,}}>
            {/* {storyPreview() && <View style={styles.newIndicator}><Text style={styles.newIndicatorText}>New!</Text></View>} */}
            <Text style={styles.OVERLAY_TEXT}>{item?.User.name}</Text>
          </View>
        </TouchableOpacity>
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
    <SafeAreaView style={styles.ROOT}>
      {
        loading
          ? <SkeletonContent
            isLoading={true}
            layout={firstLayout}
          />
          : <>
            <View style={styles.WRAPPER}>
              {data && <FlatList
                // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={data?._GroupToUser}
                renderItem={renderStories}
                keyExtractor={item => item.User.id}
                showsVerticalScrollIndicator={false}
                numColumns={2}
              />}
            </View>
            {error && <ErrorPopup error={error} />}
          </>
      }
      <StatusBar style="dark" />
    </SafeAreaView>
  )
})
