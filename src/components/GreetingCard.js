import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SkeletonBox } from "./HomeComponents";

export default function GreetingCard({ userDetails, navigation }) {
  return (
    <View style={styles.greetingCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.greetingText}>Good Day,</Text>
        {!userDetails?.first_name ? (
          <SkeletonBox width={200} height={22} style={{ marginBottom: 4 }} />
        ) : (
          <Text style={styles.nameText}>
            {userDetails?.last_name}, {userDetails?.first_name}{" "}
            {userDetails?.middle_name ? userDetails.middle_name.charAt(0) + "." : ""}
          </Text>
        )}
        <Text style={styles.subtitleText}>Welcome back! 🎉</Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("ScanScreen")}
        style={styles.qrButton}
        activeOpacity={0.8}
      >
        <LinearGradient colors={["#FFD93D", "#E0B820"]} style={styles.qrGradient}>
          <Ionicons name="qr-code-outline" size={28} color="#000" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

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
  greetingText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 13,
    color: "#666",
  },
  qrButton: {
    marginLeft: 16,
  },
  qrGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#E0B820",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
