import React, { Fragment } from "react";
import { StyleSheet, View } from "react-native";

const ProgressLine = ({ progress, duration, isPlayer }) => {
  const ratio = ((progress / duration) * 100).toFixed(2);
  const width = `${ratio}%`;

  if (!progress) {
    return null;
  }

  return (
    <Fragment>
      <View style={styles(width, isPlayer).line}>
        <View style={styles(width, isPlayer).progress}></View>
      </View>
    </Fragment>
  );
};
const styles = (width, isPlayer) =>
  StyleSheet.create({
    line: {
      backgroundColor: isPlayer
        ? "rgba(240,240,240,0.1)"
        : "rgba(14,48,72,0.1)",
      width: "100%",
      borderRadius: 5,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      marginTop: isPlayer ? 0 : 10,
    },
    progress: {
      height: 4,
      width: width,
      backgroundColor: isPlayer ? "#FFFFFF" : "#06b6d4",
      borderRadius: 5,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
    },
  });
export default ProgressLine;
