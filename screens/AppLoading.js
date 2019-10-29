import React from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  ImageBackground,
  Platform
} from "react-native";

export default class AppLoadingScreen extends React.Component {
  // static navigationOptions = {
  //   headerMode: "none"
  // };

  constructor(props) {
    super(props);
    this._bootstrapAsyc();
  }

  _bootstrapAsyc = async () => {
    const userToken = await AsyncStorage.getItem("authToken");

    this.props.navigation.navigate(userToken ? "App" : "Auth");
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
    translateY: 100
  }
});
