import { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";

const { width } = Dimensions.get("window");

// ─── Base Skeleton Box ────────────────────────────────────────────────────────
export const SkeletonBox = ({ width: w, height, style }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(animatedValue, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const opacity = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

    return (
        <Animated.View
            style={[{ width: w, height, backgroundColor: "#E1E9EE", borderRadius: 8, opacity }, style]}
        />
    );
};

// ─── Skeleton Cards ───────────────────────────────────────────────────────────
export const GreetingCardSkeleton = () => (
    <View style={styles.greetingCard}>
        <View style={{ flex: 1 }}>
            <SkeletonBox width={80} height={14} style={{ marginBottom: 8 }} />
            <SkeletonBox width={200} height={22} style={{ marginBottom: 8 }} />
            <SkeletonBox width={120} height={13} />
        </View>
        <SkeletonBox width={56} height={56} style={{ borderRadius: 28 }} />
    </View>
);

export const PointsCardSkeleton = () => (
    <View style={styles.pointsCardWrapper}>
        <View style={[styles.pointsCard, { backgroundColor: "#E1E9EE", borderRadius: 20 }]}>
            <View style={[styles.cardContent, { justifyContent: "space-between" }]}>
                <View style={styles.pointsSection}>
                    <View style={styles.pointsDisplay}>
                        <SkeletonBox width={120} height={42} style={{ marginRight: 8 }} />
                        <SkeletonBox width={60} height={30} style={{ borderRadius: 12 }} />
                    </View>
                    <View style={styles.cardDetails}>
                        <SkeletonBox width={140} height={11} style={{ marginBottom: 8 }} />
                        <SkeletonBox width={120} height={11} />
                    </View>
                </View>
                <SkeletonBox width={180} height={14} />
            </View>
        </View>
    </View>
);

export const StatsCardSkeleton = () => (
    <View style={styles.statsContainer}>
        {[1, 2, 3].map((item) => (
            <View key={item} style={styles.statCard}>
                <SkeletonBox width={48} height={48} style={{ borderRadius: 24, marginBottom: 8 }} />
                <SkeletonBox width={40} height={24} style={{ marginBottom: 4 }} />
                <SkeletonBox width={60} height={12} />
            </View>
        ))}
    </View>
);

export const RewardCardSkeleton = () => (
    <View style={[styles.rewardCard, { marginLeft: 20 }]}>
        <SkeletonBox width={280} height={160} />
        <View style={styles.rewardContent}>
            <SkeletonBox width={200} height={18} style={{ marginBottom: 8 }} />
            <SkeletonBox width={260} height={13} style={{ marginBottom: 4 }} />
            <SkeletonBox width={240} height={13} style={{ marginBottom: 12 }} />
            <SkeletonBox width={100} height={13} />
        </View>
    </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    greetingCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        marginHorizontal: 20,
        marginTop: 20,
        padding: 20,
        borderRadius: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    pointsCardWrapper: {
        alignItems: "center",
        marginVertical: 24,
        paddingHorizontal: 20,
    },
    pointsCard: {
        width: width - 15,
        aspectRatio: 1.58,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    cardContent: {
        flex: 1,
        padding: 24,
        justifyContent: "space-between",
    },
    pointsSection: {
        marginTop: 70,
    },
    pointsDisplay: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    cardDetails: {
        marginTop: 8,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 16,
        marginHorizontal: 4,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    rewardCard: {
        backgroundColor: "#FFF",
        borderRadius: 20,
        width: 280,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        overflow: "hidden",
    },
    rewardContent: {
        padding: 16,
    },
});