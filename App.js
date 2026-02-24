import React, { useState, useEffect } from "react";
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
import { initPusher } from "./src/lib/Websockets";
import { PATH_URL } from "./src/config";
import { CheckServerMaintenance } from "./src/lib/CheckServerMaintenance";

export default function App() {
  const [isConnected, setIsConnected] = useState(true);
  const [serverUp, setServerUp] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [hasBarcode, setHasBarcode] = useState(null);

  useNotifications();

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        // Load barcode
        const barcode = await AsyncStorage.getItem("userBarcode");
        if (mounted) setHasBarcode(barcode);

        // Init Pusher once
        await initPusher();
      } catch (err) {
        console.error("Bootstrap error:", err);
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = !!(state.isConnected && state.isInternetReachable);
      setIsConnected(online);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let intervalId;
    let mounted = true;

    const checkServerHealth = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${PATH_URL}health`, {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) throw new Error("Health check failed");

        const data = await response.json();

        if (mounted) {
          const isUp = data?.status === "UP";
          setServerUp(isUp);

          if (isUp && intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
          }
        }
      } catch (error) {
        if (mounted) {
          setServerUp(false);

          if (!intervalId) {
            intervalId = setInterval(checkServerHealth, 30000);
          }
        }
      }
    };

    checkServerHealth();

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const checkMaintenance = async () => {
      try {
        const result = await CheckServerMaintenance();
        const isMaintenance = result?.result?.[0]?.value === "true";

        if (mounted) {
          setMaintenance(isMaintenance);
        }
      } catch (err) {
        console.error("Maintenance check failed:", err);
      }
    };

    checkMaintenance();

    return () => {
      mounted = false;
    };
  }, []);

  let ScreenToRender = <Navigation />;

  if (!isConnected) {
    ScreenToRender =
      hasBarcode == null ? (
        <ConnectionLoss
          onRetry={async () => {
            const state = await NetInfo.fetch();
            if (state.isConnected && state.isInternetReachable) {
              setIsConnected(true);
              await initPusher();
            }
          }}
        />
      ) : (
        <QRCustomer customerBarcode={hasBarcode} />
      );
  }

  if (!serverUp) {
    ScreenToRender = <ServerMaintenance />;
  }

  if (maintenance) {
    ScreenToRender = <ServerMaintenance />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar hidden />
        <AuthProvider>
          <NotificationProvider>
            <PointsDetailsProvider>
              {ScreenToRender}
            </PointsDetailsProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}