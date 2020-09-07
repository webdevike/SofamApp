import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
import { MemoryCard } from '../../components/MemoryCard/MemoryCard'
import {
  SafeAreaView,
  FlatList,
  Image,
  ImageStyle,
  ViewStyle,
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import { spacing } from "../../theme"
import { gql, useQuery } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"

const USERS = gql`
  {
  users {
    id
    name
    stories {
      id
      url
    }
  }
}
`
const dimensions = Dimensions.get('window')
const imageWidth = dimensions.width

const MEMORIES = gql`
{
  memories {
    id
    title
    location
    createdAt
  }
}
`

const IMAGE: ImageStyle = {
  height: 200,
  width: 150,
  borderRadius: 10,
}

const IMAGE_WITH_STORY: ImageStyle = {
  height: 200,
  width: 150,
  borderRadius: 10,
  borderWidth: 4,
  borderColor: "#F9337C"
}

const IMAGE_CONTAINER: ViewStyle = {
  margin: spacing[2],
}

const IMAGE_MEMORY: ImageStyle = {
  width: imageWidth,
  height: 400,
}

const MEMORY_WRAPPER: ViewStyle = {
  position: 'relative',
  marginBottom: 32
}

const renderMemories = ({ item }) => {
  return (
    <View style={MEMORY_WRAPPER}>
      <Image style={IMAGE_MEMORY} source={{ uri: item.location }}/>
      <MemoryCard />
    </View>
  )
}

export const HomeScreen: Component = observer(function HomeScreen() {
  const navigation = useNavigation()

  const { loading, data } = useQuery(USERS)
  const { loading: memoryIsLoading, data: allMemories } = useQuery(MEMORIES)

  const renderUsers = ({ item }) => {
    return (
      <View style={IMAGE_CONTAINER}>
        <TouchableWithoutFeedback style={IMAGE} onPress={() => {
          if (item.stories[0]?.url) {
            navigation.navigate('story', { ...item })
          }
        }
        }>

          <Image style={item.stories[0]?.url ? IMAGE_WITH_STORY : IMAGE} source={{ uri: item.stories[0]?.url || "https://i.pravatar.cc/300" }} />
        </TouchableWithoutFeedback>
        <Text style={{ textAlign: 'center', marginTop: spacing[2] }}>{item.name}</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView>
        {
          loading
            ? <ActivityIndicator />
            : <>
              <FlatList
                horizontal={true}
                data={data.users}
                renderItem={renderUsers}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}

              />
            </>
        }
      </SafeAreaView>

      {

        memoryIsLoading
          ? <ActivityIndicator />
          : <>
            <FlatList
              data={allMemories.memories}
              renderItem={renderMemories}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </>
      }
    </View>
  )
})
