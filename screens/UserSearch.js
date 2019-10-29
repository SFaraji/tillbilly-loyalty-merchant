import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView
} from "react-native";

import { API_GetCustomers } from "../components/Endpoints";
import CustomerTile from "../components/CustomerRow";

export default class UserSearch extends React.Component {
  static navigationOptions = {
    title: "Search customers"
  };

  state = {
    query: "",
    customers: [],
    showKeyboard: false
  };

  searchState = {
    entries: {},
    loading: false
  };

  componentDidMount() {
    this.setState({ showKeyboard: true });
  }

  componentDidUpdate() {
    if (this.state.showKeyboard) {
      this.textInput.focus();
    }
  }

  handleSearchInput = value => {
    this.setState({ query: value });
    this.getCustomersAsync();
  };

  getCustomersAsync = async () => {
    const customers = await API_GetCustomers({ displayName: this.state.query });
    this.setState({ customers });
  };

  renderCustomers = () => {
    const { customers } = this.state;

    if (customers.length > 0) {
      return customers.map((customer, index) => (
        <CustomerTile
          key={index}
          customer={customer}
          onPress={_customer => {
            this.props.navigation.replace("Reward", {
              customer: _customer
            });
          }}
        ></CustomerTile>
      ));
    } else {
      return (
        <View style={{ marginTop: 20 }}>
          <Text>No matching customers found</Text>
        </View>
      );
    }
  };

  render() {
    const { query } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.subcontainer}>
          <View style={styles.subheader}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.searchbar}
                placeholder="Search user"
                keyboardType="web-search"
                value={query}
                onChangeText={this.handleSearchInput}
                ref={input => {
                  this.textInput = input;
                }}
              />
            </View>
          </View>
        </View>
        <ScrollView style={styles.body}>{this.renderCustomers()}</ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column"
  },
  subcontainer: {},
  subheader: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "rgb(245, 243, 251)"
  },
  searchbar: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 3,
    fontSize: 14,
    paddingHorizontal: 17,
    borderColor: "rgb(175, 176, 187)",
    height: 50,
    textAlignVertical: "center"
  },
  body: {
    flex: 1,
    paddingHorizontal: 20
  }
});
