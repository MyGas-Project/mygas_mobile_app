import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export default function CheckConnection({ children }) {
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    if (!isConnected) {
        return (
            <View style={styles.center}>
                <Text style={styles.offlineText}>⚠️ No Internet Connection</Text>
            </View>
        );
    }

    return children;
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    offlineText: {
        fontSize: 18,
        fontWeight: "600",
        color: "red",
    },
});
