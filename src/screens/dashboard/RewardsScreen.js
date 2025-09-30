import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Navbar from "../../components/Navbar";

import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL, processResponse } from "../../config";
import { PointsDetailContext } from "../../context/PointsDetails";

export default function RewardsScreen() {
  const { userInfo, userDetails } = useContext(AuthContext);
  const { rewards } = useContext(PointsDetailContext);
  const [blog, setBlogs] = useState(null);
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const cardContainerTranslateY = scrollY.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: [20, 0, -20],
    extrapolate: "clamp",
  });

  const getBlogs = () => {
    try {
      fetch(`${BASE_URL}customer/get-rewards`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      })
        .then(processResponse)
        .then((res) => {
          const { data, statusCode } = res;
          setBlogs(data.result);
        }).catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  function groupByCategory(items) {
    return items.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item.data);
      return acc;
    }, {});
  }

  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["rgb(249, 250, 141)", "transparent"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.4 }}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        <Image
          source={require("../../../assets/mygas_logo.png")}
          style={styles.logo}
        />
        <Navbar
          hideBack
          onProfilePress={() => console.log("Profile tapped")}
          onNotifPress={() => console.log("Notifications tapped")}
        />
      </ImageBackground>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.cardContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Rewards</Text>
            <Text style={styles.subtitle}>
              Fuel Your Savings: Earn Points, Unlock Perks, and Enjoy Exclusive
              Rewards with Every Visit!
            </Text>
          </View>

          <View style={styles.pointsBox}>
            <Text style={styles.pointsLabel}>Total MyGas Points</Text>
            <View style={styles.pointsRow}>
              <Image
                source={require("../../../assets/my.png")}
                style={styles.mygasIcon}
              />
              <Text style={styles.pointsValue}>{rewards?.points || 0}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            MyGas Motorista Card Member Benefits
          </Text>

          {blog ? (
            Object.entries(groupByCategory(blog)).map(([type, items], index) => (
              <View key={index} style={styles.categorySection}>
                <View style={styles.rewardsRow}>
                  <Text style={styles.sectionTitle}>{type}</Text>
                  <TouchableOpacity>
                    <Text style={styles.viewAll}>View All Rewards ›</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.gridContainer}>
                  {items.slice(0, 4).map((item, idx) => (
                    <View key={item.id?.toString() || idx.toString()} style={styles.rewardCardNew}>
                      <Image
                        source={
                          item.image
                            ? { uri: item.image }
                            : require("../../../assets/image.png")
                        }
                        style={styles.cardImageNew}
                      />
                      <View style={styles.contentNew}>
                        <View style={styles.titlePointsRowNew}>
                          <Text style={styles.cardTextNew} numberOfLines={2}>
                            {item?.title || "n/a"}
                          </Text>
                          <View style={styles.pointsRowNew}>
                            <Image
                              source={require("../../../assets/my.png")}
                              style={styles.miniIconNew}
                            />
                            <Text style={styles.cardPointsNew}>123 PTS</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("RewardDetails", { details: item })}
                          style={styles.redeemBtnNew}
                        >
                          <Text style={styles.redeemTextNew}>Redeem Now</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>

                {items.length > 4 && (
                  <TouchableOpacity
                    style={styles.viewMoreButton}
                    onPress={() => navigation.navigate("CategoryRewards", {
                      category: type,
                      items: items
                    })}
                  >
                    <Text style={styles.viewMoreText}>
                      View More ({items.length - 4} more items)
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  top_bar: {
    height: 150,
    width: "100%",
    position: "relative",
  },
  scrollContainer: {
    flex: 1,
    marginTop: -20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Add extra padding for tab bar
  },
  cardContainer: {
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
    minHeight: '100%',
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#777",
    paddingHorizontal: 20,
  },
  pointsBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 6,
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  pointsLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mygasIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    marginRight: 4,
  },
  pointsValue: {
    color: "#f39c12",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  categorySection: {
    marginBottom: 20,
  },
  rewardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAll: {
    color: "#666",
    fontSize: 13,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rewardCardNew: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: '48%',
    overflow: "hidden",
    marginBottom: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardImageNew: {
    width: "100%",
    height: 110,
    resizeMode: "cover",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contentNew: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  titlePointsRowNew: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTextNew: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
    flex: 1,
    marginRight: 6,
  },
  pointsRowNew: {
    flexDirection: "row",
    alignItems: "center",
  },
  miniIconNew: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    marginRight: 2,
  },
  cardPointsNew: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#f39c12",
  },
  redeemBtnNew: {
    backgroundColor: "#FF0000",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  redeemTextNew: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
  viewMoreButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF0000",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  viewMoreText: {
    color: "#FF0000",
    fontSize: 14,
    fontWeight: "600",
  },
  logo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -40 }, { translateY: -40 }],
    width: 65,
    height: 65,
    resizeMode: "contain",
    zIndex: 2,
  },
});