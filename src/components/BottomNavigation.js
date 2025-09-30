import React, { useEffect, useState } from "react";
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
import RewardsScreen from "../screens/dashboard/RewardsScreen";
import ServicesScreen from "../screens/dashboard/ServicesScreen";
import ProfileScreen from "../screens/dashboard/ProfileScreen";
import NotificationScreen from "../screens/dashboard/NotificationScreen";
import RewardDetails from "../screens/dashboard/RewardDetails";

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

  // Define the visual order you want
  const orderedRoutes = ["Services", "Rewards", "Home", "Stations", "Activity"];

  return (
    <View style={styles.tabBar}>
      {orderedRoutes.map((routeName, index) => {
        const routeIndex = state.routes.findIndex(r => r.name === routeName);
        if (routeIndex === -1) return null;

        const route = state.routes[routeIndex];
        const isFocused = state.index === routeIndex;

        if (route.name === "Home") {
          return (
            <View key={route.name} style={styles.tabButton}>
              <CenterButton onPress={() => navigation.navigate(route.name)} />
              <Text style={{ marginTop: 25, color: isFocused ? "#E63946" : "#555" }}>
                {route.name}
              </Text>
            </View>
          );
        }

        const iconName =
          route.name === "Services"
            ? icons.services
            : route.name === "Rewards"
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
            <Text style={{ color: isFocused ? "#E63946" : "#555" }}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};


const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true, }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ unmountOnBlur: true }} />
      <Tab.Screen name="Services" component={ServicesScreen} options={{ unmountOnBlur: true }} />
      <Tab.Screen name="Rewards" component={RewardsScreen} options={{ unmountOnBlur: true }} />
      <Tab.Screen name="Stations" component={StationsScreeen} options={{ unmountOnBlur: true }} />
      <Tab.Screen name="Activity" component={ActivityScreen} options={{ unmountOnBlur: true }} />
      <Tab.Screen name="RewardDetails" component={RewardDetails} options={{ tabBarButton: () => null, unmountOnBlur: true }} />
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