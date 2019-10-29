import React from "react";
import {
  Platform,
  StatusBar,
  Image,
  Button,
  Text,
  StyleSheet,
  View
} from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import { createStackNavigator, createAppContainer } from "react-navigation";
// import AppNavigator from "./navigation/AppNavigator";

class LogoTitle extends React.Component {
  render() {
    return (
      <Image
        source={require("./assets/images/robot-dev.png")}
        style={{ width: 30, height: 30 }}
      />
    );
  }
}

class HomeScreen extends React.Component {
  state = {
    count: 0
  };

  _increaseCount = () => {
    this.setState({ count: this.state.count + 1 });
  };

  static navigationOptions = ({ navigation }) => {
    return {
      // title: "Home",
      headerTitle: <LogoTitle />,
      headerLeft: (
        <Button
          onPress={() => {
            navigation.navigate("MyModal");
          }}
          title="Info"
          color="#078459"
        />
      ),
      headerRight: (
        <Button
          onPress={navigation.getParam("increaseCount")}
          title="+1"
          color="#0099ff"
        />
      )
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({ increaseCount: this._increaseCount });
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
        <Text>{this.state.count}</Text>
        <Button
          title="Go to Details"
          onPress={() =>
            /* 1. Navigate to the Details route with params */
            this.props.navigation.navigate("Details", {
              itemId: 1001,
              otherParam: "Execute order!"
            })
          }
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;

    return {
      title: params ? params.otherParam : "A Nested Details Screen",
      headerStyle: {
        backgroundColor: navigationOptions.headerTintColor
      },
      headerTintColor: navigationOptions.headerStyle.backgroundColor
    };
  };

  render() {
    const { navigation } = this.props;
    const itemId = navigation.getParam("itemId", "No-Id");
    const otherParam = navigation.getParam("otherParam", "Don't execute order");

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Details Screen</Text>
        <Text>Item id: {JSON.stringify(itemId)}</Text>
        <Text>Other param: {JSON.stringify(otherParam)}</Text>
        <Button
          title="Go to Details... again"
          onPress={() =>
            this.props.navigation.push("Details", {
              itemId: Math.floor(Math.random() * 1000)
            })
          }
        />
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate("Home")}
        />
        <Button
          title="Go Back"
          onPress={() => this.props.navigation.goBack()}
        />
        <Button
          title="Update the title"
          onPress={() =>
            this.props.navigation.setParams({ otherParam: "Updated!" })
          }
        />
      </View>
    );
  }
}

class ModalScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
      </View>
    );
  }
}

const MainStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#f4511e"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    }
  }
);

const RootStack = createStackNavigator(
  {
    Main: MainStack,
    MyModal: ModalScreen
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

const AppContainer = createAppContainer(RootStack);

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
      return (
        // <View style={styles.container}>
        //   {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        //   <AppNavigator />
        // </View>
        <AppContainer />
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require("./assets/images/robot-dev.png"),
        require("./assets/images/robot-prod.png")
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
      })
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
