import React from "react";
import { View, Text, StyleSheet, Linking, ScrollView } from "react-native";
import Licenses from "../../data-store/Licenses";

export default class AboutScreen extends React.Component {
  static navigationOptions = {
    title: "About"
  };

  state = {
    licenses: []
  };

  componentDidMount = () => {
    let licenses = Object.keys(Licenses).map(key => {
      const { licenseUrl } = Licenses[key];
      const [name, version] = key.split("@");
      return {
        name,
        version,
        link: licenseUrl
      };
    });

    this.setState({ licenses });
  };

  renderLicenses = () => {
    const { licenses } = this.state;

    return licenses.map((license, index) => (
      <View key={index}>
        <Text style={styles.paragraph}>{license.name}</Text>
        <Text style={styles.small}>{"v" + license.version}</Text>
        <Text style={styles.link}>{license.link}</Text>
      </View>
    ));
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.contentBox}>
          <Text style={styles.title}>TillBilly Merchant</Text>
          <Text style={styles.small}>Version 1.0</Text>
          <Text style={styles.paragraph}>
            This is the TillBilly merchant loyalty app for merchants running a
            brick and mortar stores.
          </Text>
          <Text
            style={{ ...styles.paragraph, ...styles.link }}
            onPress={() => {
              Linking.openURL("https://tillbilly.com/terms");
            }}
          >
            Terms of service
          </Text>
          <Text
            style={{ ...styles.paragraph, ...styles.link }}
            onPress={() => {
              Linking.openURL("https://tillbilly.com/privacy");
            }}
          >
            Privacy policy
          </Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.contentBox}>
          <Text style={styles.title}>Third Party Licenses</Text>
          {this.renderLicenses()}
        </View>
        <View style={{ paddingVertical: 40 }}></View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 25
  },
  contentBox: {},
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginVertical: 20
  },
  title: {
    fontSize: 22
  },
  paragraph: {
    fontSize: 16,
    marginTop: 15
  },
  small: {
    fontSize: 14,
    color: "#aaa"
  },
  link: {
    color: "#0099ff"
  }
});
