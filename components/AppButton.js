import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

const AppButton = props => {
  const bg = props.color || null;
  const boxStyles = { ...styles.box };

  if (bg) {
    boxStyles.backgroundColor = bg;
  } else {
    boxStyles.backgroundColor = "#000";
  }

  if (props.disabled) boxStyles.opacity = 0.7;

  return (
    <TouchableOpacity style={boxStyles} {...props}>
      <Text style={styles.title}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  box: {
    borderRadius: 15,
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 14,
    textAlign: "center",
    color: "#fff"
  }
});
