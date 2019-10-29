import React from "react";
import {
  TouchableWithoutFeedback,
  View,
  Text,
  Animated,
  StyleSheet
} from "react-native";
import AppButton from "../../components/AppButton";

export default class ConfirmationModal extends React.Component {
  state = {
    fadeValue: new Animated.Value(0)
  };

  handleConfirm = () => {
    const onConfirm = this.props.navigation.getParam("onConfirm", null);

    if (onConfirm) {
      onConfirm();
    }

    this.goBack();
  };

  handleCancel = () => {
    const onCancel = this.props.navigation.getParam("onCancel", null);

    if (onCancel) {
      onCancel();
    }

    this.goBack();
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  componentDidMount() {
    Animated.timing(this.state.fadeValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      delay: 0.2
    }).start();
  }

  render() {
    const { fadeValue } = this.state;

    const { getParam } = this.props.navigation;
    const message = getParam("message", "Confirm Action");
    const confirmText = getParam("confirmText", "Confirm");
    const cancelText = getParam("cancelText", "Cancel");

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.goBack}>
          <Animated.View style={{ ...styles.cover, opacity: fadeValue }} />
        </TouchableWithoutFeedback>
        <View style={styles.body}>
          <Text style={styles.label}>{message}</Text>
          <View style={styles.buttonBox}>
            <AppButton
              title={confirmText}
              onPress={this.handleConfirm}
              color="rgb(244, 57, 56)"
            />
            <View style={styles.gutter} />
            <AppButton title={cancelText} onPress={this.handleCancel} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch"
  },
  cover: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  label: {
    fontSize: 16,
    marginBottom: 15
  },
  buttonBox: {
    flexDirection: "row",
    width: "100%"
  },
  gutter: {
    width: 10,
    flex: 0
  }
});
