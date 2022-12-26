import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const IconButton = ({ onPress, icon, color, size = 24 }) => {
  return (
    <TouchableOpacity
      style={{
        width: size + 20,
        height: size + 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
      }}
      onPress={onPress}
    >
      <Icon size={size} color={color || "#FFFFFF"} name={icon} />
    </TouchableOpacity>
  );
};

export default IconButton;
