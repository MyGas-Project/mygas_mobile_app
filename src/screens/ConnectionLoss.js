import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
    Easing,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function ConnectionLoss({ onRetry }) {
    const { currentTheme, theme } = useTheme();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const spinAnim = useRef(new Animated.Value(0)).current;
    const badgeDotAnim = useRef(new Animated.Value(1)).current;

    const [isLoading, setIsLoading] = useState(false);
    const startTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    useEffect(() => {
        // Fade + slide in
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();

        // Pulse badge dot
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(badgeDotAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
                Animated.timing(badgeDotAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            ])
        );
        pulse.start();

        // Pulse wifi icon
        const iconPulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.08, duration: 1400, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
            ])
        );
        iconPulse.start();

        return () => {
            pulse.stop();
            iconPulse.stop();
        };
    }, []);

    const handleRetry = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const spinLoop = Animated.loop(
            Animated.timing(spinAnim, {
                toValue: 1,
                duration: 900,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        spinLoop.start();

        try {
            await Promise.all([
                onRetry(),
                new Promise(resolve => setTimeout(resolve, 3000)),
            ]);
        } catch (e) {
            console.log('Retry failed:', e);
        } finally {
            spinLoop.stop();
            spinAnim.setValue(0);
            setIsLoading(false);
        }
    };

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <SafeAreaView style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Full-bleed diagonal stripes */}
            <View style={styles.stripesOverlay} pointerEvents="none">
                <View style={styles.stripesInner}>
                    {Array.from({ length: 60 }).map((_, i) => (
                        <View key={i} style={styles.stripe} />
                    ))}
                </View>
            </View>

            <Animated.View
                style={[
                    styles.container,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}
            >
                {/* Badge */}
                <View style={styles.badge}>
                    <Animated.View style={[styles.badgeDot, { opacity: badgeDotAnim }]} />
                    <Text style={styles.badgeText}>NETWORK NOTICE</Text>
                </View>

                {/* Warning card */}
                <View style={styles.warningCard}>
                    <Text style={styles.warningIcon}>⚠</Text>
                    <Text style={styles.warningText}>Unable to connect to the internet</Text>
                </View>

                {/* Headline */}
                <View style={styles.headlineBlock}>
                    <Text style={styles.headlineTop}>CONNECTION</Text>
                    <Text style={styles.headlineBottom}>LOST</Text>
                </View>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <View style={styles.dividerDiamond} />
                    <View style={styles.dividerLine} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Please check your network connection and try again. Make sure you're connected to Wi-Fi or mobile data.
                </Text>

                {/* Info block */}
                <View style={styles.infoBlock}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoDot} />
                        <Text style={styles.infoText}>Check Wi-Fi or mobile data settings</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoDot} />
                        <Text style={styles.infoText}>Last attempt: Today at {startTime}</Text>
                    </View>
                </View>

                {/* Status cards */}
                <View style={styles.cards}>
                    <View style={[styles.card, { backgroundColor: '#dc2626' }]}>
                        <Text style={[styles.cardLabel, { color: 'rgba(255,255,255,0.6)' }]}>STATUS</Text>
                        <Text style={[styles.cardValue, { color: '#ffffff' }]}>OFFLINE</Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: '#fbbf24' }]}>
                        <Text style={[styles.cardLabel, { color: '#92400e' }]}>SIGNAL</Text>
                        <Text style={[styles.cardValue, { color: '#1c1917' }]}>NO DATA</Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#e5e7eb' }]}>
                        <Text style={[styles.cardLabel, { color: '#9f1239' }]}>TYPE</Text>
                        <Text style={[styles.cardValue, { color: '#dc2626' }]}>WI-FI / LTE</Text>
                    </View>
                </View>

                {/* Retry button */}
                <TouchableOpacity
                    style={[styles.retryButton, isLoading && styles.retryButtonLoading]}
                    onPress={handleRetry}
                    activeOpacity={0.85}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <View style={styles.retryInner}>
                            <Animated.View
                                style={[styles.spinner, { transform: [{ rotate: spin }] }]}
                            />
                            <Text style={styles.retryText}>Connecting...</Text>
                        </View>
                    ) : (
                        <Text style={styles.retryText}>Try Again</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.footerText}>Check your connection and try again</Text>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    // Stripes
    stripesOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
    },
    stripesInner: {
        position: 'absolute',
        top: -500,
        left: -500,
        right: -500,
        bottom: -500,
        flexDirection: 'column',
        transform: [{ rotate: '-35deg' }],
    },
    stripe: {
        height: 28,
        marginBottom: 28,
        backgroundColor: 'rgba(220,38,38,0.045)',
    },

    // Main container
    container: {
        alignItems: 'center',
        paddingHorizontal: isTablet ? 60 : 24,
        paddingVertical: 48,
        maxWidth: isTablet ? 600 : width,
        width: '100%',
        gap: 22,
        zIndex: 10,
    },

    // Badge
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fef9c3',
        borderWidth: 2,
        borderColor: '#fbbf24',
        borderRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 5,
    },
    badgeDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#dc2626',
    },
    badgeText: {
        fontFamily: 'monospace',
        fontSize: 10,
        fontWeight: '500',
        letterSpacing: 2,
        color: '#92400e',
    },

    // Warning card
    warningCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#fbbf24',
        borderWidth: 2,
        borderColor: '#f59e0b',
        borderRadius: 6,
        paddingHorizontal: 20,
        paddingVertical: 11,
        width: '100%',
        maxWidth: 420,
    },
    warningIcon: {
        fontSize: 14,
        color: '#1c1917',
    },
    warningText: {
        fontFamily: 'monospace',
        fontSize: 11,
        fontWeight: '500',
        letterSpacing: 1,
        color: '#1c1917',
        flexShrink: 1,
    },

    // Headline
    headlineBlock: {
        alignItems: 'center',
    },
    headlineTop: {
        fontSize: isTablet ? 95 : 50,
        fontWeight: '900',
        letterSpacing: 5,
        color: '#111827',
        lineHeight: isTablet ? 84 : 54,
        textAlign: 'center',
    },
    headlineBottom: {
        fontSize: isTablet ? 96 : 60,
        fontWeight: '900',
        letterSpacing: 6,
        color: '#dc2626',
        lineHeight: isTablet ? 84 : 64,
        textAlign: 'center',
    },

    // Divider
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        maxWidth: 380,
    },
    dividerLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#dc2626',
        opacity: 0.4,
    },
    dividerDiamond: {
        width: 8,
        height: 8,
        backgroundColor: '#fbbf24',
        borderWidth: 2,
        borderColor: '#dc2626',
        transform: [{ rotate: '45deg' }],
    },

    // Description
    description: {
        fontSize: 13,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: 380,
    },

    // Info block
    infoBlock: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: '#f9fafb',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        paddingHorizontal: 22,
        paddingVertical: 18,
        gap: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#dc2626',
        flexShrink: 0,
    },
    infoText: {
        fontFamily: 'monospace',
        fontSize: 11,
        fontWeight: '500',
        color: '#374151',
    },

    // Status cards
    cards: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        maxWidth: 420,
    },
    card: {
        flex: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    cardLabel: {
        fontFamily: 'monospace',
        fontSize: 9,
        letterSpacing: 2,
        fontWeight: '500',
        marginBottom: 6,
    },
    cardValue: {
        fontFamily: 'monospace',
        fontSize: 10,
        fontWeight: '500',
    },

    // Retry button
    retryButton: {
        backgroundColor: '#dc2626',
        borderRadius: 6,
        paddingVertical: 14,
        paddingHorizontal: 40,
        width: '100%',
        maxWidth: 420,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#b91c1c',
    },
    retryButtonLoading: {
        backgroundColor: '#b91c1c',
    },
    retryInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    spinner: {
        width: 16,
        height: 16,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
        borderTopColor: '#ffffff',
        borderRadius: 8,
    },
    retryText: {
        fontFamily: 'monospace',
        fontSize: 13,
        fontWeight: '500',
        color: '#ffffff',
        letterSpacing: 1.5,
    },

    footerText: {
        fontSize: 11,
        color: '#9ca3af',
        fontStyle: 'italic',
        textAlign: 'center',
    },
});