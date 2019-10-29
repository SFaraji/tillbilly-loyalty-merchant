import React from "react";
import { AsyncStorage } from "react-native";

const storageKeys = {
  auth: "authObject"
};

const state = {
  initialized: false,
  exists: false,
  authToken: null,
  userId: null,
  firstName: "",
  lastName: "",
  activated: null
};

const create = async sessionObject => {
  await AsyncStorage.setItem(storageKeys.auth, JSON.stringify(sessionObject));
  console.log("Session created");
  await initialize();
};

const destroy = async () => {
  return await AsyncStorage.clear();
};

const initialize = async () => {
  const authObject = await AsyncStorage.getItem(storageKeys.auth);

  state.initialized = true;

  if (authObject) {
    const authObjectJSON = JSON.parse(authObject);

    state.exists = true;
    state.authToken = "Bearer " + authObjectJSON.authToken;
    state.activated = authObjectJSON.activationStatus;
    state.userId = authObjectJSON.id;

    return state;
  } else {
    return false;
  }
};

const SessionService = {
  initialize: initialize,
  create: create,
  destroy: destroy
};

Object.defineProperty(SessionService, "authToken", {
  get: function() {
    return state.authToken;
  }
});

Object.defineProperty(SessionService, "userId", {
  get: function() {
    return state.userId;
  }
});

Object.defineProperty(SessionService, "exists", {
  get: function() {
    return state.exists;
  }
});

Object.defineProperty(SessionService, "activationStatus", {
  get: function() {
    return state.activated;
  }
});

export default SessionService;
