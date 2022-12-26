import React from "react";
import { View, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { useGlobalContext, usePlayContext } from "../state";
import ListItem from "../components/ListItem";
import Title from "../components/Title";
import Navbar from "../components/Navbar";
const Home = ({ navigation }) => {
  const { state } = useGlobalContext();
  const { playState } = usePlayContext();

  const goToSeriesDetail = (series) => {
    navigation.push("Episodes", {
      title: series.title,
      episodeIds: series.episodeIds,
    });
  };

  const renderItem = ({ item: el }) => {
    const episodeIds = el.episodeIds;
    let totalProgress = 0;
    let totalDuration = 0;
    episodeIds.forEach((id) => {
      totalDuration += state.episodes[id]?.duration;
      if (playState.currentProgress[id]) {
        totalProgress += playState.currentProgress[id]?.progress;
      }
    });
    return (
      <ListItem
        title={el.title}
        onPress={() => goToSeriesDetail(el)}
        isEpisode={false}
        episodeCount={el.episodeIds.length}
        progress={totalProgress}
        duration={totalDuration}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Navbar />
        <Title text={"Vaaz Serisi"} />
        <FlatList
          data={state?.series}
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
export default Home;
