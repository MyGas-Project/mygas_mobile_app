import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Keyboard,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "../context/ThemeContext";
import HomeScreen from "../screens/dashboard/HomeScreen";
import StationsScreeen from "../screens/dashboard/StationsScreeen";
import ActivityScreen from "../screens/dashboard/ActivityScreen";
import RedemptionScreen from "../screens/dashboard/RedemptionScreen";
import NewsScreen from "../screens/dashboard/NewsScreen";
import ProfileScreen from "../screens/dashboard/ProfileScreen";
import NotificationScreen from "../screens/dashboard/NotificationScreen";
import RewardDetails from "../screens/dashboard/RewardDetails";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import GuestRedemptionScreen from "../screens/guest/GuestRedemptionScreen";
import CommingSoonScreen from "./CommingSoonComponent";

const icons = {
  services: require("../../assets/car.png"),
  rewards: require("../../assets/gift.png"),
  station: require("../../assets/gasoline-pump.png"),
  activity: require("../../assets/history.png"),
};

const Tab = createBottomTabNavigator();

const CenterButton = ({ onPress }) => {
  const { styles } = useTheme();

  return (
    <TouchableOpacity
      style={styles.centerTabButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={require("../../assets/mygas_logo.png")}
        style={{ width: "65%", height: "65%" }}
      />
    </TouchableOpacity>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { styles } = useTheme();
  const insets = useSafeAreaInsets();

  // Define the visual order you want
  const orderedRoutes = ["News", "Redemption", "Home", "Stations", "Activity"];

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          height: 70 + (insets.bottom > 0 ? insets.bottom : 10),
        },
      ]}
    >
      {orderedRoutes.map((routeName, index) => {
        const routeIndex = state.routes.findIndex((r) => r.name === routeName);
        if (routeIndex === -1) return null;

        const route = state.routes[routeIndex];
        const isFocused = state.index === routeIndex;

        if (route.name === "Home") {
          return (
            <View key={route.name} style={styles.tabButton}>
              <CenterButton
                onPress={() => navigation.navigate(route.name)}
                bottomOffset={insets.bottom > 0 ? insets.bottom : 10}
              />
              <Text
                style={{
                  marginTop: 25,
                  color: isFocused ? "#E63946" : "#555",
                }}
              >
                {route.name}
              </Text>
            </View>
          );
        }

        const iconName =
          route.name === "News"
            ? icons.services
            : route.name === "Redemption"
              ? icons.rewards
              : route.name === "Stations"
                ? icons.station
                : route.name === "Activity"
                  ? icons.activity
                  : "ellipse";

        return (
          <TouchableOpacity
            key={route.name}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabButton}
          >
            <Image
              source={iconName}
              style={{
                tintColor: isFocused ? "#E63946" : "#555",
                width: 25,
                height: 25,
              }}
            />
            <Text
              style={{ fontSize: 9, color: isFocused ? "#E63946" : "#555" }}
            >
              My {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const BottomTabNavigator = () => {
  const { userInfo } = useContext(AuthContext);
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{ unmountOnBlur: true }}
      />
      {/* <Tab.Screen
        name="Redemption"
        component={userInfo?.is_guest == 1 ? GuestRedemptionScreen : RedemptionScreen}
        options={{ unmountOnBlur: true }}
      /> */}
      <Tab.Screen
        name="Redemption"
        component={CommingSoonScreen}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen
        name="Stations"
        component={StationsScreeen}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen
        name="RewardDetails"
        component={RewardDetails}
        options={{ tabBarButton: () => null, unmountOnBlur: true }}
      />
      {/* <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarButton: () => null, unmountOnBlur: true }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{ tabBarButton: () => null, unmountOnBlur: true }}
      /> */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;