import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { formatTitle, msToTime } from "../helper";
import ProgressLine from "./ProgressLine";
import IconButton from "./IconButton";
import MarqueeText from "react-native-marquee";

const ListItem = ({
  title,
  onPress,
  isEpisode,
  progress,
  duration,
  isThisEpisodePlaying,
  episodeCount,
  totalDuration,
}) => {
  const icon = isEpisode
    ? isThisEpisodePlaying
      ? "pause"
      : "play"
    : "arrow-forward";

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.container, isEpisode ? styles.episodeItem : null]}
        onPress={onPress}
      >
        <View style={styles.listItem}>
          <View style={{ flex: 1 }}>
            <MarqueeText
              style={styles.title}
              speed={0.5}
              marqueeOnStart={true}
              loop={true}
              delay={1500}
            >
              {formatTitle(title)}
            </MarqueeText>
            <Text style={styles.durationText}>
              {isEpisode
                ? msToTime(totalDuration || 0)
                : `${episodeCount} Kaset`}
            </Text>
          </View>

          <View style={styles.circle}>
            <IconButton onPress={onPress} icon={icon} color={"#123048"} />
          </View>
        </View>

        <ProgressLine
          progress={progress}
          duration={duration}
          isPlayer={false}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    height: 70,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  episodeItem: {
    paddingHorizontal: 15,
    height: 75,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#123048",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    paddingLeft: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  durationText: {
    fontSize: 14,
    marginTop: 2,
    color: "#333",
  },
});
