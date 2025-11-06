import React, { useContext, useEffect, useRef } from "react";
import { Alert, AppState, Platform, Linking } from "react-native";
import { AuthContext } from "./AuthContext";
import * as Location from "expo-location";

export default function LocationGate({ children }) {
    const { locationEnabled, checkLocationPermission } = useContext(AuthContext);
    const hasShownAlert = useRef(false);

    const openLocationSettings = async () => {
        if (Platform.OS === "ios") {
            Linking.openURL("app-settings:");
        } else {
            await Location.enableNetworkProviderAsync();
        }
    };

    const showLocationAlert = () => {
        Alert.alert(
            "Location Required",
            "Please enable location services to use this app.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => {
                        hasShownAlert.current = false; // Allow showing again
                    }
                },
                {
                    text: "Open Settings",
                    onPress: () => {
                        openLocationSettings();
                        hasShownAlert.current = false; // Allow showing again after settings
                    }
                }
            ],
            { cancelable: true, onDismiss: () => hasShownAlert.current = false }
        );
    };

    // Show alert when location is disabled
    useEffect(() => {
        if (!locationEnabled && !hasShownAlert.current) {
            hasShownAlert.current = true;
            showLocationAlert();
        }
    }, [locationEnabled]);

    // Recheck when user returns to app
    useEffect(() => {
        const sub = AppState.addEventListener("change", (state) => {
            if (state === "active") {
                checkLocationPermission();
            }
        });

        return () => sub.remove();
    }, []);

    return children;
}