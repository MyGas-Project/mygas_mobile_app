import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUniqueCartCount } from "../lib/CartCountHelper";

const { width } = Dimensions.get("window");

// Responsive breakpoints
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768;

const getResponsiveValue = (small, medium, tablet) => {
    if (isSmallDevice) return small;
    if (isMediumDevice) return medium;
    return tablet;
};

export default function CartComponent({ cartCount }) {
    const [cartItemCount, setCartItemCount] = useState(0);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const handleCartPress = () => {
        navigation.navigate("CartScreens");
    };

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                if (cartCount !== null && cartCount !== undefined && cartCount > 0) {
                    setCartItemCount(cartCount);
                } else {
                    const count = await getUniqueCartCount();
                    setCartItemCount(count);
                }
            } catch (error) {
                console.error("Error fetching cart count:", error);
            }
        };

        fetchCartCount();
    }, [cartCount]);

    const displayCount = cartCount && cartCount > 0 ? cartCount : cartItemCount || 0;

    // Calculate bottom position dynamically based on safe area insets
    const bottomPosition = insets.bottom + getResponsiveValue(85, 85, 100);

    return (
        <View style={[styles.container, { bottom: bottomPosition }]}>
            <TouchableOpacity
                style={styles.cartButton}
                onPress={handleCartPress}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={["#EF4444", "#DC2626"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <Ionicons
                        name="cart"
                        size={getResponsiveValue(24, 26, 28)}
                        color="#fff"
                    />
                </LinearGradient>

                {/* Badge positioned outside gradient */}
                {displayCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {displayCount > 99 ? "99+" : displayCount}
                        </Text>
                    </View>
                )}

                {/* Pulse animation ring */}
                <View style={styles.pulseRing} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: getResponsiveValue(20, 24, 32),
        zIndex: 999,
    },
    cartButton: {
        width: getResponsiveValue(70, 60, 64),
        height: getResponsiveValue(70, 60, 64),
        borderRadius: getResponsiveValue(35, 30, 32),
        position: 'relative',
        ...Platform.select({
            ios: {
                shadowColor: '#EF4444',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    gradient: {
        width: '100%',
        height: '100%',
        borderRadius: getResponsiveValue(35, 30, 32),
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#F59E0B',
        minWidth: getResponsiveValue(24, 24, 26),
        height: getResponsiveValue(24, 24, 26),
        borderRadius: getResponsiveValue(12, 12, 13),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        borderWidth: 3,
        borderColor: '#fff',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    badgeText: {
        color: '#fff',
        fontSize: getResponsiveValue(11, 11, 12),
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    pulseRing: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: getResponsiveValue(35, 30, 32),
        borderWidth: 2,
        borderColor: '#EF4444',
        opacity: 0.2,
    },
});