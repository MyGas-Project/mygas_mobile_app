import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function ConnectionLoss({ onRetry }) {
    const { currentTheme, theme } = useTheme();
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.8));
    const [pulseAnim] = useState(new Animated.Value(1));
    const [isLoading, setIsLoading] = useState(false);
    const [spinAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        // Entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Pulse animation for the icon
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );
        pulseAnimation.start();

        return () => pulseAnimation.stop();
    }, []);

    const handleRetry = async () => {
        if (!isLoading) {
            setIsLoading(true);

            // Start spin animation
            const spinAnimation = Animated.loop(
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            );
            spinAnimation.start();

            try {
                // Ensure at least 3 seconds of loading
                await Promise.all([
                    onRetry(), // your retry logic (e.g., NetInfo check)
                    new Promise((resolve) => setTimeout(resolve, 3000)), // min loading duration
                ]);
            } catch (error) {
                console.log("Retry failed:", error);
            } finally {
                spinAnimation.stop();
                spinAnim.setValue(0);
                setIsLoading(false);
            }
        }
    };

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const styles = StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: currentTheme.connectionBg,
        },
        container: {
            flex: 1,
            backgroundColor: currentTheme.connectionBg,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        backgroundGradient: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: currentTheme.connectionBg,
            opacity: 0.95,
        },
        content: {
            alignItems: 'center',
            width: '100%',
            maxWidth: 400,
            backgroundColor: theme === 'light' ? currentTheme.connectionContentBg : 'transparent',
            borderRadius: theme === 'light' ? 20 : 0,
            paddingVertical: theme === 'light' ? 40 : 20,
            paddingHorizontal: theme === 'light' ? 30 : 10,
            elevation: theme === 'light' ? 8 : 0,
            shadowColor: theme === 'light' ? '#000' : 'transparent',
            shadowOffset: theme === 'light' ? { width: 0, height: 4 } : { width: 0, height: 0 },
            shadowOpacity: theme === 'light' ? 0.1 : 0,
            shadowRadius: theme === 'light' ? 10 : 0,
        },
        iconContainer: {
            marginBottom: 40,
        },
        wifiIcon: {
            width: 80,
            height: 80,
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
        },
        wifiBar: {
            position: 'absolute',
            backgroundColor: currentTheme.connectionIcon,
            borderRadius: 4,
        },
        bar1: {
            width: 60,
            height: 8,
            bottom: 20,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
        },
        bar2: {
            width: 45,
            height: 8,
            bottom: 32,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
        },
        bar3: {
            width: 30,
            height: 8,
            bottom: 44,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        },
        wifiSlash: {
            position: 'absolute',
            width: 4,
            height: 60,
            backgroundColor: currentTheme.connectionIcon,
            borderRadius: 2,
            transform: [{ rotate: '45deg' }],
        },
        title: {
            fontSize: width > 400 ? 32 : 28,
            fontWeight: 'bold',
            color: currentTheme.connectionTitle,
            textAlign: 'center',
            marginBottom: 12,
            letterSpacing: 0.5,
        },
        subtitle: {
            fontSize: width > 400 ? 18 : 16,
            color: currentTheme.connectionSubtitle,
            textAlign: 'center',
            marginBottom: 20,
            fontWeight: '600',
        },
        description: {
            fontSize: width > 400 ? 16 : 14,
            color: currentTheme.connectionDescription,
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 40,
            paddingHorizontal: 10,
        },
        retryButton: {
            backgroundColor: currentTheme.connectionButton,
            paddingVertical: 16,
            paddingHorizontal: 40,
            borderRadius: 30,
            elevation: 8,
            shadowColor: currentTheme.connectionButton,
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            marginBottom: 20,
            minWidth: 160,
        },
        retryButtonLoading: {
            backgroundColor: currentTheme.connectionButtonHover,
        },
        loadingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        spinner: {
            width: 20,
            height: 20,
            borderWidth: 2,
            borderColor: '#ffffff',
            borderTopColor: 'transparent',
            borderRadius: 10,
            marginRight: 10,
        },
        retryButtonText: {
            color: '#ffffff',
            fontSize: width > 400 ? 18 : 16,
            fontWeight: 'bold',
            textAlign: 'center',
            letterSpacing: 0.5,
        },
        decorativeElements: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: -1,
        },
        dot: {
            position: 'absolute',
            width: 6,
            height: 6,
            backgroundColor: currentTheme.decorativeDot,
            borderRadius: 3,
            opacity: theme === 'light' ? 0.3 : 0.4,
        },
        largeDot: {
            position: 'absolute',
            width: 12,
            height: 12,
            backgroundColor: currentTheme.decorativeLargeDot,
            borderRadius: 6,
            opacity: theme === 'light' ? 0.15 : 0.2,
        },
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                backgroundColor={currentTheme.connectionBg}
                barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
            />
            <View style={styles.container}>
                {/* Background gradient effect */}
                <View style={styles.backgroundGradient} />

                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* Connection Icon */}
                    <Animated.View
                        style={[
                            styles.iconContainer,
                            {
                                transform: [{ scale: pulseAnim }],
                            },
                        ]}
                    >
                        <View style={styles.wifiIcon}>
                            <View style={[styles.wifiBar, styles.bar1]} />
                            <View style={[styles.wifiBar, styles.bar2]} />
                            <View style={[styles.wifiBar, styles.bar3]} />
                            <View style={styles.wifiSlash} />
                        </View>
                    </Animated.View>

                    {/* Title */}
                    <Text style={styles.title}>Connection Lost</Text>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>
                        Unable to connect to the internet
                    </Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        Please check your network connection and try again. Make sure you're connected to Wi-Fi or mobile data.
                    </Text>

                    {/* Retry Button */}
                    <TouchableOpacity
                        style={[styles.retryButton, isLoading && styles.retryButtonLoading]}
                        onPress={handleRetry}
                        activeOpacity={0.8}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <Animated.View
                                    style={[
                                        styles.spinner,
                                        {
                                            transform: [{ rotate: spin }],
                                        },
                                    ]}
                                />
                                <Text style={styles.retryButtonText}>Connecting...</Text>
                            </View>
                        ) : (
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        )}
                    </TouchableOpacity>

                    {/* Decorative elements */}
                    <View style={styles.decorativeElements}>
                        <View style={[styles.dot, { left: '20%', top: 20 }]} />
                        <View style={[styles.dot, { right: '15%', top: 60 }]} />
                        <View style={[styles.dot, { left: '10%', bottom: 100 }]} />
                        <View style={[styles.dot, { right: '25%', bottom: 150 }]} />
                        <View style={[styles.largeDot, { left: '5%', top: '30%' }]} />
                        <View style={[styles.largeDot, { right: '8%', bottom: '25%' }]} />
                    </View>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}