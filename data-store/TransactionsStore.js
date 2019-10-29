import React from "react";
import StorageService from "../services/StorageService";
import { API_GetTransactions } from "../components/Endpoints";

class TransactionStore extends StorageService {
  constructor(storageKey) {
    super(storageKey);
  }

  async getTransactionsFromServerAsync() {
    try {
      let transactionsArray = await API_GetTransactions();

      await this.addItemsAsync(transactionsArray);
      console.log("Added to cache (TransactionStore.js): ", transactionsArray);

      return Promise.resolve(transactionsArray);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

const Transaction = new TransactionStore("user_transactions");

export default Transaction;
