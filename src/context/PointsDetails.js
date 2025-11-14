import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { BASE_URL, processResponse } from '../config';
import { AuthContext } from './AuthContext';
import { subscribeToChannel, unsubscribeChannel } from '../lib/Websockets';


export const PointsDetailContext = createContext();

export function PointsDetailsProvider({ children }) {
    const { userInfo } = useContext(AuthContext);
    const [rewards, setRewards] = useState(null);
    const channelRef = useRef(null); // Track channel subscription

    const fetchPointsDetails = async () => {
        if (!userInfo) return;
        try {
            await fetch(`${BASE_URL}customer/user-total-points`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            })
                .then(processResponse)
                .then((res) => {
                    const { statusCode, data } = res;
                    console.log("🔄 Points updated:", data);
                    setRewards(data);
                })
                .catch((error) => console.error("❌ Fetch points error:", error));
        } catch (error) {
            console.error("❌ Fetch points error:", error);
        }
    };

    // Fetch when userInfo changes
    useEffect(() => {
        fetchPointsDetails();
    }, [userInfo]);

    // Subscribe to websocket events
    useEffect(() => {
        if (!userInfo) return; // Don't subscribe if no user

        const channelName = "super-admin-dashboard-display";

        const setup = async () => {
            try {
                // Unsubscribe from previous channel if exists
                if (channelRef.current) {
                    await unsubscribeChannel(channelName);
                    channelRef.current = null;
                }

                // Subscribe to channel
                const subscription = await subscribeToChannel(
                    channelName,
                    "refresh-dashboard-data",
                    (event) => {
                        console.info("📡 Received event from Pusher:", event.eventName);
                        fetchPointsDetails();
                    }
                );

                channelRef.current = subscription;
                console.log("✅ Subscribed to Pusher channel:", channelName);
            } catch (error) {
                console.error("❌ Failed to setup Pusher subscription:", error);
            }
        };

        setup();

        // Cleanup on unmount or userInfo change
        return () => {
            if (channelRef.current) {
                unsubscribeChannel(channelName)
                    .then(() => {
                        console.log("🛑 Unsubscribed from Pusher on cleanup");
                        channelRef.current = null;
                    })
                    .catch(err => console.error("❌ Unsubscribe error:", err));
            }
        };
    }, [userInfo]);

    return (
        <PointsDetailContext.Provider value={{ rewards, fetchPointsDetails }}>
            {children}
        </PointsDetailContext.Provider>
    );
}