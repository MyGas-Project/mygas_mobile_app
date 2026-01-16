import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_URL } from "../config";
import { subscribeToChannel, unsubscribeChannel } from "./Websockets";

export async function CheckServerMaintenance() {
    try {
        const resp = await fetch(`${AUTH_URL}settings`, {
            method: "GET",
        });

        if (!resp.ok) {
            throw new Error("Failed to fetch settings");
        }

        return await resp.json();
    } catch (error) {
        console.error("❌ CheckServerMaintenance error:", error);
        throw error;
    }
}

export function listenToMaintenanceUpdates(onUpdate) {
    const channelName = "update-setting-mobile";
    const eventName = "update-setting-mobile";

    subscribeToChannel(channelName, eventName, async (event) => {
        console.log("📡 Maintenance update received:", event.data);

        try {
            const latestSettings = await CheckServerMaintenance();
            onUpdate?.(latestSettings);
        } catch (err) {
            console.error("❌ Failed to refresh settings after WS update:", err);
        }
    });

    return () => {
        unsubscribeChannel(channelName);
    };
}
