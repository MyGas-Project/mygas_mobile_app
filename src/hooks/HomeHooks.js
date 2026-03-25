import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { useTheme } from "../context/ThemeContext";

// Extracted so it can be called on mount AND on every refresh
function startAnimations({
    giftScale, giftRotate,
    ripple1Scale, ripple1Opacity,
    ripple2Scale, ripple2Opacity,
    pinY, clockRotate, glowScale,
}) {
    // Stop any running animations first to avoid stacking
    [giftScale, giftRotate, ripple1Scale, ripple1Opacity,
        ripple2Scale, ripple2Opacity, pinY, clockRotate, glowScale]
        .forEach((v) => v.stopAnimation());

    // Reset values
    giftScale.setValue(1);
    giftRotate.setValue(0);
    ripple1Scale.setValue(0.7);
    ripple1Opacity.setValue(0.7);
    ripple2Scale.setValue(0.7);
    ripple2Opacity.setValue(0.7);
    pinY.setValue(0);
    clockRotate.setValue(0);
    glowScale.setValue(1);

    // Gift pop + wiggle
    Animated.loop(
        Animated.sequence([
            Animated.parallel([
                Animated.timing(giftScale, { toValue: 1.15, duration: 200, useNativeDriver: true }),
                Animated.timing(giftRotate, { toValue: -6, duration: 200, useNativeDriver: true }),
            ]),
            Animated.timing(giftRotate, { toValue: 6, duration: 200, useNativeDriver: true }),
            Animated.parallel([
                Animated.timing(giftScale, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(giftRotate, { toValue: 0, duration: 200, useNativeDriver: true }),
            ]),
            Animated.delay(1200),
        ])
    ).start();

    // Ripple 1
    Animated.loop(
        Animated.parallel([
            Animated.timing(ripple1Scale, { toValue: 1.7, duration: 2000, useNativeDriver: true }),
            Animated.timing(ripple1Opacity, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
    ).start();

    // Ripple 2 (delayed)
    setTimeout(() => {
        Animated.loop(
            Animated.parallel([
                Animated.timing(ripple2Scale, { toValue: 1.7, duration: 2000, useNativeDriver: true }),
                Animated.timing(ripple2Opacity, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    }, 600);

    // Pin bounce
    Animated.loop(
        Animated.sequence([
            Animated.timing(pinY, { toValue: -8, duration: 300, useNativeDriver: true }),
            Animated.timing(pinY, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(pinY, { toValue: -4, duration: 200, useNativeDriver: true }),
            Animated.timing(pinY, { toValue: 0, duration: 150, useNativeDriver: true }),
            Animated.delay(800),
        ])
    ).start();

    // Clock spin
    Animated.loop(
        Animated.timing(clockRotate, { toValue: 1, duration: 6000, useNativeDriver: true })
    ).start();

    // Glow pulse
    Animated.loop(
        Animated.sequence([
            Animated.timing(glowScale, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
            Animated.timing(glowScale, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
    ).start();
}

export function useHomeData() {
    const [rewardsInfo, setRewardsInfo] = useState([]);
    const { styles } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showFlashDetails, setShowFlashDetails] = useState(false);
    const [stationCount, setStationCount] = useState(0);
    const [products, setProducts] = useState([]);

    const giftScale = useRef(new Animated.Value(1)).current;
    const giftRotate = useRef(new Animated.Value(0)).current;
    const pinY = useRef(new Animated.Value(0)).current;
    const clockRotate = useRef(new Animated.Value(0)).current;
    const glowScale = useRef(new Animated.Value(1)).current;
    const ripple1Scale = useRef(new Animated.Value(0.7)).current;
    const ripple1Opacity = useRef(new Animated.Value(0.7)).current;
    const ripple2Scale = useRef(new Animated.Value(0.7)).current;
    const ripple2Opacity = useRef(new Animated.Value(0.7)).current;

    const animationRefs = {
        giftScale, giftRotate,
        ripple1Scale, ripple1Opacity,
        ripple2Scale, ripple2Opacity,
        pinY, clockRotate, glowScale,
    };

    // Start on mount
    useEffect(() => {
        startAnimations(animationRefs);
    }, []);

    // Call this after a refresh completes to restart animations
    const restartAnimations = () => startAnimations(animationRefs);

    return {
        rewardsInfo, setRewardsInfo,
        styles,
        refreshing, setRefreshing,
        isLoading, setIsLoading,
        showFlashDetails, setShowFlashDetails,
        stationCount, setStationCount,
        products, setProducts,
        giftScale, giftRotate,
        pinY, clockRotate, glowScale,
        ripple1Scale, ripple1Opacity,
        ripple2Scale, ripple2Opacity,
        restartAnimations,
    };
}