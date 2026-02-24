import { useState } from "react"

export function useRedemption() {
    const [redemptionCount, setRedemptionCount] = useState(0);
    const [refreshCarts, setRefreshCounts] = useState(false);

    return {
        redemptionCount,
        setRedemptionCount,
        refreshCarts,
        setRefreshCounts
    }
}