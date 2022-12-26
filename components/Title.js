import React from "react";
import { StyleSheet, Text } from "react-native";
import { formatTitle } from "../helper";

const Title = ({ text }) => {
  return <Text style={styles.title}>{formatTitle(text)}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "800",
    fontSize: 36,
    color: "#13374D",
    margin: 20,
  },
});

export default Title;
