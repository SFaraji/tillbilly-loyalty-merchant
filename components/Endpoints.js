import React from "react";
import API from "../constants/Config";
import SessionService from "../services/SessionService";

const commonHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

const getAuthHeaders = () => {
  return {
    Authorization: SessionService.authToken,
    ...commonHeaders
  };
};

// const userToken = await AsyncStorage.getItem("authToken");

export const API_Login = async (email, password) => {
  try {
    let response = await fetch(API.apiBase + "/merchants/authenticate", {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({
        emailAddress: email,
        password: password
      })
    });

    let responseJson = await response.json();

    console.log("Login call complete: ", responseJson);

    if (response.status && response.status >= 200 && response.status < 300) {
      console.log("Proceeding for session creation");
      await SessionService.create(responseJson);
      return Promise.resolve(responseJson);
    }

    return Promise.reject(responseJson || response);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const API_Signup = async (email, password) => {
  try {
    let response = await fetch(API.apiBase + "/merchants", {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify({
        emailAddress: email,
        password: password
      })
    });

    let responseJson = await response.json();

    if (response.status && response.status >= 200 && response.status < 300) {
      await SessionService.create(responseJson);
      return Promise.resolve(responseJson);
    }

    return Promise.reject(responseJson || response);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const API_GetStores = async () => {
  try {
    let response = await fetch(API.apiBase + "/stores?expand=location", {
      method: "GET",
      headers: getAuthHeaders()
    });

    let storesArray = await response.json();

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve(storesArray);
    }

    return Promise.reject(storesArray || response);
  } catch (error) {
    console.log("Endpoint.js error (get stores): ", error);
    return Promise.reject(error);
  }
};

export const API_CreateStore = async postData => {
  try {
    let response = await fetch(API.apiBase + "/stores?expand=location", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    });

    let responseJson = await response.json();

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve(responseJson);
    }

    return Promise.reject(responseJson || response);
  } catch (error) {
    console.log("Endpoint.js error (create store): ", error);
    return Promise.reject(error);
  }
};

export const API_EditStore = async (postData, storeId) => {
  try {
    let response = await fetch(
      API.apiBase + "/stores/" + storeId + "?expand=location",
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(postData)
      }
    );

    console.log("Store update post data: ", postData);
    console.log("Store update call: ", response);

    let responseJson = await response.json();
    console.log("Store update response: ", responseJson);

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve(responseJson);
    }

    return Promise.reject(responseJson || response);
  } catch (error) {
    console.log("Endpoint.js error (create store): ", error);
    return Promise.reject(error);
  }
};

export const API_GetProducts = async storeId => {
  const path =
    API.apiBase +
    "/products?" +
    serializeQuery({
      storeId: storeId
    });

  try {
    let response = await fetch(path, {
      method: "GET",
      headers: getAuthHeaders()
    });

    let responseJson = await response.json();

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve(responseJson);
    }

    return Promise.reject(responseJson || response);
  } catch (error) {
    console.log("Endpoint.js error (get products): ", error);
    return Promise.reject(error);
  }
};

export const API_AddProduct = async postData => {
  let path = API.apiBase + "/products";

  if (postData.id) path += "/" + postData.id;

  try {
    let response = await fetch(path, {
      method: postData.id ? "PUT" : "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    });

    let responseJson = await response.json();

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve(responseJson);
    }

    return Promise.reject(responseJson || response);
  } catch (error) {
    console.log("Endpoint.js error (add product): ", error);
    return Promise.reject(error);
  }
};

export const API_DeleteProduct = async productId => {
  let path = API.apiBase + "/products/" + productId;

  try {
    let response = await fetch(path, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    // let responseJson = await response.json();

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve();
    }

    return Promise.reject(response);
  } catch (error) {
    console.log("Endpoint.js error (delete product): ", error);
    return Promise.reject(error);
  }
};

export const API_GetRewards = async storeId => {
  console.log("Starting fetch request with: ", storeId);

  const path =
    API.apiBase +
    "/rewards?" +
    serializeQuery({
      storeId: storeId
    });

  try {
    let response = await fetch(path, {
      method: "GET",
      headers: getAuthHeaders()
    });

    console.log("Fetch Obj: ", response);

    let responseJson = await response.json();
    console.log("Fetch response: ", responseJson);

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve(responseJson);
    }

    return Promise.reject(responseJson || response);
  } catch (error) {
    console.log("Endpoint.js error (get rewards): ", error);
    return Promise.reject(error);
  }
};

