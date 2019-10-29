import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  ActivityIndicator
} from "react-native";

import AppTextInput from "../../components/AppTextInput";
import AppPicker from "../../components/AppPicker";
import AppButton from "../../components/AppButton";
import KeyboardShift from "../../components/KeyboardShift";

import Stores from "../../data-store/StoresStore";
import Countries from "../../constants/CountryStateList.json";

import { ImageUploader } from "../../services/UploaderService";

// const CountryState = require("../../constants/CountryStateList.json");

export default class AddStoreScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params ? "Edit Store Details" : "Add Store"
    };
  };

  state = {
    errors: {
      storeName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postalCode: ""
    },
    storeData: {
      storeName: "",
      addressLine1: "",
      addressLine2: "",
      postalCode: "",
      city: "",
      state: "",
      country: "",
      currency: "AUD",
      contact: {
        phoneNumbers: []
      },
      lat: "",
      lon: ""
    },
    statesArray: [],
    image: null,
    imageUploading: false
  };

  async componentDidMount() {
    this.getStoreDetails();
  }

  getStoreDetails = async getFromServer => {
    let { image } = this.state;
    let storeData = { ...this.state.storeData };
    const isEdit = this.props.navigation.getParam("isEdit");

    if (isEdit) {
      let _store;

      if (getFromServer) {
        _store = await Stores.getStoreFromServerAsync();
      } else {
        _store = await Stores.getItemsAsync();
      }

      let location = _store.location;

      let phoneNumber =
        _store.contact.phoneNumbers.length > 0
          ? _store.contact.phoneNumbers[0]
          : null;

      const countryObject = Countries.countries.find(
        countryItem => countryItem.country === location.country
      );

      let statesArray = countryObject.states;

      storeData.storeName = _store.storeName;

      storeData.addressLine1 = location.addressLine1;
      storeData.addressLine2 = location.addressLine2;
      storeData.postalCode = location.postalCode;
      storeData.city = location.city;
      storeData.state = location.state;
      storeData.country = location.country;

      storeData.currency = countryObject.currency;

      if (phoneNumber) {
        storeData.contact.phoneNumbers.push(phoneNumber);
      }

      if (_store.assetsUrl) {
        image = _store.assetsUrl.logo;
      }

      // this.setState({  });
      this.setState({ statesArray, storeData, image });
    } else {
      let statesArray = Countries.countries[0].states;
      this.setState({ statesArray });
    }
  };

  handleLogoPress = () => {
    ImageUploader.upload({
      onStart: () => this.setState({ imageUploading: true }),
      onError: () => this.setState({ imageUploading: false }),
      onComplete: async () => {
        await this.getStoreDetails(true);
        this.setState({ imageUploading: false });
      }
    });
  };

  handleSubmit = async () => {
    if (!this._validate()) return;

    let storeData = { ...this.state.storeData };
    const isEdit = this.props.navigation.getParam("isEdit");

    try {
      if (isEdit) {
        await Stores.editStore(storeData);
      } else {
        await Stores.addStore(storeData);
      }

      this.props.navigation.navigate("Dashboard");
    } catch (error) {
      console.log("Store creation error", error);

      // #TODO Handle signup errors

      if (error.status) {
        let m =
          "Status: " +
          error.status +
          "\n" +
          "Message: " +
          (error.message || error.statusText);
        ToastAndroid.show(m, ToastAndroid.LONG);
      }
    }
  };

  handleTextInput = (value, prop) => {
    let storeData = { ...this.state.storeData };
    storeData[prop] = value;
    this.setState({ storeData });
  };

  handleCountryChange = value => {
    let storeData = { ...this.state.storeData };
    storeData.country = value;

    const countryObject = Countries.countries.find(
      countryItem => countryItem.country === value
    );

    let statesArray = countryObject.states;
    storeData.currency = countryObject.currency;

    this.setState({ storeData, statesArray });
  };

  handleStateChange = value => {
    let storeData = { ...this.state.storeData };
    storeData.state = value;
    this.setState({ storeData });
  };

  handlePhoneNumberInput = value => {
    let storeData = { ...this.state.storeData };

    if (storeData.contact.phoneNumbers.length > 0) {
      storeData.contact.phoneNumbers = [];
    }

    storeData.contact.phoneNumbers.push(value);

    this.setState({ storeData });
  };

  handleCancel = () => {
    this.props.navigation.goBack();
  };

  _validate = () => {
    isValid = true;

    const { storeData, errors } = this.state;

    if (storeData.storeName === "") {
      errors.storeName = "Store name cannot be empty";
      isValid = false;
    }

    if (storeData.storeName.length > 100) {
      errors.storeName = "Should be within 100 characters";
      isValid = false;
    }

    if (storeData.addressLine1 === "") {
      errors.addressLine1 = "Address cannot be empty";
      isValid = false;
    }

    if (storeData.addressLine1.length > 255) {
      errors.addressLine1 = "Should be within 255 characters";
      isValid = false;
    }

    if (storeData.addressLine2.length > 255) {
      errors.addressLine2 = "Should be within 255 characters";
      isValid = false;
    }

    if (storeData.city === "") {
      errors.city = "City cannot be empty";
      isValid = false;
    }

    if (storeData.city.length > 100) {
      errors.city = "Should be within 100 characters";
      isValid = false;
    }

    if (storeData.postalCode === "") {
      errors.postalCode = "Postal code cannot be empty";
      isValid = false;
    }

    if (storeData.postalCode.length > 10) {
      errors.postalCode = "Should be within 10 characters";
      isValid = false;
    }

    if (isValid) {
      errors.storeName = "";
      errors.addressLine1 = "";
      errors.addressLine2 = "";
      errors.city = "";
      errors.postalCode = "";
    }

    this.setState({ errors });

    return isValid;
  };

  getLogo = () => {
    const { image } = this.state;

    if (image) {
      return { uri: image };
    } else {
      return require("../../assets/images/icons/store.png");
    }
  };

  render() {
    const { storeData, statesArray, imageUploading, errors } = this.state;

    let phoneNumber =
      storeData.contact.phoneNumbers.length > 0
        ? storeData.contact.phoneNumbers[0]
        : "";

    const isEdit = this.props.navigation.getParam("isEdit");

    return (
      <KeyboardShift>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <ScrollView>
            {isEdit && (
              <View style={styles.subheader}>
                <View style={styles.logoFrame}>
                  <Image style={styles.logoImage} source={this.getLogo()} />
                </View>
                <TouchableOpacity
                  onPress={this.handleLogoPress}
                  style={styles.logoButton}
                >
                  <Text>Tap to change logo</Text>
                </TouchableOpacity>
                {imageUploading && (
                  <View style={styles.logoLoading}>
                    <ActivityIndicator
                      size="small"
                      color="#fff"
                      style={{ position: "relative" }}
                    ></ActivityIndicator>
                  </View>
                )}
              </View>
            )}
            <View style={styles.body}>
              <AppTextInput
                onChangeText={value => {
                  this.handleTextInput(value, "storeName");
                }}
                value={storeData.storeName}
                error={errors.storeName}
                label="Store name"
              />
              <AppTextInput
                onChangeText={value => {
                  this.handleTextInput(value, "addressLine1");
                }}
                value={storeData.addressLine1}
                error={errors.addressLine1}
                label="Address line 1"
              />
              <AppTextInput
                onChangeText={value => {
                  this.handleTextInput(value, "addressLine2");
                }}
                value={storeData.addressLine2}
                error={errors.addressLine2}
                label="Address line 2"
              />
              <AppPicker
                label="Country"
                dataArray={Countries.countries}
                labelKey="country"
                valueKey="country"
                onValueChange={this.handleCountryChange}
                selectedValue={storeData.country}
              ></AppPicker>
              <AppPicker
                label="State"
                dataArray={statesArray}
                onValueChange={this.handleStateChange}
                selectedValue={storeData.state}
              ></AppPicker>
              <AppTextInput
                onChangeText={value => {
                  this.handleTextInput(value, "city");
                }}
                value={storeData.city}
                error={errors.city}
                label="City"
              />
              <AppTextInput
                onChangeText={value => {
                  this.handleTextInput(value, "postalCode");
                }}
                value={storeData.postalCode}
                error={errors.postalCode}
                label="Postal code"
                keyboardType="number-pad"
              />
              <AppTextInput
                onChangeText={value => {
                  this.handlePhoneNumberInput(value, "phoneNumber");
                }}
                value={phoneNumber}
                label="Phone Number"
                keyboardType="phone-pad"
              />
            </View>
          </ScrollView>
          <View style={styles.buttonBox}>
            <AppButton
              title={isEdit ? "Update" : "Add"}
              onPress={this.handleSubmit}
            />
            <View style={styles.gutter} />
            <AppButton
              title={isEdit ? "Cancel" : "Clear"}
              color="rgb(244, 57, 56)"
              onPress={() => {
                if (isEdit) {
                  this.handleCancel();
                }
              }}
            />
          </View>
        </View>
      </KeyboardShift>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  body: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 20
  },
  subheader: {
    flexDirection: "column",
    backgroundColor: "rgb(245, 243, 251)",
    alignItems: "center"
  },
  logoFrame: {
    overflow: "hidden",
    borderRadius: 20,
    marginTop: 20
  },
  logoImage: {
    width: 160,
    height: 160
  },
  logoLoading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  logoButton: {
    marginVertical: 20
  },
  buttonBox: {
    flexDirection: "row",
    width: "100%",
    padding: 20
  },
  gutter: {
    width: 10,
    flex: 0
  }
});
