import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PromoBanner() {
  return (
    <View style={[styles.promoBanner, styles.promoBannerEmpty]}>
      <View style={styles.promoEmptyContent}>
        <Ionicons name="pricetag-outline" size={36} color="#CCC" />
        <Text style={styles.promoEmptyTitle}>No Active Promo Offers</Text>
        <Text style={styles.promoEmptyText}>Check back later for exciting deals! 🎉</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  promoBanner: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  promoBannerEmpty: {
    backgroundColor: "#FFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
  },
  promoEmptyContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  promoEmptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#999",
    marginTop: 10,
    marginBottom: 4,
  },
  promoEmptyText: {
    fontSize: 12,
    color: "#BBB",
    textAlign: "center",
  },
});
