import React, { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import Navigation from "./src/components/Navigation";
import { StatusBar } from "expo-status-bar";
import ConnectionLoss from "./src/screens/ConnectionLoss";
import useNotifications from "./src/lib/Notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationProvider } from "./src/context/ActivityNotif";
import { AppState } from "react-native";
import { initPusher, disconnectPusher } from "./src/lib/Websockets";
import { PointsDetailsProvider } from "./src/context/PointsDetails";

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [appState, setAppState] = useState(AppState.currentState);

  useNotifications();

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
        console.log("📱 App moved to background → Optionally disconnect Pusher");
        disconnectPusher();
      }
      setAppState(nextAppState);
    });

    return () => {
      unsubscribeNetInfo();
      subscription.remove();
    };
  }, []);

  return (
    <ThemeProvider>
      <StatusBar hidden={true} />
      <AuthProvider>
        <NotificationProvider>
          <PointsDetailsProvider>
            {isConnected ? (
              <Navigation />
            ) : (
              <ConnectionLoss
                onRetry={async () => {
                  const state = await NetInfo.fetch();
                  if (state.isConnected && state.isInternetReachable) {
                    setIsConnected(true);
                    initPusher();
                  }
                }}
              />
            )}
          </PointsDetailsProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );

}
