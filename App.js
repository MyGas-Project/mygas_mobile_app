import React, { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import LocationGate from "./src/context/LocationGate";
import Navigation from "./src/components/Navigation";
import { StatusBar } from "expo-status-bar";
import ConnectionLoss from "./src/screens/ConnectionLoss";
import ServerMaintenance from "./src/screens/ServerBusy";
import useNotifications from "./src/lib/Notification";
import { NotificationProvider } from "./src/context/ActivityNotif";
import { PointsDetailsProvider } from "./src/context/PointsDetails";
import { Alert, AppState } from "react-native";
import { initPusher, disconnectPusher } from "./src/lib/Websockets";
import { PATH_URL } from "./src/config";
import { CheckServerMaintenance } from "./src/lib/CheckServerMaintenance";
// import * as TrackingTransparency from 'expo-tracking-transparency';
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [serverUp, setServerUp] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);
  const [maintenance, setMaintenance] = useState(false);

  useNotifications();

  useEffect(() => {
    let intervalId = null;

    const checkServerHealth = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // timeout after 5s

        const response = await fetch(`${PATH_URL}health`, {
          method: "GET",
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
          console.warn("Server responded with error:", response.status);
          setServerUp(false);
          return;
        }

        const data = await response.json();
        // console.log(data);

        if (data.status === "UP") {
          // console.log("Server is healthy, stopping interval check.");
          setServerUp(true);

          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        } else {
          console.warn("⚠️ Server health not OK:", data);
          setServerUp(false);
        }

      } catch (error) {
        console.error("Server health check failed:", error.message);
        setServerUp(false);

        if (!intervalId) {
          intervalId = setInterval(checkServerHealth, 30000);
        }
      }
    };

    checkServerHealth();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    initPusher();

    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        console.log("📱 App moved to foreground → Re-init Pusher");
        initPusher();
      }
      if (nextAppState === "background") {
        console.log("📱 App moved to background → Disconnect Pusher");
        disconnectPusher();
      }
      setAppState(nextAppState);
    });

    return () => {
      unsubscribeNetInfo();
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const checkMaintenance = async () => {
      const result = await CheckServerMaintenance();
      // console.log("maintenance check:", result.result[0].value);
      if(result.result[0].value === "true"){
        setMaintenance(true);
      }else{
        setMaintenance(false);
      }
    };

    checkMaintenance();

    // AsyncStorage.clear();
  }, []);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            

  // Conditional rendering
  let ScreenToRender = <Navigation />;

  if (!isConnected) {
    ScreenToRender = (
      <ConnectionLoss
        onRetry={async () => {
          const state = await NetInfo.fetch();
          if (state.isConnected && state.isInternetReachable) {
            setIsConnected(true);
            initPusher();
          }
        }}
      />
    );
  } 

  if (!serverUp) {
    ScreenToRender = <ServerMaintenance />;
  }

  // if (!maintenance) {
  //   ScreenToRender = <ServerMaintenance />;
  // }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar hidden={true} />
        <AuthProvider>
          {/* <LocationGate> */}
          <NotificationProvider>
            <PointsDetailsProvider>
              {ScreenToRender}
            </PointsDetailsProvider>
          </NotificationProvider>
          {/* </LocationGate> */}
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
