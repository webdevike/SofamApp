import React, { FunctionComponent as Component } from "react"
import { observer } from "mobx-react-lite"
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
import { Video } from 'expo-av'
import { spacing } from "../../theme"
import { gql, useQuery, useReactiveVar } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import styled from 'styled-components/native'
import { accessTokenVar } from "../../cache"

const StyledView = styled.View`
  flex: 1;
`

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

const IMAGE: ImageStyle = {
  height: 250,
  flex: 1,
  borderRadius: 20,
}

const IMAGE_WITH_STORY: ImageStyle = {
  height: 250,
  flex: 1,
  borderRadius: 10,
}

const IMAGE_CONTAINER: ViewStyle = {
  flex: 1,
  margin: spacing[2],
}

const IMAGE_WRAPPER: ViewStyle = {
  // backgroundColor: "green",
  padding: spacing[1],
  borderRadius: 20,
  borderWidth: 4,
  borderColor: "#F9337C",
  flex: 1,
}

// fake data
const users = [
  {
    id: "1",
    name: "Isaac",
    stories: [
      {
        url: "https://api.adorable.io/avatars/285/abott@adorable.png"
      }
    ]
  },
  {
    id: "2",
    name: "Kathry,n-Rose",
    stories: [
      {
        url: "https://api.adorable.io/avatars/285/abott@adorable.png"
      }
    ]
  },
  {
    id: "3",
    name: "Josh",
    stories: [
      {
        url: "https://api.adorable.io/avatars/285/abott@adorable.png"
      }
    ]
  },
  {
    id: "4",
    name: "Sarah",
    stories: [
      {
        url: "https://api.adorable.io/avatars/285/abott@adorable.png"
      }
    ]
  },
  {
    id: "5",
    name: "Luke",
    stories: [
      {
        url: "https://api.adorable.io/avatars/285/abott@adorable.png"
      }
    ]
  },
  {
    id: "6",
    name: "Anna",
    stories: [
      {
        url: "https://api.adorable.io/avatars/285/abott@adorable.png"
      },
      {
        url: "https://api.adorable.io/avatars/285/abott@adorable.png"
      }
    ]
  }
]

export const HomeScreen: Component = observer(function HomeScreen() {
  const navigation = useNavigation()
  const { loading, data: userAndStories } = useQuery(USERS)

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
            resizeMode="contain"
            shouldPlay
            isLooping
            style={{
              height: 250,
              flex: 1,
            }}
          />
        )
      } else if (uri?.includes('.jpg' || '.jpeg')) {
        return (
          <Image style={uri ? IMAGE_WITH_STORY : IMAGE} source={{ uri }} />
        )
      } else {
        return <Image style={uri ? IMAGE_WITH_STORY : IMAGE} source={{ uri: "https://api.adorable.io/avatars/285/abott@adorable.png" }} />
      }
    }
    return (
      <View style={IMAGE_CONTAINER}>
        <TouchableWithoutFeedback onPress={() => {
          if (item.stories[0]?.url) {
            navigation.navigate('story', { ...item })
          }
        }
        }>

          <View style={item.stories[0]?.url ? IMAGE_WRAPPER : IMAGE}>
            {renderFirstStory()}
          </View>
        </TouchableWithoutFeedback>
        <Text style={{ textAlign: 'center', marginTop: spacing[2] }}>{item.name}</Text>
      </View>
    )
  }

  return (
    <StyledView>

      <SafeAreaView >
        {
          loading
            ? <ActivityIndicator />
            : <>
              <FlatList
                data={userAndStories.users}
                renderItem={renderUsers}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                numColumns={2}
              />
            </>
        }
      </SafeAreaView>
    </StyledView>
  )
})
