import React from "react";
import StorageService from "../services/StorageService";
import { API_GetCustomers } from "../components/Endpoints";
import Stores from "../data-store/StoresStore";

class CustomerStore extends StorageService {
  constructor(storageKey) {
    super(storageKey);
  }

  async getCustomerFromServerAsync(searchQuery) {
    try {
      let customersArray = await API_GetCustomers(searchQuery);

      // customersArray.forEach(async customer => {
      //   await this.updateItemAsync(customer);
      // });

      // console.log("Added to cache (CustomerStore.js): ", customersArray);

      return Promise.resolve(customersArray);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getCustomer(id) {
    const customer = await this.getItemAsync(id);
  }
}

const Customers = new CustomerStore("user_customers");

export default Customers;
