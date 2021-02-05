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
  StyleSheet,
} from "react-native"
import { Video } from 'expo-av'
import { color, spacing, typography } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { ProgressiveImage } from "../../components"
import SkeletonContent from "react-native-skeleton-content"
import { StatusBar } from 'expo-status-bar'
import { useGetUsersQuery } from "../../generated/graphql"
import { gql, useQuery } from "@apollo/client"
import { GraphQLClient, request } from 'graphql-request'

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
    backgroundColor: 'rgba(0, 0, 0, .25)',
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
    backgroundColor: 'red'
  },
  profilePictureContainer: {
    flex: 1,
  }
})
// hasura operation
const query = gql`
{
    User(order_by: {Stories_aggregate: {min: {createdAt: asc}}}) {
      name
      passwordx`
      profilePicture
      Stories(order_by: {createdAt: desc}) {
        id
        url
        createdAt
      }
    }
  }
`

const client = new GraphQLClient('https://tops-phoenix-38.hasura.app/v1/graphql')
client.setHeader('x-hasura-admin-secret', 'qqzN2LIvQyzDU8XUn07mw3vJFyE3iTEYrgCgDyxZh07zy4F')

export const HomeScreen: Component = observer(function HomeScreen() {
  const navigation = useNavigation()
  const { loading, data: userStories, refetch } = useGetUsersQuery()
  const [userData, setUserData] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  

  React.useEffect(() => {
    if(!userData) client.request(query).then((data) => setUserData(data))
  })
  
  const onRefresh = React.useCallback(async () => {
    refetch()
    if (loading) {
      setRefreshing(true)
    }
    setRefreshing(false)
  }, [])


  const renderStories = ({ item }) => {
    const uri = item.Stories[0]?.url
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
          onPress={() => uri ? navigation.navigate('story', { ...item }) : null}>
          {storyPreview() ? storyPreview() : <ProgressiveImage
            source={{ uri: item?.profilePicture || 'https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif'  }}
            style={styles.IMAGE}
          />}
          <View style={styles.OVERLAY}>
            {storyPreview() && <View style={styles.newIndicator}><Text style={styles.newIndicatorText}>New!</Text></View>}
            <Text style={styles.OVERLAY_TEXT}>{item.name}</Text>
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
              {userStories && <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={userData?.User}
                renderItem={renderStories}
                keyExtractor={item => item.password}
                showsVerticalScrollIndicator={false}
                numColumns={2}
              />}
            </View>
          </>
      }
      <StatusBar style="dark" />
    </SafeAreaView>
  )
})
