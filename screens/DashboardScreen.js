import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Image
} from "react-native";
import SearchBar from "../components/SearchBar";
import DashboardNavigation from "../components/DashboardNavigation";
import Stores from "../data-store/StoresStore";
import PlusButton from "../components/PlusButton";

const QRButton = props => {
  return (
    <TouchableOpacity style={styles.qrButton} onPress={props.onPress}>
      <Image
        source={require("../assets/images/qr-code-icon.png")}
        style={styles.qrButtonImage}
      />
    </TouchableOpacity>
  );
};

export default class DashboardScreen extends React.Component {
  static navigationOptions = {
    title: "Dashboard",
    headerLeft: <View></View>
  };

  state = {
    hasStore: false
  };

  handleQRButton = () => {
    // Go to scan screen
    this.props.navigation.navigate("ScanCode");
    // this.props.navigation.navigate("Reward");
  };

  handleSearchPress = () => {
    this.props.navigation.navigate("UserSearch");
  };

  async componentDidMount() {
    this.props.navigation.addListener("willFocus", async () => {
      const storeInStorage = await Stores.getItemsAsync();

      this.setState({
        hasStore: storeInStorage ? true : false
      });
    });
  }

  renderBody = () => {
    if (this.state.hasStore) {
      return (
        <View style={styles.subcontainer}>
          <View style={styles.subheader}>
            <View style={{ flex: 1 }}>
              <SearchBar
                placeholder="Search user"
                onFocus={this.handleSearchPress}
              />
            </View>
            <View style={{ flex: 0 }}>
              <QRButton onPress={this.handleQRButton} />
            </View>
          </View>
          <View style={styles.body}>
            <DashboardNavigation navigation={this.props.navigation} />
          </View>
        </View>
      );
    } else {
      return this.renderStoreless();
    }
  };

  renderStoreless = () => {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          padding: 20,
          ...styles.subcontainer
        }}
      >
        <Text style={styles.noStoreText}>No Store Added</Text>
        <Text style={styles.noStoreText}>Please add a store to continue</Text>
        <PlusButton
          onPress={() => {
            this.props.navigation.navigate("AddStore");
          }}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ImageBackground
          source={require("../assets/images/dashboard-bg.png")}
          style={styles.background}
        >
          {this.renderBody()}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  subcontainer: {
    flex: 1
  },
  subheader: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "rgb(245, 243, 251)"
  },
  body: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20
    // padding: 40
  },
  background: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end"
  },
  qrButton: {
    padding: 10,
    backgroundColor: "rgb(11,17,35)",
    borderRadius: 15,
    overflow: "hidden",
    marginLeft: 15
  },
  qrButtonImage: {
    width: 30,
    height: 30
  },
  noStoreText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10
  }
});
