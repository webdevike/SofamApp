import React, { FunctionComponent as Component } from "react"
import { View, Text, Image } from "react-native"
import { memoryCardStyles as styles } from "./MemoryCard.styles"

export interface MemoryCardProps {}

export const MemoryCard: Component<MemoryCardProps> = props => {
  // Note: if you want your componeobservernt to refresh when data is updated in the store,
  // wrap this component in `` like so:
  // `export const MemoryCard = observer(function MemoryCard { ... })`

  // Enable this line to retrieve data from the rootStore (or other store)
  // const rootStore = useStores()
  // or
  // const { otherStore, userStore } = useStores()

  return (
    <View style={styles.WRAPPER}>
      <Text style={styles.TITLE}>Star Filled Night</Text>
      <Text style={styles.DESCRIPTION}>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet</Text>
      <Image style={styles.PROFILE_IMAGE} source={{ uri: "https://i.pravatar.cc/300" }} />
    </View>
  )
}
