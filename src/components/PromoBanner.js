import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const PromoHeader = ({ showViewAll, onViewAll }) => (
  <View style={styles.promoHeader}>
    <View style={styles.promoHeaderText}>
      <Text style={styles.promoHeaderTitle}>Promo Campaigns</Text>
      <Text style={styles.promoHeaderSubtitle}>Claim bonus rewards ✨</Text>
    </View>
    {showViewAll && (
      <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll} activeOpacity={0.7}>
        <Text style={styles.viewAllText}>View All</Text>
        <Ionicons name="chevron-forward" size={16} color="#E0B820" />
      </TouchableOpacity>
    )}
  </View>
);

export const getRewardLabel = (campaign) => {
  if (campaign.reward_type === "points") {
    const points = campaign.reward_config?.config?.points;
    return points != null ? `+${points} Points` : "Bonus Points";
  }
  return campaign.reward_type ? String(campaign.reward_type).replace(/_/g, " ") : "Reward";
};

export default function PromoBanner({ campaigns = [], onClaim, onViewAll }) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [claimingId, setClaimingId] = useState(null);
  const cardWidth = width - 40;

  const handleClaim = async (campaign) => {
    if (claimingId !== null) return;
    setClaimingId(campaign.id);
    try {
      await onClaim?.(campaign);
    } finally {
      setClaimingId(null);
    }
  };

  if (!campaigns.length) {
    return (
      <>
        <PromoHeader showViewAll={false} />
        <View style={[styles.promoBanner, styles.promoBannerEmpty]}>
          <View style={styles.promoEmptyContent}>
            <Ionicons name="pricetag-outline" size={36} color="#CCC" />
            <Text style={styles.promoEmptyTitle}>No Active Promo Offers </Text>
            <Text style={styles.promoEmptyText}>Check back later for exciting deals! 🎉</Text>
          </View>
        </View>
      </>
    );
  }

  const hasMultiple = campaigns.length > 1;

  return (
    <>
      <PromoHeader showViewAll onViewAll={onViewAll} />

      <View style={styles.promoBanner}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) =>
            setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / cardWidth))
          }
        >
          {campaigns.map((campaign) => {
            const isClaiming = claimingId === campaign.id;
            const canClaim = campaign.remaining_claims > 0;

            return (
              <LinearGradient
                key={campaign.id}
                colors={["#E0B820", "#F5D45E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.promoCard, { width: cardWidth }, hasMultiple && styles.promoCardWithDots]}
              >
                <View style={styles.promoInfo}>
                  <Text style={styles.promoName} numberOfLines={2}>{campaign.name}</Text>
                  {!!campaign.description && (
                    <Text style={styles.promoDescription} numberOfLines={2}>{campaign.description}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.claimButton, !canClaim && styles.claimButtonDisabled]}
                  onPress={() => handleClaim(campaign)}
                  disabled={!canClaim || claimingId !== null}
                  activeOpacity={0.8}
                >
                  {isClaiming ? (
                    <ActivityIndicator size="small" color="#F5D45E" />
                  ) : (
                    <Text style={styles.claimButtonText}>{canClaim ? "Claim" : "Claimed"}</Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            );
          })}
        </ScrollView>

        {hasMultiple && (
          <View style={styles.promoDots}>
            {campaigns.map((campaign, index) => (
              <View
                key={campaign.id}
                style={[styles.promoDot, index === activeIndex && styles.promoDotActive]}
              />
            ))}
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  promoBanner: {
    marginHorizontal: 20,
    marginTop: 0,
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
  promoCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  promoCardWithDots: {
    paddingBottom: 30,
  },
  promoInfo: {
    flex: 1,
    marginRight: 10,
  },
  promoName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3A2E00",
  },
  promoDescription: {
    fontSize: 12,
    color: "#5C4A00",
    marginTop: 2,
  },
  promoDots: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  promoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(58,46,0,0.3)",
    marginHorizontal: 3,
  },
  promoDotActive: {
    backgroundColor: "#3A2E00",
    width: 16,
  },
  promoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  promoHeaderText: {
    flex: 1,
    marginRight: 10,
  },
  promoHeaderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  promoHeaderSubtitle: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF6D6",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E0B820",
    marginRight: 2,
  },
  claimButton: {
    minWidth: 76,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#3A2E00",
    alignItems: "center",
    justifyContent: "center",
  },
  claimButtonDisabled: {
    opacity: 0.45,
  },
  claimButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F5D45E",
  },
});

