import React from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";
import { SkeletonBox } from "./HomeComponents";


const { width } = Dimensions.get("window");

export default function PointsCard({ userDetails, rewards, cardScale }) {
  return (
    <Animated.View style={[styles.pointsCardWrapper, { transform: [{ scale: cardScale }], backgroundColor: "transparent" }]}>
      <ImageBackground
        source={
          userDetails?.availment_id == 3
            ? require("../../assets/diamond_card.png")
            : require("../../assets/regular_card.png")
        }
        resizeMode="contain"
        style={[styles.pointsCard, { backgroundColor: "transparent" }]}
        blurRadius={1.45}
      >
        {/* Floating Particles Overlay */}
        <View style={styles.cardOverlay}>
          <View style={styles.floatingDot1} />
          <View style={styles.floatingDot2} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.pointsSection}>
            <View style={styles.pointsDisplay}>
              {rewards?.points !== undefined && rewards?.points !== null ? (
                <>
                  <Text style={styles.pointsNumber}>{rewards.points}</Text>
                  <View style={styles.ptsLabel}>
                    <Text style={styles.ptsText}>PTS</Text>
                  </View>
                </>
              ) : (
                <>
                  <SkeletonBox width={120} height={42} style={{ marginRight: 8 }} />
                  <SkeletonBox width={60} height={30} style={{ borderRadius: 12 }} />
                </>
              )}
            </View>

            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={12} color="#666" />
                {userDetails?.created_at ? (
                  <Text style={styles.detailText}>
                    {new Date(userDetails.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                ) : (
                  <SkeletonBox width={100} height={11} style={{ marginLeft: 6 }} />
                )}
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="trophy-outline" size={12} color="#666" />
                {userDetails?.points !== undefined && userDetails?.points !== null ? (
                  <Text style={styles.detailText}>Earned: {userDetails.points} pts</Text>
                ) : (
                  <SkeletonBox width={100} height={11} style={{ marginLeft: 6 }} />
                )}
              </View>
            </View>
          </View>

          {userDetails?.bar_code ? (
            <Text style={styles.cardNumber}>•••• •••• ••• {userDetails.bar_code.slice(-3)}</Text>
          ) : (
            <SkeletonBox width={180} height={14} />
          )}
        </View>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingDot1: {
    position: "absolute",
    top: 30,
    right: 40,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(224, 184, 32, 0.3)",
  },
  floatingDot2: {
    position: "absolute",
    bottom: 60,
    left: 40,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 217, 61, 0.2)",
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
  pointsNumber: {
    color: "#966919",
    fontWeight: "900",
    fontSize: 42,
    letterSpacing: -1,
    textShadowColor: "#000",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1,
  },
  ptsLabel: {
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  ptsText: {
    color: "#E0B820",
    fontSize: 14,
    fontWeight: "500",
  },
  cardDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    color: "#666",
    fontSize: 11,
    marginLeft: 6,
  },
  cardNumber: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
  },
});
