import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToChannel, unsubscribeChannel } from "../lib/Websockets";
import { AuthContext } from "./AuthContext";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifCount, setNotifCount] = useState(0);
    const { userDetails } = useContext(AuthContext);

    useEffect(() => {
        if (!userDetails) return;
        let subscription;

        const setup = async () => {
            subscription = await subscribeToChannel(
                "activity-screen-refresh",
                "activity-refresh",
                (event) => {
                    console.info("📡 Global subscription received: ");
                    const parsed = JSON.parse(event.data);
                    // console.log(parsed);

                    if (userDetails.user_id === parsed?.data?.user_id) {
                        setNotifCount((prev) => prev + 1);
                    }
                }
            );
        };

        setup();

        return () => {
            if (subscription) {
                unsubscribeChannel("activity-screen-refresh");
            }
        };
    }, [userDetails]);

    return (
        <NotificationContext.Provider value={{ notifCount, setNotifCount }}>
            {children}
        </NotificationContext.Provider>
    );
}
