import React from "react";
import StorageService from "../services/StorageService";
import {
  API_GetStores,
  API_CreateStore,
  API_EditStore
} from "../components/Endpoints";

class StoresStore extends StorageService {
  constructor(storeKey) {
    super(storeKey);
  }

  async getStoreFromServerAsync() {
    try {
      let storesArray = await API_GetStores();

      if (storesArray.length > 0) {
        let store = storesArray[0];
        await this.addItemsAsync(store);
        return Promise.resolve(store);
      } else {
        return Promise.resolve(storesArray);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async addStore(storeData) {
    try {
      let store = await API_CreateStore(storeData);

      await this.addItemsAsync(store);

      return Promise.resolve(store);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async editStore(storeData) {
    try {
      const storeId = await this.getStoreId();
      let store = await API_EditStore(storeData, storeId);

      await this.addItemsAsync(store);

      return Promise.resolve(store);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getStoreId() {
    try {
      let store = await this.getItemsAsync();
      return Promise.resolve(store.id);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

const Stores = new StoresStore("user_stores");

export default Stores;
