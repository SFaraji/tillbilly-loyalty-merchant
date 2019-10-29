import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  ToastAndroid
} from "react-native";

import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import CounterBox from "../components/CounterBox";
import KeyboardShift from "../components/KeyboardShift";

import Rewards from "../data-store/RewardsStore";
import Store from "../data-store/StoresStore";

export default class EditRewardScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? "Edit Reward" : "Add Reward"
    };
  };

  state = {
    rewardData: {
      title: "",
      pointsRequired: 1,
      terms: "",
      storeId: ""
    }
  };

  async componentDidMount() {
    let rewardData = { ...this.state.rewardData };
    rewardData.storeId = await Store.getStoreId();

    const reward = this.props.navigation.getParam("reward");

    if (reward) {
      rewardData = { ...reward };
    }

    this.setState({ rewardData });
  }

  handleTextInput = (value, prop) => {
    let rewardData = { ...this.state.rewardData };
    rewardData[prop] = value;
    this.setState({ rewardData });
  };

  handleSubmit = async () => {
    let rewardData = { ...this.state.rewardData };

    try {
      if (rewardData.id) {
        await Rewards.editReward(rewardData);
      } else {
        await Rewards.addReward(rewardData);
      }

      this.props.navigation.goBack();
    } catch (error) {
      console.log("Reward creation error: ", error);

      // #TODO Handle creation errors

      if (error.status) {
        let m =
          "Status: " +
          error.status +
          "\n" +
          "Message: " +
          (error.message || error.statusText);
        ToastAndroid.show(m, ToastAndroid.LONG);
      }
    }
  };

  handleUpdate = () => {
    this.props.navigation.navigate("ConfirmationModal", {
      message:
        "This may impact your existing customers. Do you still wish to continue?",
      onConfirm: this.handleSubmit
    });
  };

  handleClear = () => {
    //
  };

  handleDelete = () => {
    this.props.navigation.navigate("ConfirmationModal", {
      message:
        "Are you sure you want to delete this reward: " +
        this.state.rewardData.title +
        "?",
      onConfirm: this.handleConfirmDelete
    });
  };

  handleConfirmDelete = async () => {
    console.log("Reward to be deleted");

    try {
      await Rewards.deleteReward(this.state.rewardData.id);
      this.props.navigation.goBack();
    } catch (error) {
      console.log("Reward deletion error: ", error);

      // #TODO Handle creation errors

      if (error.status) {
        let m =
          "Status: " +
          error.status +
          "\n" +
          "Message: " +
          (error.message || error.statusText);
        ToastAndroid.show(m, ToastAndroid.LONG);
      }
    }
  };

  render() {
    const { rewardData } = this.state;
    const isEdit = this.props.navigation.getParam("reward") ? true : false;

    return (
      <KeyboardShift>
        <ScrollView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.subheader}>
            <Image
              style={styles.iconImage}
              source={require("../assets/images/rewards-icon.png")}
            />
          </View>
          <View style={styles.body}>
            <AppTextInput
              label="Reward Name"
              value={rewardData.title}
              onChangeText={value => {
                this.handleTextInput(value, "title");
              }}
            />
            <CounterBox
              label="Points Required"
              minValue={1}
              value={rewardData.pointsRequired}
              onUpdate={value => {
                this.handleTextInput(value, "pointsRequired");
              }}
            />
            <AppTextInput
              label="Terms and Conditions"
              multiline={true}
              numberOfLines={5}
              value={rewardData.terms}
              onChangeText={value => {
                this.handleTextInput(value, "terms");
              }}
            />
            <View style={styles.buttonBox}>
              <AppButton
                title={isEdit ? "Update" : "Add"}
                onPress={() => {
                  if (isEdit) {
                    this.handleUpdate();
                  } else {
                    this.handleSubmit();
                  }
                }}
              />
              <View style={styles.gutter} />
              <AppButton
                title={isEdit ? "Delete" : "Clear"}
                color="rgb(244, 57, 56)"
                onPress={() => {
                  if (isEdit) {
                    this.handleDelete();
                  } else {
                    this.handleClear();
                  }
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardShift>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  body: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 20
  },
  subheader: {
    flexDirection: "column",
    padding: 25,
    backgroundColor: "rgb(245, 243, 251)",
    alignItems: "center"
  },
  iconImage: {
    width: 140,
    height: 140
  },
  addButton: {
    borderBottomColor: "rgb(244, 57, 56)",
    borderBottomWidth: 0.25,
    padding: 10,
    backgroundColor: "rgb(11,17,35)",
    borderRadius: 15,
    overflow: "hidden",
    marginLeft: 15
  },
  addButtonText: {
    width: 30,
    height: 30,
    fontSize: 30,
    color: "#fff",
    textAlign: "center"
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
