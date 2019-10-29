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

const RewardRow = props => {
  return (
    <View>
      {Platform.OS === "ios" ? (
        <TouchableOpacity
          onPress={() => {
            props.onPress(props.reward);
          }}
        >
          <RowView reward={props.reward} />
        </TouchableOpacity>
      ) : (
        <TouchableNativeFeedback
          delayPressIn={0.5}
          delayPressOut={0.5}
          onPress={() => {
            props.onPress(props.reward);
          }}
        >
          <View style={{ flex: 1 }}>
            <RowView reward={props.reward} />
          </View>
        </TouchableNativeFeedback>
      )}
    </View>
  );
};

const RowView = props => {
  const { title, pointsRequired, terms } = props.reward;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{title}</Text>
      <Text style={styles.points}>
        {pointsRequired + (pointsRequired === 1 ? " pt" : " pts")}
      </Text>
    </View>
  );
};

export default RewardRow;

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    borderBottomColor: "rgb(191, 191, 191)",
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 15
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
  },
  tnf: {
    backgroundColor: "#0099ff"
  }
});
