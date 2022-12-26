import React, { useState } from "react";
import { useGlobalContext, usePlayContext } from "../state";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import ProgressLine from "./ProgressLine";
import { formatTitle, msToTimeForPlayer } from "../helper";
import IconButton from "./IconButton";
import MarqueeText from "react-native-marquee";
import Icon from "react-native-vector-icons/Ionicons";

const Player = () => {
  const { playState, playActions } = usePlayContext();
  const { state } = useGlobalContext();
  const [expanded, setExpanded] = useState(false);

  const seriesTitle = playState.episode?.folder || "";
  const episodeTitle = playState.episode?.title || "";
  const isPlaying = playState.isPlaying;
  const episodeProgress =
    playState.currentProgress[playState.episode?.id]?.progress;
  const episodeDuration = state.episodes[playState.episode?.id]?.duration;
  const foundSeriesIndex = state.series?.findIndex(
    (serie) => serie.title === seriesTitle
  );

  const episodeIndex = state.series?.[foundSeriesIndex]?.episodeIds?.findIndex(
    (id) => id === playState.episode.id
  );
  const seriesLength = state.series?.[foundSeriesIndex]?.episodeIds?.length;
  const nextIndex = episodeIndex + 1;
  const prevIndex = episodeIndex - 1;

  const pause = () => {
    playActions.pause();
  };
  const play = () => {
    if (!playState.sound && playState.episode) {
      playActions.loadAndPlay({
        episode: playState.episode,
        episodeIndex: episodeIndex,
      });
    } else if (playState.sound && playState.episode) {
      playActions.play();
    }
  };

  const playNext = () => {
    if (nextIndex < seriesLength) {
      const nextEpisodeId =
        state.series?.[foundSeriesIndex]?.episodeIds[nextIndex];

      playActions.loadAndPlay({
        episode: state.episodes[nextEpisodeId],
        episodeIndex: nextIndex,
      });
    }
  };

  const playPrev = () => {
    if (prevIndex >= 0) {
      const prevEpisodeId =
        state.series?.[foundSeriesIndex]?.episodeIds[prevIndex];

      playActions.loadAndPlay({
        episode: state.episodes[prevEpisodeId],
        episodeIndex: prevIndex,
      });
    }
  };

  const playForward = () => {
    if (playState.sound) {
      const forward = Math.min(episodeProgress + 15000, episodeDuration - 1000);
      playState.sound.setPositionAsync(forward);
    }
  };
  const playBack = () => {
    if (playState.sound) {
      const back = Math.max(episodeProgress - 15000, 0);
      playState.sound.setPositionAsync(back);
    }
  };

  const renderMiniPlayer = () => {
    return (
      <View style={styles.container}>
        <View style={styles.player}>
          <TouchableOpacity
            onPress={() => setExpanded(true)}
            style={styles.titleContainer}
          >
            <View style={styles.titleWrapper}>
              <MarqueeText
                style={styles.title}
                speed={0.5}
                marqueeOnStart={true}
                loop={true}
                delay={1500}
              >
                {formatTitle(episodeTitle)}
              </MarqueeText>
              <MarqueeText
                style={styles.subtitle}
                speed={0.3}
                marqueeOnStart={true}
                loop={true}
                delay={1500}
              >
                {formatTitle(seriesTitle)}
              </MarqueeText>
            </View>
          </TouchableOpacity>
          {isPlaying ? (
            <IconButton onPress={pause} icon={"pause"} />
          ) : (
            <IconButton onPress={play} icon={"play"} />
          )}
        </View>

        <ProgressLine
          progress={episodeProgress}
          duration={episodeDuration}
          isPlayer={true}
        />
      </View>
    );
  };

  const renderExpandedPlayer = () => {
    return (
      <View style={[styles.container, styles.expandedPlayerContainer]}>
        <View style={styles.expandedPlayerWrapper}>
          <TouchableOpacity
            style={styles.playerClose}
            onPress={() => {
              setExpanded(false);
            }}
          >
            <Icon size={24} color={"#FFFFFF"} name={"chevron-down"} />
          </TouchableOpacity>

          <View style={[styles.titleWrapper, styles.expandedTitleWrapper]}>
            <MarqueeText
              style={styles.expandedTitle}
              speed={0.5}
              marqueeOnStart={true}
              loop={true}
              delay={1500}
            >
              {formatTitle(episodeTitle)}
            </MarqueeText>
            <MarqueeText
              style={styles.expandedSubtitle}
              speed={0.3}
              marqueeOnStart={true}
              loop={true}
              delay={1500}
            >
              {formatTitle(seriesTitle)}
            </MarqueeText>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginVertical: 40,
              paddingHorizontal: "2%",
            }}
          >
            <IconButton size={24} onPress={playPrev} icon={"play-skip-back"} />

            <IconButton size={24} onPress={playBack} icon={"play-back"} />

            {isPlaying ? (
              <IconButton size={50} onPress={pause} icon={"pause"} />
            ) : (
              <IconButton size={50} onPress={play} icon={"play"} />
            )}

            <IconButton size={24} onPress={playForward} icon={"play-forward"} />

            <IconButton
              opacity={0.7}
              size={24}
              onPress={playNext}
              icon={"play-skip-forward"}
            />
          </View>

          <ProgressLine
            progress={episodeProgress}
            duration={episodeDuration}
            isPlayer={true}
          />

          <View style={styles.duration}>
            <Text style={styles.durationText}>
              {msToTimeForPlayer(episodeProgress)}
            </Text>
            <Text style={styles.durationText}>
              -{msToTimeForPlayer(episodeDuration - episodeProgress)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      {expanded ? renderExpandedPlayer() : renderMiniPlayer()}
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    padding: 20,
    paddingTop: 0,
  },
  playerClose: {
    paddingVertical: 10,
    alignItems: "center",
    paddingBottom: 20,
    opacity: 0.6,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    marginTop: 15,
    height: 70,
    backgroundColor: "#123048",
    borderRadius: 5,
    shadowColor: "rgba(74, 74, 74, 0.79)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 25,
    shadowOpacity: 2,
  },
  duration: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  expandedPlayerContainer: {
    height: 240,
  },
  expandedPlayerWrapper: {
    height: 220,
    paddingHorizontal: 20,
  },
  expandedTitleWrapper: {
    alignItems: "center",
  },
  player: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 66,
    paddingHorizontal: 15,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  expandedTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 20,
  },
  subtitle: {
    color: "#FFFFFF",
    opacity: 0.5,
    marginTop: 3,
  },
  expandedSubtitle: {
    color: "#FFFFFF",
    opacity: 0.7,
    fontSize: 16,
    marginTop: 10,
  },
  skipper: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "600",
  },
  durationText: {
    fontWeight: "600",
    color: "#FFF",
    opacity: 0.5,
  },
});
export default Player;
