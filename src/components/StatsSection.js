import React from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StatsSection({
  rewardsInfo,
  stationCount,
  giftScale,
  giftRotateDeg,
  ripple1Scale,
  ripple1Opacity,
  ripple2Scale,
  ripple2Opacity,
  pinY,
  glowScale,
  clockDeg,
}) {
  return (
    <View style={styles.statsContainer}>
      {/* Rewards */}
      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: "#FFE5E5" }]}>
          <Animated.View style={{
            position: "absolute", width: "100%", height: "100%", borderRadius: 24,
            backgroundColor: "rgba(226,75,74,0.22)",
            transform: [{ scale: ripple1Scale }], opacity: ripple1Opacity,
          }} />
          <Animated.View style={{
            position: "absolute", width: "100%", height: "100%", borderRadius: 24,
            backgroundColor: "rgba(226,75,74,0.22)",
            transform: [{ scale: ripple2Scale }], opacity: ripple2Opacity,
          }} />
          <Animated.View style={{ transform: [{ scale: giftScale }, { rotate: giftRotateDeg }] }}>
            <Ionicons name="gift-outline" size={24} color="#FF6B6B" />
          </Animated.View>
        </View>
        <Text style={styles.statValue}>{rewardsInfo?.length ?? "0"}</Text>
        <Text style={styles.statLabel}>Rewards</Text>
      </View>

      {/* Stations */}
      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: "#E5F5FF", overflow: "visible" }]}>
          <Animated.View style={{ transform: [{ translateY: pinY }] }}>
            <Ionicons name="location-outline" size={24} color="#4ECDC4" />
          </Animated.View>
          <Animated.View style={{
            position: "absolute", bottom: 2, alignSelf: "center",
            width: 16, height: 4, borderRadius: 4, backgroundColor: "rgba(78,205,196,0.3)",
          }} />
        </View>
        <Text style={styles.statValue}>{stationCount ?? "0"}</Text>
        <Text style={styles.statLabel}>Stations</Text>
      </View>

      {/* Activities */}
      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: "#FFF5E5" }]}>
          <Animated.View style={{
            position: "absolute", width: "100%", height: "100%", borderRadius: 24,
            borderWidth: 2, borderColor: "rgba(239,159,39,0.45)",
            transform: [{ scale: glowScale }],
          }} />
          <Animated.View style={{ transform: [{ rotate: clockDeg }] }}>
            <Ionicons name="time-outline" size={24} color="#FFD93D" />
          </Animated.View>
        </View>
        <Text style={styles.statValue}>0</Text>
        <Text style={styles.statLabel}>Activities</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
  },
});
