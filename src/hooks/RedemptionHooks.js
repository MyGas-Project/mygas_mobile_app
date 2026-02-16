import { useState } from "react"

export function useRedemption() {
    const [redemptionCount, setRedemptionCount] = useState(1);

    return {
        redemptionCount,
        setRedemptionCount
    }
}