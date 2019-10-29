import React from "react";
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity
} from "react-native";

const ListButton = props => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "Settings"
  };

  handleLogout = () => {
    this.props.navigation.navigate("ConfirmationModal", {
      message: "Are you sure you want to logout?",
      onConfirm: this.handleLogoutConfirm
    });
  };

  handleLogoutConfirm = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };

  handleUpdateStore = () => {
    this.props.navigation.navigate("AddStore", {
      isEdit: true
    });
  };

  handleAboutPress = () => {
    this.props.navigation.navigate("About");
  };

  render() {
    return (
      <View style={styles.container}>
        <ListButton
          title="Update Store Details"
          onPress={this.handleUpdateStore}
        />
        <ListButton title="About" onPress={this.handleAboutPress} />
        <ListButton title="Logout" onPress={this.handleLogout} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  button: {
    borderBottomColor: "rgb(240, 240, 240)",
    borderBottomWidth: 1,
    padding: 25
  },
  buttonText: {
    color: "#000",
    fontSize: 18
  }
});
