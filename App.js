import React from "react";
import { AppLoading, Icon } from "expo";
import { Asset } from "expo-asset";
// import { Font } from "expo-font";
import DashboardScreen from "./screens/DashboardScreen";
import AppNavigator from "./navigation/AppNavigator";
// import { createStackNavigator, createAppContainer } from "react-navigation";
// import AppNavigator from "./navigation/AppNavigator";

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return <AppNavigator />;
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require("./assets/images/splash.png"),
        require("./assets/images/dashboard-bg.png"),
        require("./assets/images/qr-code-icon.png")
      ])
      // Font.loadAsync({
      //   // This is the font that we are using for our tab bar
      //   ...Icon.Ionicons.font,
      //   // We include SpaceMono because we use it in HomeScreen.js. Feel free
      //   // to remove this if you are not using it in your app
      //   "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
      // })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}
