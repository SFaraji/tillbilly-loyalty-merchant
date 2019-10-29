import React from "react";
import {
  ImageBackground,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar
} from "react-native";

import { AntDesign } from "@expo/vector-icons";

const SocialButton = props => {
  const boxStyles = { ...styles.socialButton, ...styles[props.provider] };
  return (
    <TouchableOpacity style={boxStyles} {...props}>
      <View style={styles.socialButtonImage}>
        {getSocialIcon(props.provider)}
      </View>
      <Text style={styles.socialButtonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const getSocialIcon = provider => {
  if (provider === "facebook") {
    return (
      <AntDesign name="facebook-square" size={20} color="#fff"></AntDesign>
    );
  } else if (provider === "google") {
    return <AntDesign name="google" size={20} color="#fff"></AntDesign>;
  }
};

export default class SocialScreen extends React.Component {
  static navigationOptions = {
    headerMode: "none"
  };

  _gotoEmailLogin = () => {
    this.props.navigation.navigate("EmailLogin");
  };

  render() {
    return (
      <ImageBackground
        style={styles.container}
        source={require("../../assets/images/login-bg.png")}
      >
        <StatusBar barStyle="dark-content" />
        <View style={styles.body}>
          <SocialButton provider="facebook" title="Continue with Facebook" />
          <SocialButton provider="google" title="Continue with Google" />
          <View style={styles.footer}>
            <TouchableOpacity onPress={this._gotoEmailLogin}>
              <Text style={styles.footerLink}>or use email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 40,
    paddingBottom: 15,
    flex: 1,
    justifyContent: "flex-end"
  },
  body: {
    marginBottom: 10
  },
  socialButton: {
    borderRadius: 15,
    padding: 10,
    minHeight: 50,
    justifyContent: "center",
    marginBottom: 12
  },
  facebook: {
    backgroundColor: "rgb(59,89,152)"
  },
  google: {
    backgroundColor: "rgb(66,133,244)"
  },
  twitter: {
    backgroundColor: "rgb(85,172,238)"
  },
  socialButtonText: {
    fontSize: 16,
    textAlign: "center",
    color: "#fff"
  },
  socialButtonImage: {
    position: "absolute",
    left: 15
  },
  footer: {
    marginTop: 20,
    alignItems: "center"
  },
  footerLink: {
    color: "#fff"
  }
});
