import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { BASE_URL, processResponse } from '../config';
import { AuthContext } from './AuthContext';
import { subscribeToChannel, unsubscribeChannel } from '../lib/Websockets';
import { useRedemption } from '../hooks/RedemptionHooks';

export const PointsDetailContext = createContext();

export function PointsDetailsProvider({ children }) {
    const { userInfo } = useContext(AuthContext);
    const [rewards, setRewards] = useState({ points: 0 });
    const isSubscribed = useRef(false); // Track subscription status
    const isSubscribed2 = useRef(false);

    const {
        redemptionCount,
        setRedemptionCount,
        refreshCarts,
        setRefreshCounts
    } = useRedemption();

    const getRedemptionCount = async () => {
        try {
            const response = await fetch(`${BASE_URL}customer/get-count-pending-redemption`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userInfo?.token}`,
                    },
                });

            const { data, statusCode } = await processResponse(response);
            // console.log("data from redemption count: ", data.data);
            if (statusCode == 200) {
                setRedemptionCount(data.data.pending_redemption_count);
            }
        } catch (error) {
            console.error("Error fetching redemption count: ", error);
        } finally {

        }
    }

    // useEffect(() => {
    //     getRedemptionCount();
    // }, []);

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
        getRedemptionCount();
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

    // useEffect(() => {
    //     if (!userInfo || isSubscribed2.current) return;
    //     const channelName = "cancel-redemption";
    //     const setup = async () => {
    //         // await subscribeToChannel(
    //         //     channelName,
    //         //     "refresh-cancel-redemption",
    //         //     (event) => {
    //         //         console.info("📡 Received from PointsDetails socket Cancel Redemption");
    //         //     }
    //         // );
    //         // isSubscribed2.current = true;
    //         // console.log("✅ Cancel Redemption subscribed");
    //         try {
    //             console.log("Attempting to subscribe cancel-redemption...");
    //             await subscribeToChannel(
    //                 channelName,
    //                 "refresh-cancel-redemption",
    //                 (event) => {
    //                     console.info("📡 Received Cancel Redemption");
    //                 }
    //             );
    //             isSubscribed2.current = true;
    //             console.log("✅ Cancel Redemption subscribed");
    //         } catch (err) {
    //             console.error("❌ Cancel Redemption subscription failed:", err);
    //         }
    //     };

    //     setup();

    //     return () => {
    //         if (isSubscribed2.current) {
    //             unsubscribeChannel(channelName);
    //             isSubscribed2.current = false;
    //             console.log("🛑 Cancel Redemption unsubscribed");
    //         }
    //     };
    // }, [userInfo?.token]);

    return (
        <PointsDetailContext.Provider value={{ rewards, refreshPoints: fetchPointsDetails, redemptionCount, setRedemptionCount, getRedemptionCount, cartRefreshTrigger: refreshCarts }}>
            {children}
        </PointsDetailContext.Provider>
    );
}