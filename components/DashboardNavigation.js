import React from "react";
import {
  AsyncStorage,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";

const DashboardButton = props => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      {getIcon(props.icon)}
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const getIcon = icon => {
  switch (icon) {
    case "settings":
      return (
        <Image
          style={styles.buttonIcon}
          source={require("../assets/images/settings-icon.png")}
        />
      );
    case "rewards":
      return (
        <Image
          style={styles.buttonIcon}
          source={require("../assets/images/dash-rewards-icon.png")}
        />
      );
    case "transaction":
      return (
        <Image
          style={styles.buttonIcon}
          source={require("../assets/images/transaction-icon.png")}
        />
      );
    case "products":
    default:
      return (
        <Image
          style={styles.buttonIcon}
          source={require("../assets/images/products-icon.png")}
        />
      );
  }
};

export default class DashboardNavigation extends React.Component {
  _logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };

  render() {
    return (
      <View style={styles.box}>
        <DashboardButton
          title="Manage Products"
          icon="products"
          onPress={() => {
            this.props.navigation.navigate("ManageProducts");
          }}
        />
        <DashboardButton
          title="Manage Rewards"
          icon="rewards"
          onPress={() => {
            this.props.navigation.navigate("ManageRewards");
          }}
        />
        <DashboardButton
          title="Transaction History"
          icon="transaction"
          onPress={() => {
            this.props.navigation.navigate("Transactions");
          }}
        />
        <DashboardButton
          title="Settings"
          icon="settings"
          onPress={() => {
            this.props.navigation.navigate("Settings");
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    overflow: "hidden",
    // backgroundColor: "rgb(11,17,35)",
    // flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    // margin: 1
    borderRadius: 15
  },
  button: {
    // flex: 1,
    minWidth: "50%",
    // height: 50,
    borderColor: "rgb(244, 57, 56)",
    borderWidth: 1,
    paddingVertical: 25,
    paddingHorizontal: 5,
    backgroundColor: "rgb(11,17,35)"
  },
  buttonIcon: {
    width: 40,
    height: 40,
    alignSelf: "center",
    marginBottom: 14
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 13
  }
});
