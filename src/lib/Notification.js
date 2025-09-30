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
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
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
                    // Alert.alert("No Internet", "Please connect to the internet to enable push notifications.");
                    return;
                }

                const token = await registerForPushNotificationsAsync();
                if (token) {
                    setExpoPushToken(token);
                    // console.log("Expo Push Token:", token);
                    try {
                        await AsyncStorage.setItem("expoPushToken", JSON.stringify(token));
                    } catch (storageError) {
                        console.error("Failed to save token:", storageError);
                    }
                }
            } catch (err) {
                console.error("Error initializing notifications:", err);
                // Alert.alert("Notification Error", "Something went wrong while setting up notifications.");
            }
        };

        init();

        notificationListener.current =
            Notifications.addNotificationReceivedListener(notification => {
                console.log("Notification received:", notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(response => {
                console.log("User interacted with notification:", response.trigger);
                console.log("User interacted with notification:", response);
            });

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, []);

    return expoPushToken;
}

async function registerForPushNotificationsAsync() {
    try {
        if (!Device.isDevice) {
            Alert.alert("Must use physical device for Push Notifications");
            return null;
        }

        // Ask for permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            // Alert.alert("Permission Denied", "Failed to get push token for notifications.");
            console.log("Failed to get push token for notifications. Permission denied.");
            return null;
        }

        // Get push token
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;

        if (!projectId) {
            throw new Error("Expo Project ID not found in Constants.");
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
        return tokenData.data;
    } catch (error) {
        console.error("Error registering for push notifications:", error);
        // Alert.alert("Notification Setup Error", "Unable to register for push notifications.");
        return null;
    }
}
