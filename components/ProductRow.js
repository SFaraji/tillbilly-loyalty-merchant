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
import IconStore from "../data-store/IconStore";

const ProductRow = props => {
  return (
    <View>
      {Platform.OS === "ios" ? (
        <TouchableOpacity
          onPress={() => {
            props.onPress(props.product);
          }}
        >
          <RowView product={props.product} />
        </TouchableOpacity>
      ) : (
        <TouchableNativeFeedback
          delayPressIn={0.5}
          delayPressOut={0.5}
          onPress={() => {
            props.onPress(props.product);
          }}
        >
          <View style={{ flex: 1 }}>
            <RowView product={props.product} />
          </View>
        </TouchableNativeFeedback>
      )}
    </View>
  );
};

const RowView = props => {
  const { name, pointsPerUnit, icon } = props.product;
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        {IconStore.getIcon(icon, styles.iconImage)}
      </View>
      <Text style={styles.label}>{name}</Text>
      <Text style={styles.points}>
        {pointsPerUnit + (pointsPerUnit === 1 ? " pt" : " pts")}
      </Text>
    </View>
  );
};

export default ProductRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "rgb(191, 191, 191)",
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 15
  },
  icon: {
    width: 40,
    height: 40,
    // backgroundColor: "#aaa",
    marginRight: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  iconImage: {
    width: 40,
    height: 40
  },
  label: {
    fontSize: 16,
    flex: 1,
    lineHeight: 40,
    fontWeight: "bold"
  },
  points: {
    fontSize: 16,
    flex: 0,
    color: "rgb(140, 140, 140)",
    lineHeight: 40,
    marginLeft: 10
  }
});
