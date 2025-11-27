// ============================================
// UPDATED CART COUNT HELPERS
// ============================================
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper function to get unique cart count (based on unique products)
export const getUniqueCartCount = async () => {
    try {
        const storedCartItems = await AsyncStorage.getItem("cartItems");
        if (storedCartItems) {
            const cartItems = JSON.parse(storedCartItems);
            // Return the number of unique products
            return cartItems.length;
        }
        return 0;
    } catch (error) {
        console.error("Error getting unique cart count:", error);
        return 0;
    }
};

// Helper function to add or update cart item
export const updateCartItem = async (productId) => {
    try {
        const storedCartItems = await AsyncStorage.getItem("cartItems");
        let cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];

        // Check if product already exists
        const existingIndex = cartItems.findIndex(id => id === productId);

        if (existingIndex === -1) {
            // New product - add to array
            cartItems.push(productId);
            await AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));
            return { isNewItem: true, count: cartItems.length };
        }

        // Product already exists - don't increment
        return { isNewItem: false, count: cartItems.length };
    } catch (error) {
        console.error("Error updating cart item:", error);
        return { isNewItem: false, count: 0 };
    }
};

// Helper function to remove cart item
export const removeCartItem = async (productId) => {
    try {
        const storedCartItems = await AsyncStorage.getItem("cartItems");
        let cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];

        cartItems = cartItems.filter(id => id !== productId);
        await AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));

        return cartItems.length;
    } catch (error) {
        console.error("Error removing cart item:", error);
        return 0;
    }
};

// Helper function to clear all cart items
export const clearAllCartItems = async () => {
    try {
        await AsyncStorage.removeItem("cartItems");
        return 0;
    } catch (error) {
        console.error("Error clearing cart items:", error);
        return 0;
    }
};
