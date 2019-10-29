import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from "react-native";

export default class CounterBox extends React.Component {
  state = {
    minValue: 0,
    counterStep: 1
  };

  handleIncrement = () => {
    let { counterStep } = { ...this.state };
    let { value } = { ...this.props };

    value = parseInt(value);

    value += counterStep;

    this.onUpdate(value);
  };

  handleDecrement = () => {
    let { counterStep, minValue } = { ...this.state };
    let { value } = { ...this.props };

    value = parseInt(value);

    if (value > minValue) {
      value -= counterStep;
    }

    this.onUpdate(value);
  };

  onUpdate = counter => {
    this.props.onUpdate(counter);
  };

  componentDidMount = () => {
    const counterProps = {
      minValue: parseInt(this.props.minValue) || 0,
      counterStep: parseInt(this.props.counterStep) || 1
    };
    this.setState(counterProps);
  };

  render() {
    return (
      <View style={styles.box}>
        <Text style={styles.label}>{this.props.label}</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.buttonLeft}
            onPress={this.handleDecrement}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            onChangeText={value => {
              this.onUpdate(value);
            }}
          >
            {this.props.value}
          </TextInput>
          <TouchableOpacity
            style={styles.buttonRight}
            onPress={this.handleIncrement}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    marginBottom: 25
  },
  label: {
    paddingLeft: 10,
    marginBottom: 5,
    color: "rgb(166, 166, 166)"
  },
  row: {
    flexDirection: "row"
  },
  buttonLeft: {
    width: 50,
    height: 50,
    backgroundColor: "#000",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15
  },
  buttonRight: {
    width: 50,
    height: 50,
    backgroundColor: "#000",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15
  },
  buttonText: {
    color: "#fff",
    lineHeight: 50,
    fontSize: 24,
    textAlign: "center"
  },
  input: {
    backgroundColor: "#fff",
    borderTopWidth: 3,
    borderBottomWidth: 3,
    paddingHorizontal: 17,
    borderColor: "rgb(245, 243, 251)",
    height: 50,
    textAlign: "center",
    fontSize: 14,
    textAlignVertical: "center"
  }
});
