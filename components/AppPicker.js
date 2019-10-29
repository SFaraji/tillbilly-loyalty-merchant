import React from "react";
import { View, Text, TextInput, StyleSheet, Picker } from "react-native";

export default AppPicker = props => {
  const { dataArray, labelKey, valueKey, selectedValue, onValueChange } = props;
  return (
    <View style={styles.viewBox}>
      <Text
        style={styles.label}
        placeholder={props.placeholder ? props.placeholder : ""}
      >
        {props.label}
      </Text>
      <View style={styles.pickerView}>
        <Picker
          style={styles.picker}
          selectedValue={selectedValue}
          onValueChange={(itemValue, itemIndex) => {
            if (onValueChange) {
              onValueChange(itemValue, itemIndex);
            }
          }}
        >
          {dataArray.map((item, index) => {
            return (
              <Picker.Item
                key={index}
                label={labelKey ? item[labelKey] : item}
                value={valueKey ? item[valueKey] : item}
              />
            );
          })}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewBox: {
    marginBottom: 25
  },
  label: {
    paddingLeft: 10,
    marginBottom: 5,
    color: "rgb(166, 166, 166)"
  },
  pickerView: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "rgb(245, 243, 251)"
  },
  picker: {
    paddingVertical: 10,
    paddingHorizontal: 10
  }
});
