import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  RefreshControl
} from "react-native";

import SearchBar from "../components/SearchBar";
import ProductRow from "../components/ProductRow";
import PlusButton from "../components/PlusButton";
import Products from "../data-store/ProductsStore";

export default class ManageProductsScreen extends React.Component {
  static navigationOptions = {
    title: "Manage Products"
  };

  state = {
    products: [],
    refreshing: false,
    search: ""
  };

  handleAddButton = navigation => {
    navigation.navigate("EditProduct");
  };

  componentDidMount() {
    this.props.navigation.addListener("willFocus", () => {
      console.log("Products will be updated from did mount");
      this.updateProducts();
    });
  }

  updateProducts = async () => {
    const products = await Products.getItemsAsync();

    if (products === null) {
      await this.getProductsFromServer();
    } else {
      console.log("Products in cache: ", products);
      this.setState({ products: products });
    }
  };

  getProductsFromServer = async () => {
    const products = await Products.getProductsFromServerAsync();
    this.setState({ products: products });
  };

  renderProducts = () => {
    let products = [...this.state.products];
    products = products.filter(p => {
      let name = p.name.toLowerCase();
      return name.indexOf(this.state.search.toLowerCase()) !== -1;
    });

    if (products.length > 0) {
      return products.map((product, index) => (
        <ProductRow
          key={index}
          product={product}
          onPress={_product => {
            this.props.navigation.navigate("EditProduct", {
              product: _product
            });
          }}
        />
      ));
    } else {
      return (
        <View>
          <Text>No products added</Text>
        </View>
      );
    }
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.getProductsFromServer();
    this.setState({ refreshing: false });
  };

  handleSearchInput = value => {
    let search = { ...this.state };
    search = value;
    this.setState({ search });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.subheader}>
          <View style={{ flex: 1 }}>
            <SearchBar
              placeholder="Search products"
              onChangeText={this.handleSearchInput}
              value={this.state.search}
            />
          </View>
          <View style={{ flex: 0 }}>
            <PlusButton
              onPress={() => {
                this.handleAddButton(this.props.navigation);
              }}
            />
          </View>
        </View>
        <View style={styles.body}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewInner}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          >
            {this.renderProducts()}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%"
  },
  subheader: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "rgb(245, 243, 251)"
  },
  body: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollViewInner: {
    paddingVertical: 10,
    paddingHorizontal: 30
  }
});
