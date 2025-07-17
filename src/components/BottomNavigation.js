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
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (keyboardVisible) return null; // 👈 Hide tab bar when keyboard is visible

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        if (route.name === "Profile" || route.name === "Notifications") return null;

        const iconName =
          route.name === "Services"
            ? icons.services
            : route.name === "Rewards"
              ? icons.rewards
              : route.name === "Home"
                ? "home"
                : route.name === "Stations"
                  ? icons.station
                  : route.name === "Activity"
                    ? icons.activity
                    : "ellipse";

        const isFocused = state.index === index;

        if (route.name === "Home") {
          return (
            <View key={index} style={styles.tabButton}>
              <CenterButton onPress={() => navigation.navigate(route.name)} />
              <Text style={{ marginTop: 25, color: isFocused ? "#E63946" : "#555" }}>
                {route.name}
              </Text>
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={index}
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
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Stations" component={StationsScreeen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;