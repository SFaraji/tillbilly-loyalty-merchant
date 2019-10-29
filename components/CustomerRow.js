import React from "react";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Image
} from "react-native";

export default CustomerTile = props => {
  return (
    <View>
      <View style={styles.customerTileOuter}>
        {Platform.OS === "ios" ? (
          <TouchableOpacity
            onPress={() => {
              props.onPress(props.customer);
            }}
          >
            <View style={{ flex: 1 }}>{CustomerView(props)}</View>
          </TouchableOpacity>
        ) : (
          <TouchableNativeFeedback
            delayPressIn={0.5}
            delayPressOut={0.5}
            onPress={() => {
              props.onPress(props.customer);
            }}
          >
            <View style={{ flex: 1 }}>{CustomerView(props)}</View>
          </TouchableNativeFeedback>
        )}
      </View>
    </View>
  );
};

const CustomerView = props => {
  const { displayName, assetsUrl, lastVisitedAt } = props.customer;

  return (
    <View style={styles.customerTile}>
      <View style={styles.avatarBox}>
        <Image style={styles.avatarImage} source={getAvatar(assetsUrl)} />
      </View>
      <View style={styles.customerDetails}>
        <Text style={styles.customerName}>{displayName}</Text>
      </View>
    </View>
  );
};

const getAvatar = assetsUrl => {
  if (assetsUrl) {
    const { avatar } = assetsUrl;

    if (avatar) {
      return { uri: avatar };
    } else {
      return require("../assets/images/temp-avatar.png");
    }
  }

  return require("../assets/images/temp-avatar.png");
};

const styles = StyleSheet.create({
  customerTileOuter: {
    borderBottomColor: "rgb(191, 191, 191)",
    borderBottomWidth: 1
  },
  customerTile: {
    padding: 15,
    flexDirection: "row"
  },
  avatarBox: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 100,
    overflow: "hidden"
  },
  avatarImage: {
    width: 40,
    height: 40
  },
  customerDetails: {
    flex: 1,
    justifyContent: "center"
  },
  customerName: {
    fontSize: 16
  }
});
