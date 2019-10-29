import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default class SearchBar extends React.Component {
  render() {
    return (
      <TextInput
        style={styles.searchbar}
        placeholder={this.props.placeholder ? this.props.placeholder : "Search"}
        keyboardType="web-search"
        onChangeText={this.props.onChangeText}
        {...this.props}
      />
    );
  }
}

const styles = StyleSheet.create({
  searchbar: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 3,
    fontSize: 14,
    paddingHorizontal: 17,
    borderColor: "rgb(175, 176, 187)",
    height: 50,
    textAlignVertical: "center"
  }
});
