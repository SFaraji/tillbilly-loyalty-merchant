import React from "react";
import {
  ActivityIndicator,
  Platform,
  AsyncStorage,
  StyleSheet,
  ImageBackground
} from "react-native";
import SessionService from "../../services/SessionService";
import Stores from "../../data-store/StoresStore";

export default class AuthLoadingScreen extends React.Component {
  // static navigationOptions = {
  //   headerMode: "none"
  // };

  constructor(props) {
    super(props);
    this._bootstrapAsyc();
  }

  _bootstrapAsyc = async () => {
    const sessionReady = await SessionService.initialize();

    if (sessionReady.exists) {
      const storeInStorage = await Stores.getItemsAsync();

      // console.log("Store in app cache: ", storeInStorage);

      // if (stores && stores.length > 0) {
      if (storeInStorage) {
        this.props.navigation.navigate("Dashboard");
        // this.props.navigation.navigate("AddStore", {
        //   isEdit: true
        // });
      } else {
        try {
          const _store = await Stores.getStoreFromServerAsync();

          if (_store && _store.length > 0) {
            this.props.navigation.navigate("Dashboard");
          } else {
            this.props.navigation.navigate("AddStore");
          }
        } catch (error) {
          console.log("Error getting store from server", error);
        }
      }
    } else {
      this.props.navigation.navigate("Auth");
    }
  };

  render() {
    return (
      <ImageBackground
        source={require("../../assets/images/splash.png")}
        style={styles.container}
      >
        <ActivityIndicator
          color="rgb(244, 57, 56)"
          size="small"
          style={styles.activity}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  activity: {
    transform: [{ translateY: 100 }]
  }
});
