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
import { CheckServerMaintenance, listenToMaintenanceUpdates } from "../lib/CheckServerMaintenance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "./Navbar";

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
                // tintColor: isFocused ? "#E63946" : "#555",
                tintColor: "red",
                width: 25,
                height: 25,
              }}
              tintColor={isFocused ? "#E63946" : "#555"}
              resizeMode="contain"
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
  const [redemption, setRedemption] = useState(null);
  const [news, setNews] = useState(null);
  const [station, setStation] = useState(null);
  const [activity, setActivity] = useState(null);
  const [home, setHome] = useState(null);

  useEffect(() => {
    const unsubscribe = listenToMaintenanceUpdates(async (latestSettings) => {
      const moduleSettings = latestSettings.result.filter(item => /^module_.*_enabled$/.test(item.key));
      const fieldsToKeep = ["key", "value"];
      // Filter dynamically
      const filteredSettings = moduleSettings.map(item =>
        Object.fromEntries(
          Object.entries(item).filter(([k]) => fieldsToKeep.includes(k))
        )
      );
      // setMobileSettings(filteredSettings);
      // setRedemption(filteredSettings.find(item => item.key === "module_my_redemption_enabled"));
      setRedemption(filteredSettings.find(item => item.key === "module_my_redemption_enabled"));
      setNews(filteredSettings.find(item => item.key === "module_my_news_enabled"));
      setStation(filteredSettings.find(item => item.key === "module_my_stations_enabled"));
      setActivity(filteredSettings.find(item => item.key === "module_my_activity_enabled"));
      setHome(filteredSettings.find(item => item.key === "module_home_enabled"));
      // console.log(filteredSettings);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    CheckServerMaintenance().then(function (result) {
      const moduleSettings = result.result.filter(item => /^module_.*_enabled$/.test(item.key));
      const fieldsToKeep = ["key", "value"];
      // Filter dynamically
      const filteredSettings = moduleSettings.map(item =>
        Object.fromEntries(
          Object.entries(item).filter(([k]) => fieldsToKeep.includes(k))
        )
      );
      // setMobileSettings(filteredSettings);
      setRedemption(filteredSettings.find(item => item.key === "module_my_redemption_enabled"));
      setRedemption(filteredSettings.find(item => item.key === "module_my_redemption_enabled"));
      setNews(filteredSettings.find(item => item.key === "module_my_news_enabled"));
      setStation(filteredSettings.find(item => item.key === "module_my_stations_enabled"));
      setActivity(filteredSettings.find(item => item.key === "module_my_activity_enabled"));
      setHome(filteredSettings.find(item => item.key === "module_home_enabled"));
      // console.log("settings: ", moduleSettings);
    });
  }, []);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true, 
        tabBarHideOnKeyboard: true, 
        header: () => {
          return <Navbar hideBack />
        }
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={home?.value === "1" ? HomeScreen : CommingSoonScreen}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen
        name="News"
        component={news?.value === "1" ? NewsScreen : CommingSoonScreen}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen
        name="Redemption"
        component={
          redemption?.value === "1"
            ? userInfo?.is_guest === 1
              ? GuestRedemptionScreen
              : RedemptionScreen
            : CommingSoonScreen
        }
        options={{ unmountOnBlur: true }}
      />
      {/* <Tab.Screen
        name="Redemption"
        component={userInfo?.is_guest == 1 ? GuestRedemptionScreen : RedemptionScreen}
        options={{ unmountOnBlur: true }}
      /> */}
      {/* <Tab.Screen
        name="Redemption"
        component={CommingSoonScreen}
        options={{ unmountOnBlur: true }}
      /> */}
      <Tab.Screen
        name="Stations"
        component={station?.value === "1" ? StationsScreeen : CommingSoonScreen}
        options={{ unmountOnBlur: true }}
      />
      <Tab.Screen
        name="Activity"
        component={activity?.value === "1" ? ActivityScreen : CommingSoonScreen}
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