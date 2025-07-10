import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import BottomNavigation from "./BottomNavigation";
import ScanScreen from "../screens/dashboard/ScanScreen";
import RewardDetails from "../screens/RewardDetails";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Step1 from "../screens/auth/steps/RegisterStep1";
import ProfileScreen from "../screens/dashboard/ProfileScreen";
import ActivityScreen from "../screens/dashboard/ActivityScreen";
import NotificationScreen from "../screens/dashboard/NotificationScreen";
import ServicesScreen from "../screens/dashboard/ServicesScreen";
import StationsScreeen from "../screens/dashboard/StationsScreeen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { userInfo } = useContext(AuthContext);
  const [initialRoute, setInitialRoute] = useState(null);

  // useEffect(() => {
  //   const checkIfNewUser = async () => {
  //     try {
  //       const isNewUser = await AsyncStorage.getItem("isNewUser");
  //       setInitialRoute(isNewUser === null ? "Welcome" : "Login");
  //     } catch (e) {
  //       setInitialRoute("Welcome"); // fallback
  //     }
  //   };
  //   checkIfNewUser();
  // }, []);

  // if (!initialRoute && !userInfo) return null; // or a loading spinner

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={userInfo ? "HomeScreen" : initialRoute}>
        {userInfo ? (
          <>
            <Stack.Screen
              name="HomeScreen"
              component={BottomNavigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Notification"
              component={NotificationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Activity"
              component={ActivityScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Service"
              component={ServicesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Stations"
              component={StationsScreeen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ScanScreen"
              component={ScanScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RewardDetails"
              component={RewardDetails}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Step1"
              component={Step1}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
