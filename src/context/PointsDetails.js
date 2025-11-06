import React, { createContext, useContext, useEffect, useState } from 'react'
import { BASE_URL, processResponse } from '../config';
import { AuthContext } from './AuthContext';


export const PointsDetailContext = createContext();

export function PointsDetailsProvider({ children }) {
    const { userInfo } = useContext(AuthContext);
    const [rewards, setRewards] = useState(null);

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

    // Subscribe to websocket events
    useEffect(() => {
        let subscription;
        const setup = async () => {
            subscription = await subscribeToChannel(
                "super-admin-dashboard-display",
                "refresh-dashboard-data",
                (event) => {
                    console.info("📡 Received from HelperDetails");
                    fetchPointsDetails();
                }
            );
        };

        setup();

        return () => {
            if (subscription) unsubscribeChannel(subscription);
        };
    }, [userInfo]);

    return (
        <PointsDetailContext.Provider value={{ rewards }}>
            {children}
        </PointsDetailContext.Provider>
    );
}
