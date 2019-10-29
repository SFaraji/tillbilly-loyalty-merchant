import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

const PlusButton = props => {
  return (
    <TouchableOpacity style={styles.addButton} onPress={props.onPress}>
      <Text style={styles.addButtonText}>+</Text>
    </TouchableOpacity>
  );
};

export default PlusButton;

const styles = StyleSheet.create({
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: "rgb(11,17,35)",
    borderRadius: 15,
    overflow: "hidden",
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  addButtonText: {
    fontSize: 30,
    color: "#fff"
  }
});
