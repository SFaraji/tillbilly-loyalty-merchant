import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Linking
} from "react-native";
import { API_Signup } from "../../components/Endpoints";

import AppTextInput from "../../components/AppTextInput";
import AppButton from "../../components/AppButton";
import KeyboardShift from "../../components/KeyboardShift";

import Stores from "../../data-store/StoresStore";

export default class SignupScreen extends React.Component {
  static navigationOptions = {
    headerMode: "none"
  };

  state = {
    inputs: {
      email: {
        value: "testmerchant@tillbilly.com",
        error: ""
      },
      password1: {
        value: "admin",
        error: ""
      },
      password2: {
        value: "",
        error: ""
      }
    }
  };

  _submit = async () => {
    if (!this._validate()) return;

    const { inputs } = this.state;
    const { email, password1 } = inputs;

    try {
      await API_Signup(email.value, password1.value);

      this.props.navigation.navigate("AddStore");
    } catch (error) {
      console.log("Signup error", error);

      const { errors } = error;
      const { inputs } = this.state;
      const { email } = inputs;

      if (errors) {
        errors.forEach(e => {
          if (e.field === "emailAddress") {
            email.error = "Email already taken";
            this.setState({ inputs });
          }
        });
      } else {
        if (error.status === 500) {
          console.log("Internal Server Error");
        }
      }
    }
  };

  _gotoLogin = () => {
    this.props.navigation.navigate("Login");
  };

  _handleInput = (value, prop) => {
    const { inputs } = { ...this.state };
    inputs[prop].value = value;
    this.setState({ inputs });
  };

  _validate = () => {
    let isValid = true;

    const { inputs } = this.state;
    const { email, password1, password2 } = inputs;

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(email.value)) {
      email.error = "Please enter a valid email";
      isValid = false;
    } else {
      email.error = "";
    }

    if (password1.value == "") {
      password1.error = "Passwords cannot be empty";
      isValid = false;
    } else {
      password1.error = "";
    }

    if (password1.value !== password2.value) {
      password2.error = "Passwords do not match";
      isValid = false;
    } else {
      password2.error = "";
    }

    if (password1.value.length < 5 || password1.value.length > 128) {
      password1.error =
        "Password must be between 5 and 128 characters in length";
      isValid = false;
    } else {
      password1.error = "";
    }

    this.setState({ inputs });

    return isValid;
  };

  render() {
    const { inputs } = this.state;
    const { email, password1, password2 } = inputs;

    return (
      <KeyboardShift>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.body}>
            <AppTextInput
              label="Email"
              value={email.value}
              error={email.error}
              onChangeText={v => {
                this._handleInput(v, "email");
              }}
              textContentType="emailAddress"
            />
            <AppTextInput
              label="Password"
              value={password1.value}
              error={password1.error}
              onChangeText={v => {
                this._handleInput(v, "password1");
              }}
              textContentType="password"
              secureTextEntry={true}
            />
            <AppTextInput
              label="Confirm Password"
              value={password2.value}
              error={password2.error}
              onChangeText={v => {
                this._handleInput(v, "password2");
              }}
              textContentType="password"
              secureTextEntry={true}
            />
            <AppButton
              title="Signup"
              color="rgb(244, 57, 56)"
              onPress={this._submit}
            />
            <View style={styles.agreeText}>
              <Text>
                {`By signing up for an account you agree to TillBilly's `}
                <Text
                  style={styles.link}
                  onPress={() => {
                    Linking.openURL("https://tillbilly.com/terms");
                  }}
                >
                  terms of service
                </Text>
                {` and `}
                <Text
                  style={styles.link}
                  onPress={() => {
                    Linking.openURL("https://tillbilly.com/privacy");
                  }}
                >
                  privacy policy
                </Text>
              </Text>
            </View>
            <View style={styles.footer}>
              <Text>Already have a merchant account?</Text>
              <TouchableOpacity onPress={this._gotoLogin}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardShift>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 40,
    flexGrow: 1,
    justifyContent: "flex-end"
  },
  body: {
    // justifyContent: "flex-end"
  },
  agreeText: {
    marginTop: 15
  },
  link: {
    color: "#0099ff"
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
    borderTopColor: "#e0e0e0",
    borderTopWidth: 1,
    paddingTop: 20
  },
  footerLink: {
    color: "#666"
  }
});
