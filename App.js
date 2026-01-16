import React, { useState, useEffect } from "react";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { NotificationProvider } from "./src/context/ActivityNotif";
import { PointsDetailsProvider } from "./src/context/PointsDetails";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Navigation from "./src/components/Navigation";
import ConnectionLoss from "./src/screens/ConnectionLoss";
import ServerMaintenance from "./src/screens/ServerBusy";
import QRCustomer from "./src/screens/QRCustomer";
import useNotifications from "./src/lib/Notification";
import { initPusher, disconnectPusher } from "./src/lib/Websockets";
import { PATH_URL } from "./src/config";
import { CheckServerMaintenance, listenToMaintenanceUpdates } from "./src/lib/CheckServerMaintenance";

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [serverUp, setServerUp] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [hasBarcode, setHasBarcode] = useState(null); // null = loading
  const [appState, setAppState] = useState(AppState.currentState);

  useNotifications();

  useEffect(function () {
    AsyncStorage.getItem("userBarcode").then(function (barcode) {
      setHasBarcode(barcode);
    });
  }, []);

  useEffect(function () {
    initPusher();

    NetInfo.fetch().then(function (state) {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    const unsubscribeNetInfo = NetInfo.addEventListener(function (state) {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    const subscription = AppState.addEventListener("change", function (nextAppState) {
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

    return function () {
      unsubscribeNetInfo();
      subscription.remove();
    };
  }, [appState]);

  useEffect(function () {
    var intervalId = null;

    function checkServerHealth() {
      const controller = new AbortController();
      const timeout = setTimeout(function () {
        controller.abort();
      }, 5000);

      fetch(PATH_URL + "health", { method: "GET", signal: controller.signal })
        .then(function (response) {
          clearTimeout(timeout);
          if (!response.ok) {
            console.warn("Server responded with error:", response.status);
            setServerUp(false);
            return;
          }
          return response.json();
        })
        .then(function (data) {
          if (data && data.status === "UP") {
            setServerUp(true);
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
          } else if (data) {
            console.warn("⚠️ Server health not OK:", data);
            setServerUp(false);
          }
        })
        .catch(function (error) {
          console.error("Server health check failed:", error.message);
          setServerUp(false);
          if (!intervalId) {
            intervalId = setInterval(checkServerHealth, 30000);
          }
        });
    }

    checkServerHealth();

    return function () {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(function () {
    CheckServerMaintenance().then(function (result) {
      if (result.result[0].value === "true") {
        setMaintenance(true);
      } else {
        setMaintenance(false);
      }
    });
  }, []);

  var ScreenToRender = <Navigation />;

  if (!isConnected) {
    if (hasBarcode == null) {
      ScreenToRender = (
        <ConnectionLoss
          onRetry={function () {
            NetInfo.fetch().then(function (state) {
              if (state.isConnected && state.isInternetReachable) {
                setIsConnected(true);
                initPusher();
              }
            });
          }}
        />
      );
    } else {
      ScreenToRender = <QRCustomer customerBarcode={hasBarcode} />;
    }
  }

  if (!serverUp) {
    ScreenToRender = <ServerMaintenance />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar hidden={true} />
        <AuthProvider>
          <NotificationProvider>
            <PointsDetailsProvider>{ScreenToRender}</PointsDetailsProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
