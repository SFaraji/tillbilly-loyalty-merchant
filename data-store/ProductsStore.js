import React from "react";
import StorageService from "../services/StorageService";
import {
  API_GetProducts,
  API_AddProduct,
  API_DeleteProduct
} from "../components/Endpoints";
import Stores from "../data-store/StoresStore";

class ProductsStore extends StorageService {
  constructor(storageKey) {
    super(storageKey);
  }

  async getProductsFromServerAsync() {
    try {
      const storeId = await Stores.getStoreId();

      let productsArray = await API_GetProducts(storeId);

      await this.addItemsAsync(productsArray);
      console.log("Added to cache (ProductStore.js): ", productsArray);

      return Promise.resolve(productsArray);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async addProduct(productData) {
    try {
      let addedProduct = await API_AddProduct(productData);
      let existingProducts = await this.getItemsAsync();

      let mergedProducts = [addedProduct, ...existingProducts];

      await this.addItemsAsync(mergedProducts);

      return Promise.resolve(addedProduct);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async editProduct(productData) {
    try {
      let updatedProduct = await API_AddProduct(productData);
      let existingProducts = await this.getItemsAsync();
      let index = null;

      existingProducts.forEach((currentProduct, currentIndex) => {
        if (currentProduct.id === updatedProduct.id) {
          index = currentIndex;
        }
      });

      existingProducts[index] = updatedProduct;

      await this.addItemsAsync(existingProducts);

      return Promise.resolve(updatedProduct);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteProduct(productId) {
    try {
      await API_DeleteProduct(productId);
      let existingProducts = await this.getItemsAsync();
      let index = null;

      existingProducts.forEach((currentProduct, currentIndex) => {
        if (currentProduct.id === productId) {
          index = currentIndex;
        }
      });

      existingProducts.splice(index, 1);

      console.log("Products after deletion: ", existingProducts);

      await this.addItemsAsync(existingProducts);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

const Products = new ProductsStore("user_products");

export default Products;
