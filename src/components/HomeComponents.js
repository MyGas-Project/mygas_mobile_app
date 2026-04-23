import { View, StyleSheet, Dimensions } from "react-native";
import { SkeletonGroup } from "heroui-native";

const { width } = Dimensions.get("window");

// ─── Greeting Card Skeleton ───────────────────────────────────────────────────
export const GreetingCardSkeleton = () => (
    <View style={styles.greetingCard}>
        <SkeletonGroup
            isLoading
            variant="shimmer"
            animation={{ shimmer: { duration: 1600, highlightColor: "rgba(255,255,255,0.55)" } }}
            className="flex-1 gap-2"
        >
            <SkeletonGroup.Item className="h-3.5 w-20 rounded-md" />
            <SkeletonGroup.Item className="h-6 w-52 rounded-md" />
            <SkeletonGroup.Item className="h-3 w-28 rounded-md" />
        </SkeletonGroup>

        <SkeletonGroup
            isLoading
            variant="shimmer"
            animation={{ shimmer: { duration: 1600, highlightColor: "rgba(255,255,255,0.55)" } }}
        >
            <SkeletonGroup.Item className="h-14 w-14 rounded-full" />
        </SkeletonGroup>
    </View>
);

// ─── Points Card Skeleton ─────────────────────────────────────────────────────
export const PointsCardSkeleton = () => (
    <View style={styles.pointsCardWrapper}>
        <View style={styles.pointsCard}>
            <SkeletonGroup
                isLoading
                variant="shimmer"
                animation={{ shimmer: { duration: 1800, highlightColor: "rgba(255,255,255,0.3)" } }}
                className="flex-1 p-6 justify-between"
            >
                {/* Top-left logo placeholder */}
                <SkeletonGroup.Item className="h-5 w-24 rounded-md" />

                {/* Points amount + badge row */}
                <View style={styles.pointsDisplay}>
                    <SkeletonGroup.Item className="h-11 w-32 rounded-lg" />
                    <View style={{ width: 10 }} />
                    <SkeletonGroup.Item className="h-8 w-16 rounded-xl" />
                </View>

                {/* Sub-label lines */}
                <View style={{ gap: 6 }}>
                    <SkeletonGroup.Item className="h-3 w-40 rounded-md" />
                    <SkeletonGroup.Item className="h-3 w-32 rounded-md" />
                </View>

                {/* Bottom expiry line */}
                <SkeletonGroup.Item className="h-3.5 w-48 rounded-md" />
            </SkeletonGroup>
        </View>
    </View>
);

// ─── Stats Card Skeleton ──────────────────────────────────────────────────────
export const StatsCardSkeleton = () => (
    <View style={styles.statsContainer}>
        {[1, 2, 3].map((item) => (
            <View key={item} style={styles.statCard}>
                <SkeletonGroup
                    isLoading
                    variant="shimmer"
                    animation={{ shimmer: { duration: 1600, highlightColor: "rgba(255,255,255,0.55)" } }}
                    className="items-center gap-2"
                >
                    <SkeletonGroup.Item className="h-12 w-12 rounded-full" />
                    <SkeletonGroup.Item className="h-6 w-10 rounded-md" />
                    <SkeletonGroup.Item className="h-3 w-16 rounded-md" />
                </SkeletonGroup>
            </View>
        ))}
    </View>
);

// ─── Reward Card Skeleton ─────────────────────────────────────────────────────
export const RewardCardSkeleton = () => (
    <View style={[styles.rewardCard, { marginLeft: 20 }]}>
        <SkeletonGroup
            isLoading
            variant="shimmer"
            animation={{ shimmer: { duration: 1800, highlightColor: "rgba(255,255,255,0.5)" } }}
            className="gap-2"
        >
            {/* Thumbnail */}
            <SkeletonGroup.Item className="h-40 w-full rounded-t-2xl" />

            {/* Content block */}
            <View style={styles.rewardContent}>
                <SkeletonGroup.Item className="h-5 w-52 rounded-md mb-2" />
                <SkeletonGroup.Item className="h-3 w-64 rounded-md mb-1" />
                <SkeletonGroup.Item className="h-3 w-60 rounded-md mb-3" />
                <SkeletonGroup.Item className="h-3 w-28 rounded-md" />
            </View>
        </SkeletonGroup>
    </View>
);

// ─── Section Header Skeleton ──────────────────────────────────────────────────
export const SectionHeaderSkeleton = () => (
    <View style={styles.sectionHeader}>
        <SkeletonGroup
            isLoading
            variant="shimmer"
            animation={{ shimmer: { duration: 1600, highlightColor: "rgba(255,255,255,0.55)" } }}
            className="gap-1 flex-1"
        >
            <SkeletonGroup.Item className="h-5 w-32 rounded-md" />
            <SkeletonGroup.Item className="h-3 w-44 rounded-md" />
        </SkeletonGroup>

        <SkeletonGroup isLoading variant="shimmer">
            <SkeletonGroup.Item className="h-9 w-20 rounded-full" />
        </SkeletonGroup>
    </View>
);

// ─── Promo Banner Skeleton ────────────────────────────────────────────────────
export const PromoBannerSkeleton = () => (
    <View style={styles.promoBannerSkeleton}>
        <SkeletonGroup
            isLoading
            variant="shimmer"
            animation={{ shimmer: { duration: 1800, highlightColor: "rgba(255,255,255,0.45)" } }}
            className="flex-row items-center gap-4 p-5"
        >
            <SkeletonGroup.Item className="h-10 w-10 rounded-full" />
            <View style={{ flex: 1, gap: 6 }}>
                <SkeletonGroup.Item className="h-4 w-36 rounded-md" />
                <SkeletonGroup.Item className="h-3 w-52 rounded-md" />
            </View>
        </SkeletonGroup>
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
        gap: 12,
    },
    pointsCardWrapper: {
        alignItems: "center",
        marginVertical: 24,
        paddingHorizontal: 20,
    },
    pointsCard: {
        width: width - 40,
        aspectRatio: 1.58,
        backgroundColor: "#E1E9EE",
        borderRadius: 20,
        overflow: "hidden",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    pointsDisplay: {
        flexDirection: "row",
        alignItems: "center",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 24,
        gap: 8,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 16,
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
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    promoBannerSkeleton: {
        marginHorizontal: 20,
        marginTop: 8,
        marginBottom: 24,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#E1E9EE",
    },
});