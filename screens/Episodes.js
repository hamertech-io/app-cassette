import React from "react";
import { View, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { useGlobalContext, usePlayContext } from "../state";
import ListItem from "../components/ListItem";
import Title from "../components/Title";
import Navbar from "../components/Navbar";

const Episodes = ({ route, navigation }) => {
  const {
    state: { episodes },
  } = useGlobalContext();
  const {
    playActions,
    playState: { currentProgress, episode, isPlaying },
  } = usePlayContext();
  const title = route.params.title;
  const episodeIds = route.params.episodeIds;

  const renderItem = ({ item: id, index }) => {
    return (
      <ListItem
        title={episodes[id].title}
        isEpisode={true}
        onPress={
          id === episode?.id && isPlaying
            ? playActions.pause
            : () =>
                playActions.loadAndPlay({
                  episode: episodes[id],
                  episodeIndex: index,
                })
        }
        totalDuration={episodes[id]?.duration}
        episode={episodes[id]}
        progress={currentProgress[id]?.progress || 0}
        duration={episodes[id]?.duration || 100}
        isThisEpisodePlaying={id === episode?.id && isPlaying}
      />
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Navbar goBack={() => navigation.goBack(null)} />
        <Title text={title} />
        <FlatList
          data={episodeIds}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  list: {
    paddingBottom: 120,
  },
});
export default Episodes;
