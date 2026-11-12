import React, { useCallback, useContext, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Animated,
    Dimensions,
    StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL, processResponse } from "../../config";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Same responsive scaling as NewsScreen
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;

const scale = (size) => {
    if (isSmallDevice) return size * 0.9;
    if (isMediumDevice) return size;
    return size * 1.05;
};

export default function PromoCampaignScreen({ navigation, route }) {
    const { userInfo } = useContext(AuthContext);
    const highlightId = route.params?.highlightId ?? null;
    const initialCampaigns = route.params?.campaigns ?? [];

    const [campaigns, setCampaigns] = useState(initialCampaigns);
    const [loading, setLoading] = useState(initialCampaigns.length === 0);
    const [refreshing, setRefreshing] = useState(false);
    const [claimingId, setClaimingId] = useState(null);

    const scrollY = useRef(new Animated.Value(0)).current;
    const cardContainerTranslateY = scrollY.interpolate({
        inputRange: [-50, 0, 50],
        outputRange: [20, 0, -20],
        extrapolate: "clamp",
    });

    const fetchCampaigns = useCallback(async () => {
        try {
            const res = await fetch(`${BASE_URL}customer/get-available-campaigns`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo?.token}`,
                },
            }).then(processResponse);

            if (res.statusCode === 200 && res.data?.success && Array.isArray(res.data.data)) {
                setCampaigns(res.data.data);
            }
        } catch (error) {
            console.error("PromoCampaigns fetch error:", error);
        } finally {
            setLoading(false);
        }
    }, [userInfo?.token]);

    useFocusEffect(
        useCallback(() => {
            fetchCampaigns();
        }, [fetchCampaigns])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCampaigns();
        setRefreshing(false);
    };

    // Put the campaign the user tapped "Claim" on at the top
    const data = useMemo(() => {
        if (highlightId == null) return campaigns;
        return [...campaigns].sort(
            (a, b) => Number(b.id === highlightId) - Number(a.id === highlightId)
        );
    }, [campaigns, highlightId]);

    const handleClaim = async (campaign) => {
        if (claimingId !== null) return;
        setClaimingId(campaign.id);
        try {
            // TODO: call the claim API here, then refresh:
            // await fetchCampaigns();
            console.log("Claim campaign:", campaign.id, campaign.name);
        } finally {
            setClaimingId(null);
        }
    };

    const renderCampaignCard = (item, index) => {
        const isClaiming = claimingId === item.id;
        const canClaim = item.remaining_claims > 0;
        const isHighlighted = item.id === highlightId;

        return (
            <View
                key={String(item.id)}
                style={[
                    styles.card,
                    isHighlighted && styles.cardHighlighted,
                    { marginBottom: index === data.length - 1 ? scale(24) : scale(16) },
                ]}
            >
                {/* Content */}
                <View style={styles.cardContent}>
                    <View style={styles.cardTop}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="gift" size={scale(22)} color="#E0B820" />
                        </View>

                        <View style={styles.cardTextWrap}>
                            <Text style={styles.cardTitle} numberOfLines={2}>
                                {item.name}
                            </Text>
                            {!!item.description && (
                                <Text style={styles.cardDescription} numberOfLines={3}>
                                    {item.description}
                                </Text>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.claimButton, !canClaim && styles.claimButtonDisabled]}
                        onPress={() => handleClaim(item)}
                        disabled={!canClaim || claimingId !== null}
                        activeOpacity={0.8}
                    >
                        {isClaiming ? (
                            <ActivityIndicator size="small" color="#F5D45E" />
                        ) : (
                            <>
                                {!canClaim && (
                                    <Ionicons name="checkmark-circle" size={18} color="#F5D45E" />
                                )}
                                <Text style={styles.claimButtonText}>{canClaim ? "Claim" : "Claimed"}</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header is provided by BottomNavigation */}

            {/* Main Content */}
            <Animated.View
                style={[styles.mainContent, { transform: [{ translateY: cardContainerTranslateY }] }]}
            >
                {/* Soft warm background (decorative only) */}
                <View style={styles.backgroundLayer} pointerEvents="none">
                    <LinearGradient
                        colors={["#FFF6D6", "#FBFAF3", "#F8F9FA"]}
                        locations={[0, 0.35, 1]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.bgCircleTop} />
                    <View style={styles.bgCircleBottom} />
                </View>

                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#E0B820"
                            colors={["#E0B820"]}
                            progressViewOffset={20}
                        />
                    }
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Title section */}
                    <View style={styles.headerSection}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.sectionTitle}>Promo Campaigns</Text>
                            <View style={styles.titleUnderline} />
                        </View>
                        <Text style={styles.subtitle}>
                            Claim bonus rewards and exclusive promos to get the most out of every visit ✨
                        </Text>
                    </View>

                    {/* Cards */}
                    <View style={styles.listContainer}>
                        {loading ? (
                            <View style={styles.loadingState}>
                                <ActivityIndicator size="large" color="#E0B820" />
                                <Text style={styles.loadingText}>Loading promos...</Text>
                            </View>
                        ) : data.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="pricetag-outline" size={64} color="#CCC" />
                                <Text style={styles.emptyText}>No Active Promo Offers</Text>
                                <Text style={styles.emptySubtext}>Check back later for exciting deals! 🎉</Text>
                            </View>
                        ) : (
                            data.map((item, index) => renderCampaignCard(item, index))
                        )}
                    </View>
                </Animated.ScrollView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    mainContent: {
        flex: 1,
        marginTop: -30,
        backgroundColor: "#F8F9FA",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position: "relative",
        zIndex: 1,
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFillObject,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden", // clips only the decorative background
    },
    bgCircleTop: {
        position: "absolute",
        top: -scale(70),
        right: -scale(60),
        width: scale(220),
        height: scale(220),
        borderRadius: scale(110),
        backgroundColor: "rgba(224,184,32,0.14)",
    },
    bgCircleBottom: {
        position: "absolute",
        bottom: scale(120),
        left: -scale(90),
        width: scale(200),
        height: scale(200),
        borderRadius: scale(100),
        backgroundColor: "rgba(224,184,32,0.08)",
    },
    scrollContent: {
        paddingBottom: 100, // clears the tab bar, same as HomeScreen
    },
    headerSection: {
        alignItems: "center",
        paddingHorizontal: scale(20),
        paddingTop: scale(24),
        paddingBottom: scale(16),
    },
    titleContainer: {
        alignItems: "center",
        marginBottom: scale(12),
    },
    sectionTitle: {
        fontSize: scale(26),
        fontWeight: "700",
        color: "#222",
        letterSpacing: -0.5,
    },
    titleUnderline: {
        width: scale(60),
        height: 3,
        backgroundColor: "#E0B820",
        borderRadius: 2,
        marginTop: scale(8),
    },
    subtitle: {
        fontSize: scale(13),
        textAlign: "center",
        color: "#666",
        lineHeight: scale(20),
        maxWidth: SCREEN_WIDTH - scale(60),
    },
    listContainer: {
        paddingHorizontal: scale(20),
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: scale(15),
        borderWidth: 2,
        borderColor: "#F6EFD2", // same width as the highlight border, so cards don't shift
        shadowColor: "#8A6D00",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 4,
    },
    cardHighlighted: {
        borderColor: "#E0B820",
        backgroundColor: "#FFFDF3",
    },
    cardContent: {
        padding: scale(18),
    },
    cardTop: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: scale(18),
    },
    iconCircle: {
        width: scale(48),
        height: scale(48),
        borderRadius: scale(24),
        backgroundColor: "#FFF6D6",
        borderWidth: 1.5,
        borderColor: "rgba(224,184,32,0.35)",
        alignItems: "center",
        justifyContent: "center",
    },
    cardTextWrap: {
        flex: 1,
        marginLeft: scale(14),
    },
    cardTitle: {
        fontSize: scale(17),
        fontWeight: "700",
        color: "#222",
        lineHeight: scale(23),
    },
    cardDescription: {
        fontSize: scale(13.5),
        color: "#6B6B6B",
        lineHeight: scale(20),
        marginTop: scale(4),
    },
    claimButton: {
        height: scale(46),
        borderRadius: scale(10),
        backgroundColor: "#3A2E00",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    claimButtonDisabled: {
        opacity: 0.45,
    },
    claimButtonText: {
        fontSize: scale(14),
        fontWeight: "700",
        color: "#F5D45E",
        letterSpacing: 0.3,
    },
    loadingState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: scale(60),
    },
    loadingText: {
        marginTop: scale(16),
        fontSize: scale(14),
        color: "#666",
        fontWeight: "500",
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: scale(60),
    },
    emptyText: {
        fontSize: scale(18),
        fontWeight: "600",
        color: "#666",
        marginTop: scale(16),
    },
    emptySubtext: {
        fontSize: scale(14),
        color: "#999",
        marginTop: scale(8),
    },
});