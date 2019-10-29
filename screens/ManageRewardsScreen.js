import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl
} from "react-native";

import SearchBar from "../components/SearchBar";
import RewardRow from "../components/RewardRow";
import PlusButton from "../components/PlusButton";
import Rewards from "../data-store/RewardsStore";

export default class ManageRewardsScreen extends React.Component {
  static navigationOptions = {
    title: "Manage Rewards"
  };

  state = {
    rewards: [],
    refreshing: false,
    search: ""
  };

  handleAddButton = navigation => {
    navigation.navigate("EditReward");
  };

  componentDidMount() {
    this.props.navigation.addListener("willFocus", () => {
      console.log("Rewards will be updated from did mount");
      this.updateRewards();
    });
  }

  updateRewards = async () => {
    const rewards = await Rewards.getItemsAsync();

    if (rewards === null) {
      await this.getRewardsFromServer();
    } else {
      console.log("Rewards in cache: ", rewards);
      this.setState({ rewards: rewards });
    }
  };

  getRewardsFromServer = async () => {
    const rewards = await Rewards.getRewardsFromServerAsync();
    this.setState({ rewards: rewards });
  };

  renderRewards = () => {
    let rewards = [...this.state.rewards];
    rewards = rewards.filter(r => {
      let title = r.title.toLowerCase();
      return title.indexOf(this.state.search.toLowerCase()) !== -1;
    });

    if (rewards.length > 0) {
      return rewards.map((reward, index) => (
        <RewardRow
          key={index}
          reward={reward}
          onPress={_reward => {
            this.props.navigation.navigate("EditReward", {
              reward: _reward
            });
          }}
        />
      ));
    } else {
      return (
        <View>
          <Text>No rewards added</Text>
        </View>
      );
    }
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.getRewardsFromServer();
    this.setState({ refreshing: false });
  };

  handleSearchInput = value => {
    let search = { ...this.state };
    search = value;
    this.setState({ search });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.subheader}>
          <View style={{ flex: 1 }}>
            <SearchBar
              placeholder="Search rewards"
              onChangeText={this.handleSearchInput}
              value={this.state.search}
            />
          </View>
          <View style={{ flex: 0 }}>
            <PlusButton
              onPress={() => {
                this.handleAddButton(this.props.navigation);
              }}
            />
          </View>
        </View>
        <View style={styles.body}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewInner}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          >
            {this.renderRewards()}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  subheader: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "rgb(245, 243, 251)"
  },
  body: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollViewInner: {
    paddingVertical: 10,
    paddingHorizontal: 30
  }
});
