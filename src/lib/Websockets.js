import {
    Pusher,
    PusherEvent,
} from "@pusher/pusher-websocket-react-native";
import NetInfo from "@react-native-community/netinfo";
import { AppState } from "react-native";

let initialized = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const pusher = Pusher.getInstance();
const activeSubscriptions = new Map(); // Track active subscriptions
let currentConnectionState = "DISCONNECTED"; // Track connection state manually
let isResubscribing = false; // Prevent multiple resubscribe attempts

// Handle app state changes
let appStateSubscription = null;

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

                // ✅ UPDATE: Track connection state manually
                currentConnectionState = currentState;

                if (currentState === "CONNECTED") {
                    reconnectAttempts = 0;
                    // Resubscribe to all channels after reconnection
                    resubscribeAllChannels();
                }

                if (currentState === "DISCONNECTED") {
                    console.warn("⚠️ Lost connection to Pusher");
                }

                if (currentState === "FAILED") {
                    console.error("❌ Pusher connection failed. Attempting to reconnect...");
                    attemptReconnect();
                }
            },
            onError: (message, code, e) => {
                console.error(`❌ Pusher error: ${message} (Code: ${code})`, e);
            },
        });

        await pusher.connect();
        initialized = true;
        console.log("✅ Pusher initialized and connected");

        // Setup app state listener
        setupAppStateListener();

        return pusher;
    } catch (error) {
        console.error("❌ Failed to initialize Pusher:", error);
        return null;
    }
}

function setupAppStateListener() {
    if (appStateSubscription) return; // Already setup

    appStateSubscription = AppState.addEventListener('change', async (nextAppState) => {
        console.log(`📱 App state changed to: ${nextAppState}`);

        if (nextAppState === 'active') {
            // App came to foreground
            console.log("🔄 App in foreground, checking Pusher connection...");
            console.log(`📊 Current tracked state: ${currentConnectionState}`);

            try {
                // ✅ FIXED: Use tracked state instead of pusher.getConnectionState()
                if (currentConnectionState !== "CONNECTED") {
                    console.log("🔌 Reconnecting Pusher...");

                    // Disconnect first
                    try {
                        await pusher.disconnect();
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } catch (err) {
                        console.log("⚠️ Disconnect error (may already be disconnected):", err.message);
                    }

                    // Then reconnect
                    await pusher.connect();
                    console.log("✅ Reconnection initiated");
                    // Subscriptions will be restored via onConnectionStateChange
                } else {
                    console.log("✅ Pusher already connected, no reconnection needed");
                }
            } catch (error) {
                console.error("❌ Error checking/reconnecting Pusher:", error);
            }
        } else if (nextAppState === 'background' || nextAppState === 'inactive') {
            console.log("📴 App in background/inactive");
        }
    });
}

async function attemptReconnect() {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error("❌ Max reconnect attempts reached");
        return;
    }

    reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Exponential backoff

    console.log(`🔄 Attempting reconnect ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`);

    setTimeout(async () => {
        try {
            await pusher.connect();
        } catch (error) {
            console.error("❌ Reconnect failed:", error);
        }
    }, delay);
}

async function resubscribeAllChannels() {
    if (activeSubscriptions.size === 0) {
        console.log("ℹ️ No channels to resubscribe");
        return;
    }

    console.log(`🔄 Resubscribing to ${activeSubscriptions.size} channels...`);

    // Add a small delay to ensure connection is fully established
    await new Promise(resolve => setTimeout(resolve, 500));

    for (const [channelName, { events, callback }] of activeSubscriptions.entries()) {
        try {
            // First, try to unsubscribe if there's an existing subscription
            try {
                await pusher.unsubscribe({ channelName });
            } catch (unsubError) {
                // Ignore errors if channel wasn't subscribed
            }

            // Wait a bit between unsubscribe and subscribe
            await new Promise(resolve => setTimeout(resolve, 100));

            // Now subscribe
            await pusher.subscribe({
                channelName,
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
            console.log(`✅ Resubscribed to ${channelName}`);
        } catch (error) {
            console.error(`❌ Failed to resubscribe to ${channelName}:`, error);
        }
    }
}

export async function subscribeToChannel(channel, events, callback) {
    try {
        const instance = await initPusher();
        if (!instance) {
            console.warn("⚠️ Cannot subscribe, Pusher not ready.");
            return null;
        }

        // Store subscription info for reconnection
        activeSubscriptions.set(channel, { events, callback });

        const subscription = await instance.subscribe({
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

        console.log(`✅ Subscribed to ${channel}`);
        return subscription;
    } catch (error) {
        console.error(`❌ Failed to subscribe to ${channel}:`, error);
        return null;
    }
}

export async function unsubscribeChannel(channel) {
    try {
        await pusher.unsubscribe({ channelName: channel });
        activeSubscriptions.delete(channel);
        console.log(`🛑 Unsubscribed from ${channel}`);
    } catch (e) {
        console.error("❌ Unsubscribe error:", e);
    }
}

export async function disconnectPusher() {
    try {
        // Remove app state listener
        if (appStateSubscription) {
            appStateSubscription.remove();
            appStateSubscription = null;
        }

        await pusher.disconnect();
        initialized = false;
        currentConnectionState = "DISCONNECTED";
        activeSubscriptions.clear();
        console.log("🔌 Pusher disconnected manually");
    } catch (e) {
        console.error("❌ Failed to disconnect Pusher:", e);
    }
}

// Listen for network changes globally
NetInfo.addEventListener((state) => {
    if (!state.isConnected) {
        console.warn("🌐 Internet lost — Pusher may disconnect");
    } else {
        console.log("🌐 Internet restored");
        // Attempt to reconnect if we're initialized but not connected
        if (initialized && currentConnectionState !== "CONNECTED") {
            console.log("🔄 Reconnecting after network restoration...");
            pusher.connect().catch(console.error);
        }
    }
});

export { pusher };