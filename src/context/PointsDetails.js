// ============================================
// Updated PointsDetailsProvider
// ============================================
import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { BASE_URL, processResponse } from '../config';
import { AuthContext } from './AuthContext';
import { subscribeToChannel, unsubscribeChannel } from '../lib/Websockets';

export const PointsDetailContext = createContext();

export function PointsDetailsProvider({ children }) {
    const { userInfo } = useContext(AuthContext);
    const [rewards, setRewards] = useState({ points: 0 });
    const isSubscribed = useRef(false); // Track subscription status

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
                .catch((error) => console.error(error));
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch when userInfo changes
    useEffect(() => {
        fetchPointsDetails();
    }, [userInfo]);

    // Subscribe to websocket events - ONLY ONCE
    useEffect(() => {
        if (!userInfo || isSubscribed.current) return;

        const channelName = "super-admin-dashboard-display";

        const setup = async () => {
            await subscribeToChannel(
                channelName,
                "refresh-dashboard-data",
                (event) => {
                    console.info("📡 Received from PointsDetails");
                    fetchPointsDetails();
                }
            );
            isSubscribed.current = true;
            console.log("✅ PointsDetailsProvider subscribed");
        };

        setup();

        return () => {
            if (isSubscribed.current) {
                unsubscribeChannel(channelName);
                isSubscribed.current = false;
                console.log("🛑 PointsDetailsProvider unsubscribed");
            }
        };
    }, [userInfo?.token]); // Only depend on token

    return (
        <PointsDetailContext.Provider value={{ rewards, refreshPoints: fetchPointsDetails }}>
            {children}
        </PointsDetailContext.Provider>
    );
}