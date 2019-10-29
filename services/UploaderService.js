import { Alert } from "react-native";

import { API_CreateAsset, API_UpdateAsset } from "../components/Endpoints";
import Stores from "../data-store/StoresStore";

import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

async function openImagePicker(options) {
  const hasPermission = await getPermissionAsync();

  if (!hasPermission) return;

  const _options = options || {};

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1]
  });

  if (!result.cancelled) {
    const uriParts = result.uri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    if (fileType === "jpeg" || fileType === "jpg" || fileType === "png") {
      if (_options.onStart) _options.onStart();
      createAsset.call(_options, result.uri, fileType);
    } else {
      Alert.alert(
        "Invalid image format",
        "Please select a jpg or a png image."
      );
      return;
    }
  }
}

async function createAsset(uri, fileType) {
  const file = {
    uri: uri,
    type: "image/" + (fileType === "jpg" ? "jpeg" : fileType),
    name: "image." + fileType
  };

  let storeId = await Stores.getStoreId();
  console.log("Store id", storeId);

  try {
    let asset = await API_CreateAsset(fileType, storeId);
    console.log("asset", asset);
    uploadAsset.call(this, file, asset.preSignedUrl, asset.id);
  } catch (e) {
    console.log("Failed", e);
    if (this.onError) this.onError(e);
  }
}

function uploadAsset(file, preSignedUrl, assetId) {
  const _this = this;
  const xhr = new XMLHttpRequest();

  xhr.open("PUT", preSignedUrl);
  xhr.setRequestHeader("Content-Type", file.type);

  xhr.onreadystatechange = function() {
    console.log("Req", xhr);
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        updateAsset.call(_this, assetId);
      } else {
        console.log("Could not upload file.");
        if (_this.onError) _this.onError();
        _;
      }
    }
  };

  xhr.send(file);
}

async function updateAsset(assetId) {
  console.log("Asset id", assetId);

  try {
    let update = await API_UpdateAsset(assetId);
    console.log("Update", update);
    if (this.onComplete) this.onComplete();
  } catch (e) {
    console.log("Failed", e);
    if (this.onError) this.onError(e);
  }
}

getPermissionAsync = async () => {
  if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

export const ImageUploader = {
  upload: openImagePicker
};
