import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableHighlight,
  ToastAndroid
} from "react-native";

import AppButton from "../components/AppButton";
import KeyboardShift from "../components/KeyboardShift";

import Products from "../data-store/ProductsStore";
import Customers from "../data-store/CustomerStore";
import Stores from "../data-store/StoresStore";
import IconStore from "../data-store/IconStore";

import { API_CreateLoyaltyTx } from "../components/Endpoints";

const numColumns = 3;
const gutterSize = 10;

const ProductTapTile = props => {
  const { product } = props;

  return (
    <TouchableHighlight
      onPress={() => {
        props.onPress(product);
      }}
      style={[styles.productTapTile, props.style]}
    >
      <View style={styles.productTapTileView}>
        <View style={styles.productTapTileIconView}>
          {IconStore.getIcon(product.icon, styles.productTapTileIcon, true)}
        </View>
        <View style={styles.tapTileTextBox}>
          <Text style={{ color: "#fff", fontSize: 10, textAlign: "center" }}>
            {product.name}
          </Text>
          <Text style={{ color: "#fff", fontSize: 9, textAlign: "center" }}>
            {product.pointsPerUnit + " pts"}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const RewardTapTile = props => {
  const { product, count } = props.productData;

  return (
    <TouchableHighlight
      onPress={() => {
        props.onPress(product);
      }}
      underlayColor="rgb(245, 243, 251)"
      activeOpacity={0.95}
    >
      <View style={styles.rewardTapTileView}>
        {IconStore.getIcon(product.icon, styles.rewardTapTileImage, true)}
        {/* <Text style={{ color: "#fff" }}>{product.name}</Text> */}
        <View style={styles.rewardTapTileBadge}>
          <Text style={styles.rewardTapTileBadgeText}>{count}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const getLastVisitString = date => {
  var _date = new Date(date);
  var today = new Date();
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (_date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (_date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return _date.toLocaleDateString();
  }
};

export default class RewardScreen extends React.Component {
  static navigationOptions = () => {
    return {
      title: "Reward"
    };
  };

  state = {
    products: [],
    addedProducts: [],
    points: 0,
    dimensions: undefined,
    scanData: null,
    customerData: null,
    storeInStorage: null,
    customer: null
  };

  async componentDidMount() {
    const products = await Products.getItemsAsync();

    let scanData = this.props.navigation.getParam("scanData") || null;
    let customer = this.props.navigation.getParam("customer") || null;

    const storeInStorage = await Stores.getItemsAsync();
    this.setState({ storeInStorage: storeInStorage });

    if (products === null) {
      this.getProductsFromServer();
    } else {
      this.setState({ products: products });
    }

    if (scanData) {
      scanData = scanData.replace("tbloyalty://", "");
      scanData = JSON.parse(scanData);

      this.setState({ scanData: scanData });

      await this.getCustomerFromServer();
    } else if (customer) {
      this.setState({ customer: customer });
    }
  }

  getProductsFromServer = async () => {
    const products = await Products.getProductsFromServerAsync();
    this.setState({ products: products });
  };

  getCustomerFromServer = async () => {
    try {
      const customerData = await Customers.getCustomerFromServerAsync({
        qrId: this.state.scanData.qrId
      });

      if (customerData.length > 0) {
        this.setState({ customer: customerData[0] });
      }
    } catch (error) {
      console.log(error);
    }
  };

  renderProducts = () => {
    if (!this.state.dimensions) {
      return (
        <View>
          <Text>Loading Products</Text>
        </View>
      );
    }

    const { products } = this.state;

    const { width, height } = this.state.dimensions;
    const tileWidth = (width - gutterSize * (numColumns + 1)) / numColumns;
    const tileHeight = (height - gutterSize * (numColumns + 1)) / numColumns;
    const tileSize = tileHeight > tileWidth ? tileWidth : tileHeight;

    const newGutterX = (width - tileSize * numColumns) / (numColumns + 1);
    const newGutterY = (height - tileSize * numColumns) / (numColumns + 1);

    let rowCounter = -1;
    let pageCounter = -1;

    const topFn = index => {
      if (index % numColumns === 0) {
        rowCounter++;
      }

      if (index % (numColumns * numColumns) === 0) {
        pageCounter++;
      }

      return newGutterY + (newGutterY + tileSize) * (rowCounter % numColumns);
    };

    const leftFn = index => {
      return (
        width * pageCounter +
        (newGutterX + (index % numColumns) * (tileSize + newGutterX))
      );
    };

    const tiles = products.map((product, index) => {
      return (
        <ProductTapTile
          key={index}
          product={product}
          onPress={this.handleAddProduct}
          style={{
            width: tileSize,
            height: tileSize,
            top: topFn(index),
            left: leftFn(index)
          }}
        />
      );
    });

    let pages = [];

    for (let i = 0; i <= pageCounter; i++) {
      pages.push(
        <View
          key={i}
          style={[
            styles.productPage,
            {
              width: width
            }
          ]}
        />
      );
    }

    return [pages, tiles];
  };

  renderAddedProducts = () => {
    let addedProducts = [...this.state.addedProducts];
    let mergedProducts = [];

    addedProducts.forEach(product => {
      let found = mergedProducts.find(mProduct => mProduct.id === product.id);

      if (found) {
        const index = mergedProducts.indexOf(found);
        mergedProducts[index].count++;
      } else {
        mergedProducts.push({
          id: product.id,
          product: product,
          count: 1
        });
      }
    });

    if (mergedProducts.length === 0) {
      return (
        <View>
          <Text>Add reward points by tapping products above</Text>
        </View>
      );
    } else {
      const renderedProducts = mergedProducts.map((productData, index) => {
        return (
          <RewardTapTile
            key={index}
            productData={productData}
            onPress={this.handleRemove}
          />
        );
      });

      const removeHelperText = (
        <Text key={"remove-helper-text"} style={styles.removeHelperText}>
          Tap to remove
        </Text>
      );

      return [renderedProducts, removeHelperText];
    }
  };

  renderInfoHeader = () => {
    let name = "Loading";
    let totalVisits = "Loading";
    let lastVisit = "Loading";
    let assetsUrl = null;

    const { customer } = this.state;

    if (!customer) {
      name = "New Customer";
      totalVisits = 0;
      lastVisit = "Today";
    } else {
      name = customer.displayName;
      totalVisits = customer.totalVisits;
      lastVisit = getLastVisitString(customer.lastVisitedAt);
      assetsUrl = customer.assetsUrl;
    }

    return (
      <View style={styles.infoHeader}>
        <View style={styles.customerImage}>
          <Image
            style={styles.customerImageTag}
            source={this.getAvatar(assetsUrl)}
          />
        </View>
        <View style={styles.customerDetails}>
          <Text style={{ fontSize: 20 }}>{name}</Text>
          <Text style={{ fontSize: 16, marginTop: 5 }}>
            Total Visits: {totalVisits}
          </Text>
          <Text style={{ fontSize: 16, marginTop: 5 }}>
            Last Visit: {lastVisit}
          </Text>
        </View>
      </View>
    );
  };

  getAvatar = assetsUrl => {
    if (assetsUrl) {
      const { avatar } = assetsUrl;

      if (avatar) {
        return { uri: avatar };
      } else {
        return require("../assets/images/temp-avatar.png");
      }
    }

    return require("../assets/images/temp-avatar.png");
  };

  handleAddProduct = product => {
    let addedProducts = [...this.state.addedProducts];
    addedProducts.push(product);

    let points = 0;

    addedProducts.forEach(p => {
      points += p.pointsPerUnit;
    });

    this.setState({
      addedProducts,
      points
    });
  };

  handleRemove = product => {
    let addedProducts = [...this.state.addedProducts];
    const result = addedProducts.find(p => p.id === product.id);
    const index = addedProducts.indexOf(result);

    addedProducts.splice(index, 1);

    let points = 0;

    addedProducts.forEach(p => {
      points += p.pointsPerUnit;
    });

    this.setState({
      addedProducts,
      points
    });
  };

  onLayout = event => {
    let { width, height } = event.nativeEvent.layout;
    this.setState({ dimensions: { width, height } });
  };

  handleCancel = () => {
    this.props.navigation.navigate("Dashboard");
  };

  handleSubmit = async () => {
    const { customerData, storeInStorage } = this.state;
    let addedProducts = [...this.state.addedProducts];
    let mergedProducts = [];

    addedProducts.forEach(product => {
      let found = mergedProducts.find(
        mProduct => mProduct.productId === product.id
      );

      if (found) {
        const index = mergedProducts.indexOf(found);
        mergedProducts[index].quantity++;
      } else {
        mergedProducts.push({
          productId: product.id,
          quantity: 1
        });
      }
    });

    try {
      let req = await API_CreateLoyaltyTx({
        qrId: customerData[0].qrId,
        storeId: storeInStorage.id,
        lineItems: mergedProducts
      });

      console.log("Req: ", req);

      ToastAndroid.show(
        "Awarded " + this.state.points + " points to customer.",
        ToastAndroid.LONG
      );

      this.props.navigation.navigate("Dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { points } = this.state;

    return (
      <KeyboardShift>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          {this.renderInfoHeader()}
          <View style={styles.productView} onLayout={this.onLayout}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={styles.productViewContainer}
              pagingEnabled={true}
            >
              {this.renderProducts()}
            </ScrollView>
          </View>
          <View style={styles.rewardView}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={styles.rewardViewContainer}
            >
              {this.renderAddedProducts()}
            </ScrollView>
          </View>
          <View style={styles.buttonBox}>
            <AppButton
              title={points !== 0 ? "Reward " + points + " pts" : "Reward"}
              onPress={this.handleSubmit}
              disabled={points === 0 ? true : false}
            />
            <View style={styles.gutter} />
            <AppButton
              title="Cancel"
              color="rgb(244, 57, 56)"
              onPress={this.handleCancel}
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
  infoHeader: {
    flex: 0,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: "rgb(245, 243, 251)",
    flexDirection: "row"
  },
  customerImage: {
    marginRight: 20,
    justifyContent: "center"
  },
  customerImageTag: {
    width: 80,
    height: 80,
    borderRadius: 100
  },
  customerDetails: {
    flex: 1
  },
  productView: {
    flex: 1
  },
  productViewContainer: {
    // flex: 1,
    flexGrow: 1
  },
  productPage: {
    height: "100%"
  },
  /**
   * Product tile
   */
  productTapTile: {
    position: "absolute",
    backgroundColor: "rgb(0, 0, 0)",
    borderRadius: 15,
    padding: 5
  },
  productTapTileView: {
    flex: 1
  },
  productTapTileIconView: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  productTapTileIcon: {
    width: 40,
    height: 40
  },
  tapTileTextBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    padding: 3
  },
  /**
   * Reward row view
   */
  rewardView: {
    flex: 0,
    backgroundColor: "rgb(245, 243, 251)"
  },
  rewardViewContainer: {
    paddingVertical: 10,
    minHeight: 100,
    minWidth: "100%",
    justifyContent: "center"
  },
  /**
   * Reward (added product) tile
   */
  rewardTapTileView: {
    width: 60,
    height: 60,
    backgroundColor: "rgb(244, 57, 56)",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    margin: 5
  },
  rewardTapTileImage: {
    width: 30,
    height: 30
  },
  rewardTapTileBadge: {
    position: "absolute",
    left: -4,
    top: -4,
    width: 18,
    height: 18,
    borderRadius: 50,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 3
    },
    elevation: 3
  },
  rewardTapTileBadgeText: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    color: "#000"
  },
  removeHelperText: {
    position: "absolute",
    width: "100%",
    left: 0,
    bottom: 4,
    textAlign: "center",
    fontSize: 12,
    color: "#999"
  },

  /**
   * Button box styles
   */
  buttonBox: {
    flex: 0,
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 15
  },
  gutter: {
    width: 10,
    flex: 0
  }
});
