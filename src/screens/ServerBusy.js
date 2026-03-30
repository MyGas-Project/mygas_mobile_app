import { StyleSheet, Text, View, Dimensions, StatusBar, Animated, Easing } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

export default function ServerBusy() {
    const [dots, setDots] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const startTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    useEffect(() => {
        // Fade + slide in
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();

        // Pulse dot
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            ])
        ).start();

        // Animated dots
        const interval = setInterval(() => {
            setDots(d => d.length >= 3 ? '' : d + '.');
        }, 600);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Full-bleed diagonal stripes */}
            <View style={styles.stripesOverlay} pointerEvents="none">
                <View style={styles.stripesInner}>
                    {Array.from({ length: 60 }).map((_, i) => (
                        <View key={i} style={styles.stripe} />
                    ))}
                </View>
            </View>

            <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

                {/* Badge */}
                <View style={styles.badge}>
                    <Animated.View style={[styles.badgeDot, { opacity: pulseAnim }]} />
                    <Text style={styles.badgeText}>SYSTEM NOTICE</Text>
                </View>

                {/* Warning card */}
                <View style={styles.warningCard}>
                    <Text style={styles.warningIcon}>⚠</Text>
                    <Text style={styles.warningText}>Server is currently unavailable</Text>
                </View>

                {/* Headline */}
                <View style={styles.headlineBlock}>
                    <Text style={styles.headlineTop}>WE'LL BE</Text>
                    <Text style={styles.headlineBottom}>RIGHT BACK</Text>
                </View>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <View style={styles.dividerDiamond} />
                    <View style={styles.dividerLine} />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    We're currently performing scheduled maintenance to improve your experience.
                    Our team is working hard to get everything back online as soon as possible.
                </Text>

                {/* Info block */}
                <View style={styles.infoBlock}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoDot} />
                        <Text style={styles.infoText}>Expected duration: 2–4 hours</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoDot} />
                        <Text style={styles.infoText}>Started: Today at {startTime}</Text>
                    </View>
                </View>

                {/* Status cards */}
                <View style={styles.cards}>
                    <View style={[styles.card, { backgroundColor: '#dc2626' }]}>
                        <Text style={[styles.cardLabel, { color: 'rgba(255,255,255,0.6)' }]}>STATUS</Text>
                        <Text style={[styles.cardValue, { color: '#ffffff' }]}>BUSY{dots}</Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: '#fbbf24' }]}>
                        <Text style={[styles.cardLabel, { color: '#92400e' }]}>DOWNTIME</Text>
                        <Text style={[styles.cardValue, { color: '#1c1917' }]}>2–4 HRS</Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#e5e7eb' }]}>
                        <Text style={[styles.cardLabel, { color: '#9f1239' }]}>SUPPORT</Text>
                        <Text style={[styles.cardValue, { color: '#dc2626' }]}>CONTACT US</Text>
                    </View>
                </View>

                <Text style={styles.footerText}>Thank you for your patience and understanding</Text>
            </Animated.View>
        </View>
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
        // Extend well beyond screen in all directions so rotated stripes cover edges
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
    container: {
        alignItems: 'center',
        paddingHorizontal: isTablet ? 60 : 24,
        paddingVertical: 48,
        maxWidth: isTablet ? 600 : width,
        width: '100%',
        gap: 22,
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
    },

    // Headline
    headlineBlock: {
        alignItems: 'center',
    },
    headlineTop: {
        fontSize: isTablet ? 96 : 64,
        fontWeight: '900',
        letterSpacing: 6,
        color: '#111827',
        lineHeight: isTablet ? 84 : 56,
        textAlign: 'center',
    },
    headlineBottom: {
        fontSize: isTablet ? 96 : 64,
        fontWeight: '900',
        letterSpacing: 6,
        color: '#dc2626',
        lineHeight: isTablet ? 84 : 56,
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
    },
    infoText: {
        fontFamily: 'monospace',
        fontSize: 11,
        fontWeight: '500',
        color: '#374151',
    },

    // Cards
    cards: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        maxWidth: 420,
    },
    card: {
        flex: 1,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 16,
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
        marginBottom: 7,
    },
    cardValue: {
        fontFamily: 'monospace',
        fontSize: 11,
        fontWeight: '500',
    },

    footerText: {
        fontSize: 11,
        color: '#9ca3af',
        fontStyle: 'italic',
        textAlign: 'center',
    },
});