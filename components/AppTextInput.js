import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const normalColor = "rgb(245, 243, 251)";
const errorColor = "#FF4444";

export default AppTextInput = props => {
  let textInput = { ...styles.textInput };
  textInput.borderColor = props.error ? errorColor : normalColor;
  textInput.textAlignVertical = props.numberOfLines ? "top" : "center";

  return (
    <View style={styles.viewBox}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        style={textInput}
        placeholder={props.placeholder ? props.placeholder : ""}
        multiline={props.multiline ? props.multiline : false}
        numberOfLines={props.numberOfLines ? props.numberOfLines : 1}
        {...props}
      />
      {maybeShowError(props.error)}
    </View>
  );
};

maybeShowError = error => {
  if (error !== "") {
    return <Text style={styles.errorLabel}>{error}</Text>;
  }
};

const styles = StyleSheet.create({
  viewBox: {
    marginBottom: 20
  },
  label: {
    paddingLeft: 10,
    marginBottom: 5,
    color: "rgb(166, 166, 166)"
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 3,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  errorLabel: {
    color: errorColor,
    fontSize: 12,
    paddingLeft: 10,
    marginTop: 5
  }
});
