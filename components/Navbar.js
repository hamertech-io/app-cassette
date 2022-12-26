import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Share,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
const Navbar = ({ goBack }) => {
  const share = () => {
    Share.share({
      message:
        "Cassette uygulamasını App Store üzerinden indirin!\n\nhttps://apps.apple.com/app/id1660891930",
    });
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.navItem}>
        {goBack && (
          <TouchableOpacity onPress={goBack} style={styles.backIcon}>
            <Icon size={30} color={"#152938"} name={"arrow-back"} />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.navItem, styles.logo]}>
        <Image
          style={{ width: 50, height: 50, resizeMode: "stretch" }}
          source={require("../assets/logo.png")}
        />
      </View>

      <View style={[styles.navItem, { alignItems: "flex-end" }]}>
        <TouchableOpacity onPress={share} style={styles.backIcon}>
          <Icon size={30} color={"#152938"} name={"share-social"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  navbar: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  navItem: {
    flex: 1,
  },
  logo: {
    alignItems: "center",
  },
  backIcon: {
    height: 60,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
});
export default Navbar;
