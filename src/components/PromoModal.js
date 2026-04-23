import {
    Modal,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Animated,
    Dimensions,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function PromoModal({ promoVisibility, setPromoVisibility }) {
    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const badgeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (promoVisibility) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 60,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 280,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                Animated.spring(badgeAnim, {
                    toValue: 1,
                    tension: 80,
                    friction: 5,
                    useNativeDriver: true,
                }).start();
            });
        } else {
            scaleAnim.setValue(0.85);
            opacityAnim.setValue(0);
            badgeAnim.setValue(0);
        }
    }, [promoVisibility]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            presentationStyle="overFullScreen"
            visible={promoVisibility}
            onRequestClose={() => setPromoVisibility(false)}
        >
            {/* Backdrop */}
            <View style={styles.backdrop}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={() => setPromoVisibility(false)}
                />

                <Animated.View
                    style={[
                        styles.card,
                        {
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {/* ── Header Image ── */}
                    <View style={styles.imageContainer}>
                        <LinearGradient
                            colors={['#FF6B00', '#FF9A00']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.imageGradient}
                        >
                            {/* Replace uri with your actual asset */}
                            <Image
                                source={{ uri: 'https://placehold.co/400x200/FF6B00/ffffff?text=⛽+MyGas' }}
                                style={styles.headerImage}
                                resizeMode="cover"
                            />

                            {/* Diagonal shine overlay */}
                            <View style={styles.shineOverlay} />

                            {/* Floating badge */}
                            <Animated.View
                                style={[
                                    styles.badge,
                                    {
                                        transform: [
                                            {
                                                scale: badgeAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, 1],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <Text style={styles.badgeText}>LIMITED</Text>
                            </Animated.View>
                        </LinearGradient>
                    </View>

                    {/* ── Content ── */}
                    <View style={styles.content}>

                        {/* Tag */}
                        <View style={styles.tagRow}>
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>🔥 PROMO OF THE WEEK</Text>
                            </View>
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>Extra Mile{'\n'}Rewards</Text>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Promo detail */}
                        <Text style={styles.description}>
                            Fill up <Text style={styles.highlight}>₱500 or more</Text> on Shell V-Power and earn{' '}
                            <Text style={styles.highlight}>3× motorista points</Text> — redeemable for fuel credits, merchandise, and more.
                        </Text>

                        {/* Stats row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>3×</Text>
                                <Text style={styles.statLabel}>Points</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>₱500</Text>
                                <Text style={styles.statLabel}>Min. Fill-up</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>7d</Text>
                                <Text style={styles.statLabel}>Left</Text>
                            </View>
                        </View>

                        {/* CTA */}
                        <TouchableOpacity
                            activeOpacity={0.88}
                            onPress={() => setPromoVisibility(false)}
                        >
                            <LinearGradient
                                colors={['#FF6B00', '#FF9A00']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.ctaButton}
                            >
                                <Text style={styles.ctaText}>Claim Promo  →</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Dismiss */}
                        <TouchableOpacity
                            onPress={() => setPromoVisibility(false)}
                            style={styles.dismissBtn}
                            activeOpacity={0.6}
                        >
                            <Text style={styles.dismissText}>Maybe later</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Close X */}
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => setPromoVisibility(false)}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                        <Text style={styles.closeIcon}>✕</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}

const CARD_WIDTH = Math.min(width - 48, 360);

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(10, 10, 15, 0.72)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* ── Card ── */
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#FF6B00',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 20,
    },

    /* ── Header Image ── */
    imageContainer: {
        height: 180,
        width: '100%',
    },
    imageGradient: {
        flex: 1,
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    shineOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.08)',
        transform: [{ skewX: '-20deg' }, { translateX: -20 }],
    },

    /* ── Floating Badge ── */
    badge: {
        position: 'absolute',
        top: 14,
        left: 14,
        backgroundColor: '#1A1A2E',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    badgeText: {
        color: '#FF9A00',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
    },

    /* ── Close ── */
    closeBtn: {
        position: 'absolute',
        top: 12,
        right: 14,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },

    /* ── Content ── */
    content: {
        paddingHorizontal: 22,
        paddingTop: 18,
        paddingBottom: 22,
    },

    tagRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    tag: {
        backgroundColor: '#FFF3E6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    tagText: {
        color: '#FF6B00',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.8,
    },

    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0D0D0D',
        lineHeight: 34,
        letterSpacing: -0.5,
        marginBottom: 14,
    },

    divider: {
        height: 2,
        width: 36,
        backgroundColor: '#FF6B00',
        borderRadius: 2,
        marginBottom: 14,
    },

    description: {
        fontSize: 14,
        color: '#555566',
        lineHeight: 21,
        marginBottom: 18,
    },
    highlight: {
        color: '#FF6B00',
        fontWeight: '700',
    },

    /* ── Stats ── */
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#F9F9FB',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 10,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0D0D0D',
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 11,
        color: '#9999AA',
        fontWeight: '600',
        marginTop: 2,
        letterSpacing: 0.3,
    },
    statDivider: {
        width: 1,
        height: 36,
        backgroundColor: '#E8E8EE',
    },

    /* ── CTA ── */
    ctaButton: {
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 12,
    },
    ctaText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.3,
    },

    /* ── Dismiss ── */
    dismissBtn: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    dismissText: {
        color: '#AAAABC',
        fontSize: 13,
        fontWeight: '500',
    },
});