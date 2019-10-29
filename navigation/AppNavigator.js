// import React from "react";
// import { createAppContainer, createSwitchNavigator } from "react-navigation";

// import MainTabNavigator from "./MainTabNavigator";

// export default createAppContainer(
//   createSwitchNavigator({
//     // You could add another route here for authentication.
//     // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//     Main: MainTabNavigator
//   })
// );

import React from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

import { Animated, Easing, View } from "react-native";

import SocialLogin from "../screens/auth-screens/SocialLogin";
import LoginScreen from "../screens/auth-screens/LoginScreen";
import SignupScreen from "../screens/auth-screens/SignupScreen";

import AuthLoadingScreen from "../screens/auth-screens/AuthLoadingScreen";

import AddStoreScreen from "../screens/onboard/AddStoreScreen";
import DashboardScreen from "../screens/DashboardScreen";
import UserSearch from "../screens/UserSearch";
import ManageProductsScreen from "../screens/ManageProductsScreen";
import EditProductScreen from "../screens/EditProductScreen";
import QRCodeScanScreen from "../screens/CodeScanScreen";
import RewardScreen from "../screens/RewardScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import TransactionScreen from "../screens/TransactionScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import AboutScreen from "../screens/settings/AboutScreen";
import SelectIconModal from "../screens/SelectIconModal";

import ManageRewardsScreen from "../screens/ManageRewardsScreen";
import EditRewardScreen from "../screens/EditRewardScreen";

import ConfirmationModal from "../screens/modals/ConfirmationModal";

const AppStack = createStackNavigator(
  {
    Dashboard: DashboardScreen,
    UserSearch: UserSearch,
    ScanCode: QRCodeScanScreen,
    Reward: RewardScreen,
    Transactions: TransactionsScreen,
    Transaction: TransactionScreen,
    Settings: SettingsScreen,
    About: AboutScreen,
    AddStore: AddStoreScreen,
    ManageProducts: ManageProductsScreen,
    EditProduct: EditProductScreen,
    SelectProductIcon: SelectIconModal,
    ManageRewards: ManageRewardsScreen,
    EditReward: EditRewardScreen
  },
  {
    /**
     * If the initial route is set then it is added to backstack
     * even if we don't want it to be. Say when the app needs to
     * go to "Add Store" screen after app entry if there is no store
     * present. But having an initial route causes the router to add
     * dashboard in the stack first.
     */
    // initialRouteName: "Dashboard",
    defaultNavigationOptions: {
      headerLayoutPreset: "center",
      headerTitleStyle: {
        textAlign: "center",
        flex: 1,
        fontWeight: "400"
      },
      headerTintColor: "#000",
      headerRight: <View></View>
    }
  }
);

const ModalStack = createStackNavigator(
  {
    Content: AppStack,
    ConfirmationModal: {
      screen: ConfirmationModal
    }
  },
  {
    initialRouteName: "Content",
    headerMode: "none",
    mode: "modal",
    transparentCard: true,
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
        useNativeDriver: true
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const thisSceneIndex = scene.index;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
          outputRange: [height, 0, 0]
        });

        // const opacity = position.interpolate({
        //   inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
        //   outputRange: [1, 1, 0.1]
        // });

        return { transform: [{ translateY }] };
        // return { opacity, transform: [{ translateY }] };
      }
    })
  }
);

const AuthStack = createStackNavigator(
  {
    Login: SocialLogin,
    EmailLogin: LoginScreen,
    Signup: SignupScreen
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
);

// const AppNavigator = createAppContainer(AppStack);

const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Auth: AuthStack,
      App: ModalStack // AppStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);

export default AppNavigator;
