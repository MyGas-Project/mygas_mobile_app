import {
    Pusher,
    PusherEvent,
} from "@pusher/pusher-websocket-react-native";
import NetInfo from "@react-native-community/netinfo";

let initialized = false; // track if already initialized
const pusher = Pusher.getInstance();

export async function initPusher() {
    if (initialized) {
        console.log("⚡ Pusher already initialized");
        return pusher;
    }

    try {
        // Check internet connection first
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            console.warn("🌐 No internet connection, cannot initialize Pusher.");
            return null;
        }

        await pusher.init({
            apiKey: "efb45a8d70be75b2c96d",
            cluster: "ap1",
            forceTLS: true,
            onConnectionStateChange: (currentState, prevState) => {
                console.log(`🔌 Pusher state changed from ${prevState} ➝ ${currentState}`);
                if (currentState === "DISCONNECTED") {
                    console.warn("⚠️ Lost connection to Pusher");
                }
                if (currentState === "FAILED") {
                    console.error("❌ Pusher connection failed. Check internet or API key.");
                }
            },
            onError: (message, code, e) => {
                console.error(`❌ Pusher error: ${message} (Code: ${code})`, e);
            },
        });

        await pusher.connect();
        initialized = true;
        console.log("✅ Pusher initialized and connected");
        return pusher;
    } catch (error) {
        console.error("❌ Failed to initialize Pusher:", error);
        return null;
    }
}

export async function subscribeToChannel(channel, events, callback) {
    try {
        const instance = await initPusher();
        if (!instance) {
            console.warn("⚠️ Cannot subscribe, Pusher not ready.");
            return null;
        }

        return instance.subscribe({
            channelName: channel,
            onEvent: (event) => {
                const eventNames = Array.isArray(events) ? events : [events];
                if (eventNames.includes(event.eventName)) {
                    try {
                        callback?.(event);
                    } catch (cbErr) {
                        console.error("Error in callback:", cbErr);
                    }
                }
            },
        });
    } catch (error) {
        console.error(`❌ Failed to subscribe to ${channel}:`, error);
        return null;
    }
}

export async function unsubscribeChannel(channel) {
    try {
        await pusher.unsubscribe({ channelName: channel });
        console.log(`🛑 Unsubscribed from ${channel}`);
    } catch (e) {
        console.error("❌ Unsubscribe error:", e);
    }
}

export async function disconnectPusher() {
    try {
        await pusher.disconnect();
        initialized = false;
        console.log("🔌 Pusher disconnected manually");
    } catch (e) {
        console.error("❌ Failed to disconnect Pusher:", e);
    }
}

// Optional: Listen for network changes globally
NetInfo.addEventListener((state) => {
    if (!state.isConnected) {
        console.warn("🌐 Internet lost — Pusher may disconnect");
    } else {
        console.log("🌐 Internet restored");
    }
});
