import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid
} from "react-native";

import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import CounterBox from "../components/CounterBox";
import KeyboardShift from "../components/KeyboardShift";

import Products from "../data-store/ProductsStore";
import Store from "../data-store/StoresStore";
import IconStore from "../data-store/IconStore";

export default class EditProductScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? "Edit Product" : "Add Product"
    };
  };

  state = {
    productData: {
      icon: "",
      name: "",
      unitPrice: "",
      // currency: "AUD",
      pointsPerUnit: 1,
      storeId: ""
    },
    currency: ""
  };

  async componentDidMount() {
    let productData = { ...this.state.productData };
    productData.storeId = await Store.getStoreId();

    const _store = await Store.getItemsAsync();
    const currency = _store.currency;

    const product = this.props.navigation.getParam("product");

    if (product) {
      productData = { ...product };
      productData.unitPrice = this.getPrice(product.unitPrice);
    }

    this.setState({ productData, currency });
  }

  updateIcon = args => {
    let productData = { ...this.state.productData };
    productData.icon = "" + args + "";
    this.setState({ productData });
  };

  handleAddIconButton = () => {
    this.props.navigation.navigate("SelectProductIcon", {
      onSelect: this.updateIcon
    });
  };

  handleTextInput = (value, prop) => {
    let productData = { ...this.state.productData };

    if (prop === "unitPrice") {
      productData[prop] = this.getPrice(value);
    } else {
      productData[prop] = value;
    }

    this.setState({ productData });
  };

  getPrice = value => {
    let price = value.replace(/(\d+\.\d\d)(.+)/, "$1");
    return price;
  };

  handleSubmit = async () => {
    let productData = { ...this.state.productData };

    try {
      if (productData.id) {
        await Products.editProduct(productData);
      } else {
        await Products.addProduct(productData);
      }

      this.props.navigation.goBack();
    } catch (error) {
      console.log("Product creation error: ", error);

      // #TODO Handle creation errors

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

  handleClear = () => {
    //
  };

  handleUpdate = () => {
    this.props.navigation.navigate("ConfirmationModal", {
      message:
        "This may impact your existing customers. Do you still wish to continue?",
      onConfirm: this.handleSubmit
    });
  };

  handleDelete = () => {
    this.props.navigation.navigate("ConfirmationModal", {
      message:
        "Are you sure you want to delete this product: " +
        this.state.productData.name +
        "?",
      onConfirm: this.handleConfirmDelete
    });
  };

  handleConfirmDelete = async () => {
    try {
      await Products.deleteProduct(this.state.productData.id);
      this.props.navigation.goBack();
    } catch (error) {
      console.log("Product deletion error: ", error);

      // #TODO Handle creation errors

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

  render() {
    const { productData, currency } = this.state;
    const isEdit = this.props.navigation.getParam("product") ? true : false;

    return (
      <KeyboardShift>
        <ScrollView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.subheader}>
            {IconStore.getIcon(productData.icon, styles.iconImage)}
            <TouchableOpacity onPress={this.handleAddIconButton}>
              <Text>Tap to select icon</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <AppTextInput
              label="Product name"
              value={productData.name}
              onChangeText={value => {
                this.handleTextInput(value, "name");
              }}
            />
            <CounterBox
              label="Points per unit"
              minValue={1}
              value={productData.pointsPerUnit}
              onUpdate={value => {
                this.handleTextInput(value, "pointsPerUnit");
              }}
            />
            <AppTextInput
              label={`Unit Price (${currency})`}
              value={productData.unitPrice}
              keyboardType="number-pad"
              onChangeText={value => {
                this.handleTextInput(value, "unitPrice");
              }}
            />
            <View style={styles.buttonBox}>
              <AppButton
                title={isEdit ? "Update" : "Add"}
                onPress={() => {
                  if (isEdit) {
                    this.handleUpdate();
                  } else {
                    this.handleSubmit();
                  }
                }}
              />
              <View style={styles.gutter} />
              <AppButton
                title={isEdit ? "Delete" : "Clear"}
                color="rgb(244, 57, 56)"
                onPress={() => {
                  if (isEdit) {
                    this.handleDelete();
                  } else {
                    this.handleClear();
                  }
                }}
              />
            </View>
          </View>
        </ScrollView>
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
    padding: 20,
    backgroundColor: "rgb(245, 243, 251)",
    alignItems: "center"
  },
  iconImage: {
    width: 160,
    height: 160,
    marginBottom: 15
  },
  addButton: {
    borderBottomColor: "rgb(244, 57, 56)",
    borderBottomWidth: 0.25,
    padding: 10,
    backgroundColor: "rgb(11,17,35)",
    borderRadius: 15,
    overflow: "hidden",
    marginLeft: 15
  },
  addButtonText: {
    width: 30,
    height: 30,
    fontSize: 30,
    color: "#fff",
    textAlign: "center"
  },
  buttonBox: {
    flexDirection: "row",
    width: "100%"
  },
  gutter: {
    width: 10,
    flex: 0
  }
});
