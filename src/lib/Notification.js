import { useEffect, useRef, useState } from "react";
import { Platform, Alert } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

// Configure foreground notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});

export default function useNotifications() {
    const [expoPushToken, setExpoPushToken] = useState("");
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        const init = async () => {
            try {
                const netInfo = await NetInfo.fetch();
                if (!netInfo.isConnected && !netInfo.isInternetReachable) {
                    return;
                }

                const token = await registerForPushNotificationsAsync();
                if (token) {
                    setExpoPushToken(token);
                    console.log("✅ Expo Push Token:", token);
                    try {
                        await AsyncStorage.setItem("expoPushToken", JSON.stringify(token));
                    } catch (storageError) {
                        console.error("Failed to save token:", storageError);
                    }
                }
            } catch (err) {
                console.error("Error initializing notifications:", err);
            }
        };

        init();

        // Foreground notification listener
        notificationListener.current =
            Notifications.addNotificationReceivedListener(notification => {
                console.log("📩 Notification received (foreground):", notification);
            });

        // User interaction listener
        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(response => {
                console.log("👆 User tapped notification:", response);
                // Handle navigation based on notification data
                const data = response.notification.request.content.data;
                if (data?.screen) {
                    // Navigate to specific screen
                    console.log("Navigate to:", data.screen);
                }
            });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    return expoPushToken;
}

async function registerForPushNotificationsAsync() {
    try {
        if (!Device.isDevice) {
            console.warn("⚠️ Must use physical device for Push Notifications");
            return null;
        }

        // Check existing permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            console.log("❌ Notification permission denied");
            return null;
        }

        console.log("✅ Notification permission granted");

        // Android: Create high-priority notification channel
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "Default Notifications",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#E0B820",
                sound: "default",
                enableVibrate: true,
                showBadge: true,
                lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
            });
            console.log("✅ Android notification channel created");
        }

        // Get push token
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;

        if (!projectId) {
            throw new Error("Expo Project ID not found in Constants");
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId,
        });

        return tokenData.data;
    } catch (error) {
        console.error("❌ Error registering for push notifications:", error);
        return null;
    }
}