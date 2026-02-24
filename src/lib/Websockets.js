import { Pusher } from "@pusher/pusher-websocket-react-native";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { SOCKET_KEY } from "../config";

const pusher = Pusher.getInstance();

let initialized = false;
let appStateSub = null;

export async function initPusher() {
    if (initialized) {
        return pusher;
    }

    const net = await NetInfo.fetch();
    if (!net.isConnected) {
        console.log("🌐 No internet — skipping Pusher init");
        return null;
    }

    await pusher.init({
        apiKey: SOCKET_KEY,
        cluster: "ap1",
        forceTLS: true,
        onConnectionStateChange: (current, previous) => {
            console.log(`🔌 ${previous} ➝ ${current}`);
        },
        onError: (message, code, error) => {
            console.error("❌ Pusher error:", message, code, error);
        },
    });

    await pusher.connect();
    initialized = true;

    setupAppState();

    console.log("✅ Pusher ready");

    return pusher;
}

function setupAppState() {
    if (appStateSub) return;

    appStateSub = AppState.addEventListener("change", async (state) => {
        if (state === "active") {
            console.log("📱 App active");

            // ONLY reconnect if actually disconnected
            if (pusher.connectionState !== "CONNECTED") {
                console.log("🔄 Reconnecting...");
                await pusher.connect();
            }
        }
    });
}

export async function subscribeToChannel(channelName, eventName, callback) {
    await initPusher();

    return await pusher.subscribe({
        channelName,
        onEvent: (event) => {
            if (event.eventName === eventName) {
                callback?.(event);
            }
        },
    });
}

export async function unsubscribeChannel(channelName) {
    await pusher.unsubscribe({ channelName });
}

export async function disconnectPusher() {
    if (appStateSub) {
        appStateSub.remove();
        appStateSub = null;
    }

    await pusher.disconnect();
    initialized = false;

    console.log("🔌 Pusher manually disconnected");
}

export { pusher };