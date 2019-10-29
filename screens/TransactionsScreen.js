import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from "react-native";
import SearchBar from "../components/SearchBar";
import Transactions from "../data-store/TransactionsStore";

const TransactionTile = props => {
  const { transactionType, createdAt, lineItems } = props.transaction;
  let points = 0;
  let totalPrice = 0;

  lineItems.forEach(item => {
    points += parseInt(item.points);
    totalPrice += parseFloat(item.totalPrice);
  });

  totalPrice = parseInt(totalPrice * 100) / 100;

  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress(props.transaction);
      }}
    >
      <View style={styles.transactionTile}>
        <View style={styles.transactionTileLeft}>
          <Text style={styles.transactionTileDate}>
            {new Date(createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.transactionTileItems}>
            {points +
              " points - " +
              lineItems.length +
              (lineItems.length > 1 ? " items" : " item")}
          </Text>
          <Text style={styles.transactionTileType}>
            {transactionType === "credit" ? "Awarded" : "Redeemed"}
          </Text>
        </View>
        <View style={styles.transactionTileRight}>
          <Text style={styles.transactionTilePrice}>{"$" + totalPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default class TransactionsScreen extends React.Component {
  static navigationOptions = {
    title: "Transaction History"
  };

  state = {
    transactions: [],
    refreshing: false,
    search: ""
  };

  async componentDidMount() {
    this.props.navigation.addListener("willFocus", async () => {
      const transactions = await Transactions.getItemsAsync();

      if (transactions && transactions.length > 0) {
        this.setState({ transactions });
      }

      await this.getTransactions();
    });
  }

  getTransactions = async () => {
    let transactions = await Transactions.getTransactionsFromServerAsync();

    if (transactions && transactions.length > 0) {
      this.setState({ transactions });
    }
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });

    await this.getTransactions();

    this.setState({ refreshing: false });
  };

  handleSearchInput = value => {
    let search = { ...this.state };
    search = value;
    this.setState({ search });
  };

  renderTransactions = () => {
    let transactions = [...this.state.transactions];

    // transactions = transactions.filter(
    //   t => t.title.indexOf(this.state.search) !== -1
    // );

    if (transactions.length > 0) {
      return transactions.map((transaction, index) => (
        <TransactionTile
          key={index}
          transaction={transaction}
          onPress={_transaction => {
            console.log("NAVIGATE", _transaction);
            this.props.navigation.navigate("Transaction", {
              transaction: _transaction
            });
          }}
        />
      ));
    } else {
      return (
        <View>
          <Text>No records</Text>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {/* <View style={styles.subheader}>
          <View style={{ flex: 1 }}>
            <SearchBar
              placeholder="Search transaction history"
              onChangeText={this.handleSearchInput}
              value={this.state.search}
            />
          </View>
        </View> */}
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
            {this.renderTransactions()}
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
  },
  // Tansaction tile styles
  transactionTile: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgb(191, 191, 191)",
    paddingVertical: 15
  },
  transactionTileLeft: {
    flex: 1
  },
  transactionTileDate: {
    color: "#999",
    fontSize: 12,
    marginBottom: 4
  },
  transactionTileItems: {
    color: "#000",
    fontSize: 16,
    marginBottom: 4
  },
  transactionTileType: {
    color: "#aaa",
    fontSize: 12
  },
  transactionTileRight: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  transactionTilePrice: {
    fontSize: 16,
    color: "#000"
  }
});
