import React from "react";
import StorageService from "../services/StorageService";
import {
  API_GetRewards,
  API_AddReward,
  API_DeleteReward
} from "../components/Endpoints";
import Stores from "../data-store/StoresStore";

class RewardsStore extends StorageService {
  constructor(storageKey) {
    super(storageKey);
  }

  async getRewardsFromServerAsync() {
    try {
      const storeId = await Stores.getStoreId();

      let rewardsArray = await API_GetRewards(storeId);

      await this.addItemsAsync(rewardsArray);
      console.log("Added to cache (RewardsStore.js): ", rewardsArray);

      return Promise.resolve(rewardsArray);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async addReward(rewardData) {
    try {
      let addedReward = await API_AddReward(rewardData);
      let existingRewards = await this.getItemsAsync();

      let mergedRewards = [addedReward, ...existingRewards];

      await this.addItemsAsync(mergedRewards);

      return Promise.resolve(addedReward);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async editReward(rewardData) {
    try {
      let updatedReward = await API_AddReward(rewardData);
      let existingRewards = await this.getItemsAsync();
      let index = null;

      existingRewards.forEach((currentReward, currentIndex) => {
        if (currentReward.id === updatedReward.id) {
          index = currentIndex;
        }
      });

      existingRewards[index] = updatedReward;

      await this.addItemsAsync(existingRewards);

      return Promise.resolve(updatedReward);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteReward(rewardId) {
    try {
      await API_DeleteReward(rewardId);
      let existingRewards = await this.getItemsAsync();
      let index = null;

      existingRewards.forEach((currentReward, currentIndex) => {
        if (currentReward.id === rewardId) {
          index = currentIndex;
        }
      });

      existingRewards.splice(index, 1);

      console.log("Rewards after deletion: ", existingRewards);

      await this.addItemsAsync(existingRewards);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

const Rewards = new RewardsStore("user_rewards");

export default Rewards;
