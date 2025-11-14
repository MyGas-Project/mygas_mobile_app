// ============================================
// Updated NotificationProvider
// ============================================
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { subscribeToChannel, unsubscribeChannel } from "../lib/Websockets";
import { AuthContext } from "./AuthContext";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifCount, setNotifCount] = useState(0);
    const { userDetails } = useContext(AuthContext);
    const isSubscribed = useRef(false); // Track subscription status

    useEffect(() => {
        if (!userDetails || isSubscribed.current) return;

        const channelName = "activity-screen-refresh";

        const setup = async () => {
            await subscribeToChannel(
                channelName,
                "activity-refresh",
                (event) => {
                    console.info("📡 NotificationProvider received event");
                    const parsed = JSON.parse(event.data);

                    if (userDetails.user_id === parsed?.data?.user_id) {
                        setNotifCount((prev) => prev + 1);
                    }
                }
            );
            isSubscribed.current = true;
            console.log("✅ NotificationProvider subscribed");
        };

        setup();

        return () => {
            if (isSubscribed.current) {
                unsubscribeChannel(channelName);
                isSubscribed.current = false;
                console.log("🛑 NotificationProvider unsubscribed");
            }
        };
    }, [userDetails?.user_id]); // Only depend on user_id

    return (
        <NotificationContext.Provider value={{ notifCount, setNotifCount }}>
            {children}
        </NotificationContext.Provider>
    );
}