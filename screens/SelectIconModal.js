import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet
} from "react-native";
import IconStore from "../data-store/IconStore";

const IconTile = props => {
  const { icon, category, onPress, navigation } = props;

  return (
    <TouchableOpacity
      style={styles.iconTile}
      onPress={() => {
        let iconJsonString = JSON.stringify({
          cat: category,
          id: icon.id
        });

        onPress(iconJsonString);

        navigation.goBack();
      }}
    >
      <Image style={styles.iconImage} source={icon.sourceBlack} />
    </TouchableOpacity>
  );
};

export default class SelectIconModal extends React.Component {
  static navigationOptions = {
    title: "Choose Icon"
  };

  renderIcons = () => {
    const onSelect = this.props.navigation.getParam("onSelect", null);
    const allIcons = IconStore.getAll();
    let viewArray = [];

    for (let category in allIcons) {
      const icons = allIcons[category];

      const tiles = icons.map((iconObject, index) => {
        return (
          <IconTile
            key={index}
            icon={iconObject}
            onPress={onSelect}
            category={category}
            navigation={this.props.navigation}
          />
        );
      });

      viewArray.push(tiles);
    }

    return viewArray;
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.scrollViewInner}>{this.renderIcons()}</View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  scrollView: {
    flex: 1
  },
  scrollViewInner: {
    flexWrap: "wrap",
    flexDirection: "row"
  },
  iconTile: {
    minWidth: "25%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9e9e9",
    paddingVertical: 15
  },
  iconImage: {
    width: "100%",
    height: 80
  }
});
