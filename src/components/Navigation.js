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
import { BASE_URL } from "../config";
import ServerMaintenance from "../screens/ServerBusy";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import TermsCondition from "../screens/TermsCondition";
import CartScreens from "../screens/dashboard/CartScreens";
import RedemptionTransactionScreens from "../screens/dashboard/RedemptionTransactionScreens";
import TransactionDetailsPopup from "../screens/dashboard/components/TransactionDetailsPopup";
import RedemptionScreen from "../screens/dashboard/RedemptionScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { userInfo, userDetails } = useContext(AuthContext);
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);

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
            <Stack.Screen
              name="CartScreens"
              component={CartScreens}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RedemptionScreen"
              component={RedemptionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RedemptionTransactionScreens"
              component={RedemptionTransactionScreens}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TransactionDetailsPopup"
              component={TransactionDetailsPopup}
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
            {/* <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
              /> */}
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
        <Stack.Screen
          name="ServerMaintenance"
          component={ServerMaintenance}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TermsCondition"
          component={TermsCondition}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
