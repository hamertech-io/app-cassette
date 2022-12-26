import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        style={{ width: "100%", resizeMode: "contain" }}
        source={require("../assets/splash.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 36,
    marginTop: 20,
    color: "#152938",
  },
});

export default SplashScreen;
