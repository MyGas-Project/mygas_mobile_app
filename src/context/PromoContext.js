import { createContext, useContext, useEffect, useState } from "react";
import PromoModal from "../components/PromoModal";
import { AuthContext } from "./AuthContext";

export const PromoContext = createContext();

export const PromoProvider = ({ children }) => {
    const { userInfo, userDetails } = useContext(AuthContext);
    const [promoVisibility, setPromoVisibility] = useState(false);
    
    // Check if user is logged in
    // Logic to show the promo alert
    // useEffect(() => {
    //     if (userInfo && userDetails) {
    //         setTimeout(() => {
    //             setPromoVisibility(true);
    //         }, 5000);
    //     } else {
    //         setPromoVisibility(false);
    //     }

    // }, [userInfo, userDetails]);

    return (
        <PromoContext.Provider value={{}}>
            <PromoModal promoVisibility={promoVisibility} setPromoVisibility={setPromoVisibility} />
            {children}
        </PromoContext.Provider>
    );
};