import React from "react";
import { AsyncStorage } from "react-native";

export default class StorageService {
  _storeKey = null;

  constructor(storeKey) {
    this._storeKey = storeKey;
  }

  async addItemsAsync(items) {
    const data = JSON.stringify(items);
    const addedData = await AsyncStorage.setItem(this._storeKey, data);
    return addedData;
  }

  async getItemsAsync() {
    let items = await AsyncStorage.getItem(this._storeKey);
    return JSON.parse(items);
  }

  async getItemAsync(id) {
    const items = await this.getItemsAsync();
    let foundItems = items.filter(item => parseInt(item.id) === parseInt(id));

    if (foundItems.length > 0) {
      return foundItems[0];
    } else {
      return null;
    }
  }

  async updateItemAsync(data) {
    let items = await this.getItemsAsync();
    let foundIndex = null;

    items.forEach((item, index) => {
      if (parseInt(item.id) === parseInt(data.id)) {
        foundIndex = index;
      }
    });

    if (typeof foundIndex === "number") {
      items[foundIndex] = data;
    } else {
      items.push(data);
    }

    await this.addItemsAsync(items);

    return data;
  }
}
