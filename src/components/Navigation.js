import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import BottomNavigation from "./BottomNavigation";
import ScanScreen from "../screens/dashboard/ScanScreen";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Step1 from "../screens/auth/steps/RegisterStep1";
import ProfileScreen from "../screens/dashboard/ProfileScreen";
import NotificationScreen from "../screens/dashboard/NotificationScreen";
import ConnectionLoss from "../screens/ConnectionLoss";
import LoadingPage from "../components/LoadingState";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { userInfo, userDetails } = useContext(AuthContext);
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfNewUser = async () => {
      try {
        const isNewUser = await AsyncStorage.getItem("newUser");
        setInitialRoute(isNewUser);
      } catch (e) {
        await AsyncStorage.removeItem("newUser");
        setInitialRoute(null);
      } finally {
        setLoading(false);
      }
    };

    checkIfNewUser();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userInfo ? (
          <>
            <Stack.Screen
              name="BottomNavigation"
              component={BottomNavigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ScanScreen"
              component={ScanScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            {!initialRoute && (
              <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
              />
            )}
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
        <Stack.Screen
          name="ConnectionLoss"
          component={ConnectionLoss}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