export const API_AddReward = async postData => {
  let path = API.apiBase + "/rewards";

  if (postData.id) path += "/" + postData.id;

  try {
    let response = await fetch(path, {
      method: postData.id ? "PUT" : "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    });

    let responseJson = await response.json();

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve(responseJson);
    }

    return Promise.reject(responseJson || response);
  } catch (error) {
    console.log("Endpoint.js error (add reward): ", error);
    return Promise.reject(error);
  }
};

export const API_DeleteReward = async rewardId => {
  let path = API.apiBase + "/rewards/" + rewardId;

  try {
    let response = await fetch(path, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    // let responseJson = await response.json();

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve();
    }

    return Promise.reject(response);
  } catch (error) {
    console.log("Endpoint.js error (delete reward): ", error);
    return Promise.reject(error);
  }
};

export const API_GetTransactions = async searchQuery => {
  const path =
    API.apiBase + "/loyalties?per-page=50&" + serializeQuery(searchQuery);

  try {
    let response = await fetch(path, {
      method: "GET",
      headers: getAuthHeaders()
    });

    console.log("Fetch Obj: ", response);

    let responseJson = await response.json();
    console.log("Fetch response: ", responseJson);

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve(responseJson);
    }

    return Promise.reject(responseJson || response);
  } catch (error) {
    console.log("Endpoint.js error (get transactions): ", error);
    return Promise.reject(error);
  }
};

export const API_CreateLoyaltyTx = async postData => {
  let path = API.apiBase + "/loyalties";

  try {
    let response = await fetch(path, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    });

    // let responseJson = await response.json();

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve();
    }

    return Promise.reject(response);
  } catch (error) {
    console.log("Endpoint.js error (create transaction): ", error);
    return Promise.reject(error);
  }
};

export const API_GetCustomers = async searchQuery => {
  const path = API.apiBase + "/customers?" + serializeQuery(searchQuery);

  try {
    let response = await fetch(path, {
      method: "GET",
      headers: getAuthHeaders()
    });

    console.log("Fetch Obj: ", response);

    let responseJson = await response.json();
    console.log("Fetch response: ", responseJson);

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve(responseJson);
    }

    return Promise.reject(responseJson || response);
  } catch (error) {
    console.log("Endpoint.js error (get rewards): ", error);
    return Promise.reject(error);
  }
};

export const API_CreateAsset = async (type = "jpeg", storeId) => {
  const path = API.apiBase + "/assets";
  let mime = "image/";

  if (type === "png") {
    mime += "png";
  } else if (type === "jpeg" || type === "jpg") {
    mime += "jpeg";
  }

  const body = JSON.stringify({
    mime: mime,
    fileType: "logo",
    storeId: storeId
  });

  console.log("Body", body);

  try {
    let response = await fetch(path, {
      method: "POST",
      headers: getAuthHeaders(),
      body: body
    });

    let responseJson = await response.json();

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve(responseJson);
    }

    return Promise.reject(responseJson || response);
  } catch (error) {
    console.log("Endpoint.js error (create asset): ", error);
    return Promise.reject(error);
  }
};

export const API_UpdateAsset = async id => {
  let path = API.apiBase + "/assets/" + id;

  try {
    let response = await fetch(path, {
      method: "PUT",
      headers: getAuthHeaders()
    });

    let responseJson = await response.json();

    if (response.status && response.status >= 200 && response.status < 300) {
      return Promise.resolve(responseJson);
    }

    return Promise.reject(responseJson || response);
  } catch (error) {
    console.log("Endpoint.js error (update asset): ", error);
    return Promise.reject(error);
  }
};

const serializeQuery = queryObject => {
  var paramArray = [],
    queryString = "";

  for (var p in queryObject) {
    if (queryObject.hasOwnProperty(p)) {
      paramArray.push(
        encodeURIComponent(p) + "=" + encodeURIComponent(queryObject[p])
      );
    }
  }

  queryString = paramArray.join("&");

  return queryString;
};
