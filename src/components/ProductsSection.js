import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const getRewardStyle = (type) => {
  const map = {
    CASH: { color: "#FF6B6B", icon: "cash-outline" },
    DISCOUNT: { color: "#4ECDC4", icon: "pricetag-outline" },
    SERVICE: { color: "#FFD93D", icon: "construct-outline" },
    VOUCHER: { color: "#95E1D3", icon: "ticket-outline" },
    DEFAULT: { color: "#A8A8A8", icon: "gift-outline" },
  };
  return map[type] || map["DEFAULT"];
};

function ProductCard({ item, index }) {
  return (
    <TouchableOpacity
      style={[styles.rewardCard, { marginLeft: index === 0 ? 20 : 0 }]}
      onPress={() => console.log("Product selected:", item.name)}
      activeOpacity={0.9}
      disabled={item.quantity === 0}
    >
      <View style={styles.rewardImageContainer}>
        <Image
          source={item.image ? { uri: item.image } : require("../../assets/motorista.png")}
          style={styles.rewardImage}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.imageGradient}
        />
        {item.isWeeklyPromo && (
          <View style={[styles.categoryBadge, { backgroundColor: "#FF6B6B" }]}>
            <Ionicons name="flash" size={12} color="#FFF" />
          </View>
        )}
        {item.quantity === 0 && (
          <View style={styles.inactiveBadge}>
            <Text style={styles.inactiveText}>Out of Stock</Text>
          </View>
        )}
        {item.quantity > 0 && item.quantity < 10 && (
          <View style={[styles.inactiveBadge, { backgroundColor: "rgba(255, 152, 0, 0.9)" }]}>
            <Text style={styles.inactiveText}>Low Stock</Text>
          </View>
        )}
      </View>

      <View style={styles.rewardContent}>
        <Text style={styles.rewardTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.rewardDescription} numberOfLines={2}>{item.description}</Text>

        {item.stationNames && (
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Ionicons name="location" size={10} color="#999" />
            <Text style={{ fontSize: 10, color: "#999", marginLeft: 4 }} numberOfLines={1}>
              {item.stationNames}
            </Text>
          </View>
        )}

        <View style={styles.rewardFooter}>
          <View style={styles.pointsBadge}>
            <Ionicons name="star" size={12} color="#E0B820" />
            <Text style={styles.pointsText}>
              {item.originalPoints ? (
                <>
                  <Text style={{ textDecorationLine: "line-through", color: "#999" }}>
                    {item.originalPoints}
                  </Text>
                  {" "}{item.points}
                </>
              ) : (
                item.points
              )}{" "}pts
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {item.quantity > 0 ? (
              <>
                <Text style={styles.learnMore}>Redeem</Text>
                <Ionicons name="arrow-forward" size={16} color="#E0B820" />
              </>
            ) : (
              <Text style={[styles.learnMore, { color: "#999" }]}>Unavailable</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ProductsSection({ products }) {
  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Products</Text>
            <Text style={styles.sectionSubtitle}>Exclusive products for redemption ✨</Text>
          </View>
          <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={18} color="#E0B820" />
          </TouchableOpacity>
        </View>
      </View>

      {products?.length > 0 ? (
        <FlatList
          style={styles.rewardsList}
          data={products}
          renderItem={({ item, index }) => <ProductCard item={item} index={index} />}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
          ListEmptyComponent={() => <EmptyProducts />}
        />
      ) : (
        <EmptyProducts />
      )}
    </>
  );
}

function EmptyProducts() {
  return (
    <View style={styles.emptyRewards}>
      <Ionicons name="gift-outline" size={48} color="#CCC" />
      <Text style={styles.emptyText}>No products available</Text>
      <Text style={styles.emptySubtext}>Check back later for exciting offers!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#999",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 13,
    color: "#E0B820",
    fontWeight: "600",
    marginRight: 4,
  },
  rewardsList: {
    marginBottom: 8,
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
  rewardImageContainer: {
    position: "relative",
    height: 160,
  },
  rewardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  inactiveBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inactiveText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
  },
  rewardContent: {
    padding: 16,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6,
  },
  rewardDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 12,
  },
  rewardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#E0B820",
    marginLeft: 4,
  },
  learnMore: {
    fontSize: 13,
    color: "#E0B820",
    fontWeight: "600",
  },
  emptyRewards: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 40,
    marginLeft: 20,
    backgroundColor: "#FFF",
    borderRadius: 20,
    width: width - 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },
});
