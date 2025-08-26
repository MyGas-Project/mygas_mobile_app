import { useEffect, useRef, useState } from "react";
import { Platform, Alert } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        registerForPushNotificationsAsync().then(token => {
            if (token) {
                setExpoPushToken(token);
                console.log("Expo Push Token:", token);
                AsyncStorage.setItem("expoPushToken", JSON.stringify(token));
            }
        });

        notificationListener.current =
            Notifications.addNotificationReceivedListener(notification => {
                console.log("Notification received:", notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(response => {
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
    if (!Device.isDevice) {
        Alert.alert("Must use physical device for Push Notifications");
        return;
    }

    // Ask for permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        Alert.alert("Failed to get push token!");
        return;
    }

    // Get push token
    const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
}