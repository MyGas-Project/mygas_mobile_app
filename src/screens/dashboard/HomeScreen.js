import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Animated,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import Navbar from "../../components/Navbar";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL, processResponse } from "../../config";
import { subscribeToChannel, unsubscribeChannel, Websockets } from "../../lib/Websockets";
import { Pusher } from "@pusher/pusher-websocket-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { PointsDetailContext } from "../../context/PointsDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashUserDetails from "./components/FlashUserDetails";
import GetStationsLists from "../../service/Stations";
import GuestRewardsComponent from "../../components/guest/GuestRewardsComponent";
import GuestBanner from "../../components/guest/GuestBanner";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

// Skeleton Loader Components
const SkeletonBox = ({ width, height, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: "#E1E9EE",
          borderRadius: 8,
          opacity,
        },
        style,
      ]}
    />
  );
};

const GreetingCardSkeleton = () => (
  <View style={custom_styles.greetingCard}>
    <View style={{ flex: 1 }}>
      <SkeletonBox width={80} height={14} style={{ marginBottom: 8 }} />
      <SkeletonBox width={200} height={22} style={{ marginBottom: 8 }} />
      <SkeletonBox width={120} height={13} />
    </View>
    <SkeletonBox width={56} height={56} style={{ borderRadius: 28 }} />
  </View>
);

const PointsCardSkeleton = () => (
  <View style={custom_styles.pointsCardWrapper}>
    <View
      style={[
        custom_styles.pointsCard,
        { backgroundColor: "#E1E9EE", borderRadius: 20 },
      ]}
    >
      <View style={[custom_styles.cardContent, { justifyContent: "space-between" }]}>
        <View style={custom_styles.pointsSection}>
          <View style={custom_styles.pointsDisplay}>
            <SkeletonBox width={120} height={42} style={{ marginRight: 8 }} />
            <SkeletonBox width={60} height={30} style={{ borderRadius: 12 }} />
          </View>
          <View style={custom_styles.cardDetails}>
            <SkeletonBox width={140} height={11} style={{ marginBottom: 8 }} />
            <SkeletonBox width={120} height={11} />
          </View>
        </View>
        <SkeletonBox width={180} height={14} />
      </View>
    </View>
  </View>
);

const StatsCardSkeleton = () => (
  <View style={custom_styles.statsContainer}>
    {[1, 2, 3].map((item) => (
      <View key={item} style={custom_styles.statCard}>
        <SkeletonBox width={48} height={48} style={{ borderRadius: 24, marginBottom: 8 }} />
        <SkeletonBox width={40} height={24} style={{ marginBottom: 4 }} />
        <SkeletonBox width={60} height={12} />
      </View>
    ))}
  </View>
);

const RewardCardSkeleton = () => (
  <View style={[custom_styles.rewardCard, { marginLeft: 20 }]}>
    <SkeletonBox width={280} height={160} />
    <View style={custom_styles.rewardContent}>
      <SkeletonBox width={200} height={18} style={{ marginBottom: 8 }} />
      <SkeletonBox width={260} height={13} style={{ marginBottom: 4 }} />
      <SkeletonBox width={240} height={13} style={{ marginBottom: 12 }} />
      <SkeletonBox width={100} height={13} />
    </View>
  </View>
);

export default function HomeScreen({ navigation }) {
  const { userInfo, userDetails } = useContext(AuthContext);
  const { rewards, refreshPoints } = useContext(PointsDetailContext);
  const [rewardsInfo, setRewardsInfo] = useState([]);
  const { styles } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFlashDetails, setShowFlashDetails] = useState(false);
  const [stationCount, setStationCount] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadCardLogin = async () => {
      const value = await AsyncStorage.getItem("card_login");
      if (value === "true" || value === "1") {
        setShowFlashDetails(true);
      }
    };

    loadCardLogin();
  }, []);

  const scrollY = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: "clamp"
  });

  const cardContainerTranslateY = scrollY.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: [20, 0, -20],
    extrapolate: "clamp"
  });

  const fetchRewards = async () => {
    try {
      const rez = await GetStationsLists(userInfo.token, "");
      setStationCount(rez.data.length);
      await fetch(`${BASE_URL}customer/get-rewards`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }).then(processResponse).then((res) => {
        const { statusCode, data } = res;
        // console.log("user details: ", data.result);
        // console.log(userInfo);
        setRewardsInfo(data.result);
      }).catch(error => {
        console.error(error);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}customer/product-catalog`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      const res = await processResponse(response);
      const { statusCode, data } = res;

      if (statusCode === 200 || statusCode === 201) {
        setProducts(data.result);
      } else {
        setProducts([]);
        console.error("Failed to fetch products:", res);
      }
    } catch (error) {
      console.error("getAllProducts error:", error);
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Wait for all API calls to complete
      await Promise.all([
        fetchRewards(),
        refreshPoints?.()
        // Add other API calls here if needed
        // fetchOtherData(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      // Add a minimum loading time for better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();

    try {
      await loadAllData();
    } finally {
      setRefreshing(false);
    }
  };

  const getRewardStyle = (type) => {
    const styles = {
      'CASH': { color: '#FF6B6B', icon: 'cash-outline' },
      'DISCOUNT': { color: '#4ECDC4', icon: 'pricetag-outline' },
      'SERVICE': { color: '#FFD93D', icon: 'construct-outline' },
      'VOUCHER': { color: '#95E1D3', icon: 'ticket-outline' },
      'DEFAULT': { color: '#A8A8A8', icon: 'gift-outline' }
    };
    return styles[type] || styles['DEFAULT'];
  };

  useEffect(() => {
    loadAllData();
    getAllProducts();
    // console.log(userDetails);
  }, []);

  return (
    <>
      <FlashUserDetails
        visible={showFlashDetails}
        onClose={() => {
          setShowFlashDetails(false);
          AsyncStorage.removeItem("card_login");
        }}
      />
      <View style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
        <Animated.View style={{ opacity: headerOpacity }}>
          <ImageBackground
            resizeMode="stretch"
            source={require("../../../assets/mygas-header.jpeg")}
            style={custom_styles.top_bar}
          >
            <LinearGradient
              colors={["rgba(249, 250, 141, 0.9)", "transparent"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1.4 }}
              style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
            />
            <Image
              source={require("../../../assets/mygas_logo.png")}
              style={custom_styles.logo}
            />
            <View style={{ position: "absolute", right: 0, top: 0 }}>
              <Navbar hideBack />
            </View>
          </ImageBackground>
        </Animated.View>

        <Animated.View
          style={[
            custom_styles.cardContainer,
            { transform: [{ translateY: cardContainerTranslateY }] }
          ]}
        >
          <Animated.ScrollView
            style={{ flex: 1, width: "100%" }}
            contentContainerStyle={{ paddingBottom: 100 }}
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
                progressViewOffset={60}
              />
            }
          >
            {isLoading ? (
              <>
                {/* Skeleton Loaders */}
                <GreetingCardSkeleton />
                <PointsCardSkeleton />
                <StatsCardSkeleton />

                {/* Rewards Section Skeleton */}
                <View style={custom_styles.sectionContainer}>
                  <View style={custom_styles.sectionHeader}>
                    <View>
                      <SkeletonBox width={120} height={20} style={{ marginBottom: 4 }} />
                      <SkeletonBox width={160} height={13} />
                    </View>
                    <SkeletonBox width={80} height={36} style={{ borderRadius: 20 }} />
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 20 }}
                  >
                    <RewardCardSkeleton />
                    <View style={{ width: 16 }} />
                    <RewardCardSkeleton />
                  </ScrollView>
                </View>

                {/* Promo Banner Skeleton */}
                <View style={[custom_styles.promoBanner, { backgroundColor: "#E1E9EE" }]}>
                  <View style={{ padding: 20, flexDirection: "row", alignItems: "center" }}>
                    <SkeletonBox width={40} height={40} style={{ borderRadius: 20 }} />
                    <View style={{ flex: 1, marginLeft: 16 }}>
                      <SkeletonBox width={140} height={18} style={{ marginBottom: 6 }} />
                      <SkeletonBox width={200} height={13} />
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* Greeting Section with Enhanced Design */}
                <View style={custom_styles.greetingCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={custom_styles.greetingText}>Good Day,</Text>
                    {!userDetails?.first_name ? (
                      <SkeletonBox width={200} height={22} style={{ marginBottom: 4 }} />
                    ) : (
                      <Text style={custom_styles.nameText}>
                        {userDetails?.last_name}, {userDetails?.first_name} {userDetails?.middle_name ? userDetails.middle_name.charAt(0) + '.' : ""}
                      </Text>
                    )}
                    <Text style={custom_styles.subtitleText}>
                      Welcome back! 🎉
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ScanScreen")}
                    style={custom_styles.qrButton}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#FFD93D", "#E0B820"]}
                      style={custom_styles.qrGradient}
                    >
                      <Ionicons name="qr-code-outline" size={28} color="#000" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {userInfo?.is_guest == 1 ? (
                  <GuestBanner />
                ) : null}

                {/* Enhanced Points Card */}
                <Animated.View
                  style={[
                    custom_styles.pointsCardWrapper,
                    { transform: [{ scale: cardScale }], backgroundColor: 'transparent' }
                  ]}
                >
                  <ImageBackground
                    source={userDetails?.availment_id == 3 ? require("../../../assets/diamond_card.png") : require("../../../assets/regular_card.png")}
                    resizeMode="contain"
                    style={[custom_styles.pointsCard, { backgroundColor: 'transparent' }]}
                    blurRadius={1.45}
                  >
                    {/* Floating Particles Effect Overlay */}
                    <View style={custom_styles.cardOverlay}>
                      <View style={custom_styles.floatingDot1} />
                      <View style={custom_styles.floatingDot2} />
                    </View>

                    <View style={custom_styles.cardContent}>
                      <View style={custom_styles.pointsSection}>
                        <View style={custom_styles.pointsDisplay}>
                          {rewards?.points !== undefined && rewards?.points !== null ? (
                            <>
                              <Text style={custom_styles.pointsNumber}>
                                {rewards.points}
                              </Text>
                              <View style={custom_styles.ptsLabel}>
                                <Text style={custom_styles.ptsText}>PTS</Text>
                              </View>
                            </>
                          ) : (
                            <>
                              <SkeletonBox width={120} height={42} style={{ marginRight: 8 }} />
                              <SkeletonBox width={60} height={30} style={{ borderRadius: 12 }} />
                            </>
                          )}
                        </View>

                        <View style={custom_styles.cardDetails}>
                          <View style={custom_styles.detailRow}>
                            <Ionicons name="calendar-outline" size={12} color="#666" />
                            {userDetails?.created_at ? (
                              <Text style={custom_styles.detailText}>
                                {new Date(userDetails.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                              </Text>
                            ) : (
                              <SkeletonBox width={100} height={11} style={{ marginLeft: 6 }} />
                            )}
                          </View>
                          <View style={custom_styles.detailRow}>
                            <Ionicons name="trophy-outline" size={12} color="#666" />
                            {userDetails?.points !== undefined && userDetails?.points !== null ? (
                              <Text style={custom_styles.detailText}>
                                Earned: {userDetails.points} pts
                              </Text>
                            ) : (
                              <SkeletonBox width={100} height={11} style={{ marginLeft: 6 }} />
                            )}
                          </View>
                        </View>
                      </View>

                      {userDetails?.bar_code ? (
                        <Text style={custom_styles.cardNumber}>
                          •••• •••• ••• {userDetails.bar_code.slice(-3)}
                        </Text>
                      ) : (
                        <SkeletonBox width={180} height={14} />
                      )}
                    </View>
                  </ImageBackground>
                </Animated.View>

                <View style={custom_styles.statsContainer}>
                  <View style={custom_styles.statCard}>
                    <View style={[custom_styles.statIcon, { backgroundColor: '#FFE5E5' }]}>
                      <Ionicons name="gift-outline" size={24} color="#FF6B6B" />
                    </View>
                    <Text style={custom_styles.statValue}>
                      {rewardsInfo?.length ? rewardsInfo.length : "0"}
                    </Text>
                    <Text style={custom_styles.statLabel}>Rewards</Text>
                  </View>

                  <View style={custom_styles.statCard}>
                    <View style={[custom_styles.statIcon, { backgroundColor: '#E5F5FF' }]}>
                      <Ionicons name="location-outline" size={24} color="#4ECDC4" />
                    </View>
                    <Text style={custom_styles.statValue}>{stationCount ?? "0"}</Text>
                    <Text style={custom_styles.statLabel}>Stations</Text>
                  </View>

                  <View style={custom_styles.statCard}>
                    <View style={[custom_styles.statIcon, { backgroundColor: '#FFF5E5' }]}>
                      <Ionicons name="time-outline" size={24} color="#FFD93D" />
                    </View>
                    <Text style={custom_styles.statValue}>0</Text>
                    <Text style={custom_styles.statLabel}>Activities</Text>
                  </View>
                </View>

                {userInfo?.is_guest == 1 ? (
                  <GuestRewardsComponent />
                ) : (
                  <>
                    <View style={custom_styles.sectionContainer}>
                      <View style={custom_styles.sectionHeader}>
                        <View>
                          <Text style={custom_styles.sectionTitle}>Products</Text>
                          <Text style={custom_styles.sectionSubtitle}>
                            Exclusive products for redemption ✨
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={custom_styles.viewAllButton}
                          activeOpacity={0.7}
                          onPress={() => {

                          }}
                        >
                          <Text style={custom_styles.viewAllText}>View All</Text>
                          <Ionicons name="chevron-forward" size={18} color="#E0B820" />
                        </TouchableOpacity>
                      </View>

                    </View>
                    {products?.length > 0 ? (
                      <FlatList
                        style={custom_styles.rewardsList}
                        data={products}
                        renderItem={({ item, index }) => {
                          const rewardStyle = getRewardStyle(item.type);
                          return (
                            <TouchableOpacity
                              style={[
                                custom_styles.rewardCard,
                                { marginLeft: index === 0 ? 20 : 0 }
                              ]}
                              onPress={() => {
                                console.log("Product selected:", item.name);
                              }}
                              activeOpacity={0.9}
                              disabled={item.quantity === 0}
                            >
                              <View style={custom_styles.rewardImageContainer}>
                                <Image
                                  source={
                                    item.image
                                      ? { uri: item.image }
                                      : require("../../../assets/motorista.png")
                                  }
                                  style={custom_styles.rewardImage}
                                />
                                <LinearGradient
                                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                                  style={custom_styles.imageGradient}
                                />

                                {item.isWeeklyPromo && (
                                  <View style={[custom_styles.categoryBadge, { backgroundColor: '#FF6B6B' }]}>
                                    <Ionicons name="flash" size={12} color="#FFF" />
                                  </View>
                                )}

                                {item.quantity === 0 && (
                                  <View style={custom_styles.inactiveBadge}>
                                    <Text style={custom_styles.inactiveText}>Out of Stock</Text>
                                  </View>
                                )}

                                {item.quantity > 0 && item.quantity < 10 && (
                                  <View style={[custom_styles.inactiveBadge, { backgroundColor: 'rgba(255, 152, 0, 0.9)' }]}>
                                    <Text style={custom_styles.inactiveText}>Low Stock</Text>
                                  </View>
                                )}
                              </View>

                              <View style={custom_styles.rewardContent}>
                                <Text style={custom_styles.rewardTitle} numberOfLines={1}>
                                  {item.name}
                                </Text>
                                <Text style={custom_styles.rewardDescription} numberOfLines={2}>
                                  {item.description}
                                </Text>

                                {/* Station Names */}
                                {item.stationNames && (
                                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <Ionicons name="location" size={10} color="#999" />
                                    <Text style={{ fontSize: 10, color: '#999', marginLeft: 4 }} numberOfLines={1}>
                                      {item.stationNames}
                                    </Text>
                                  </View>
                                )}

                                <View style={custom_styles.rewardFooter}>
                                  <View style={custom_styles.pointsBadge}>
                                    <Ionicons name="star" size={12} color="#E0B820" />
                                    <Text style={custom_styles.pointsText}>
                                      {item.originalPoints ? (
                                        <>
                                          <Text style={{ textDecorationLine: 'line-through', color: '#999' }}>
                                            {item.originalPoints}
                                          </Text>
                                          {' '}{item.points}
                                        </>
                                      ) : (
                                        item.points
                                      )} pts
                                    </Text>
                                  </View>

                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {item.quantity > 0 ? (
                                      <>
                                        <Text style={custom_styles.learnMore}>Redeem</Text>
                                        <Ionicons name="arrow-forward" size={16} color="#E0B820" />
                                      </>
                                    ) : (
                                      <Text style={[custom_styles.learnMore, { color: '#999' }]}>Unavailable</Text>
                                    )}
                                  </View>
                                </View>
                              </View>
                            </TouchableOpacity>
                          );
                        }}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 20 }}
                        ListEmptyComponent={() => (
                          <View style={custom_styles.emptyRewards}>
                            <Ionicons name="gift-outline" size={48} color="#CCC" />
                            <Text style={custom_styles.emptyText}>No rewards available</Text>
                            <Text style={custom_styles.emptySubtext}>Check back later for exciting offers!</Text>
                          </View>
                        )}
                      />
                    ) : (
                      <View style={custom_styles.emptyRewards}>
                        <Ionicons name="gift-outline" size={48} color="#CCC" />
                        <Text style={custom_styles.emptyText}>No products available</Text>
                        <Text style={custom_styles.emptySubtext}>Check back later for exciting offers!</Text>
                      </View>
                    )}
                  </>
                )}

                {/* Promotional Banner */}
                {/* <View style={custom_styles.promoBanner}>
                  <LinearGradient
                    colors={['#FFD93D', '#E0B820']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={custom_styles.promoGradient}
                  >
                    <View style={custom_styles.promoContent}>
                      <Ionicons name="gift" size={40} color="#FFF" />
                      <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={custom_styles.promoTitle}>
                          Special Offer!
                        </Text>
                        <Text style={custom_styles.promoText}>
                          Get 2x points on your next visit
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={24} color="#FFF" />
                    </View>
                  </LinearGradient>
                </View> */}
              </>
            )}
          </Animated.ScrollView>
        </Animated.View>
        <View style={{ height: "5%" }}></View>
      </View >
    </>
  );
}

const custom_styles = StyleSheet.create({
  top_bar: {
    height: 150,
    width: "100%",
    position: "relative"
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E0B820',
    marginLeft: 4
  },
  inactiveBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  inactiveText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600'
  },
  emptyRewards: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 40,
    marginLeft: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: width - 40
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 4
  },
  emptySubtext: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center'
  },
  logo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -40 }, { translateY: -40 }],
    width: 65,
    height: 65,
    resizeMode: "contain",
    zIndex: 2
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: -30,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "relative",
    zIndex: 1
  },
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
    shadowRadius: 8
  },
  greetingText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4
  },
  subtitleText: {
    fontSize: 13,
    color: "#666"
  },
  qrButton: {
    marginLeft: 16
  },
  qrGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#E0B820",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  pointsCardWrapper: {
    alignItems: "center",
    marginVertical: 24,
    paddingHorizontal: 20
  },
  pointsCard: {
    width: width - 15,
    aspectRatio: 1.58,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12
  },
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  floatingDot1: {
    position: "absolute",
    top: 30,
    right: 40,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(224, 184, 32, 0.3)"
  },
  floatingDot2: {
    position: "absolute",
    bottom: 60,
    left: 40,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 217, 61, 0.2)"
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between"
  },
  pointsSection: {
    marginTop: 70
  },
  pointsDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  pointsNumber: {
    color: "#966919",
    fontWeight: "900",
    fontSize: 42,
    letterSpacing: -1,
    textShadowColor: "#000",
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1
  },
  ptsLabel: {
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8
  },
  ptsText: {
    color: "#E0B820",
    fontSize: 14,
    fontWeight: "500"
  },
  cardDetails: {
    marginTop: 8
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4
  },
  detailText: {
    color: "#666",
    fontSize: 11,
    marginLeft: 6
  },
  cardNumber: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24
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
    shadowRadius: 4
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2
  },
  statLabel: {
    fontSize: 12,
    color: "#999"
  },
  sectionContainer: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#999"
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20
  },
  viewAllText: {
    fontSize: 13,
    color: "#E0B820",
    fontWeight: "600",
    marginRight: 4
  },
  rewardsList: {
    marginBottom: 8
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
    overflow: "hidden"
  },
  rewardImageContainer: {
    position: "relative",
    height: 160
  },
  rewardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80
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
    elevation: 2
  },
  rewardContent: {
    padding: 16
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6
  },
  rewardDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 12
  },
  rewardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  learnMore: {
    fontSize: 13,
    color: "#E0B820",
    fontWeight: "600"
  },
  promoBanner: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#E0B820",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  promoGradient: {
    padding: 20
  },
  promoContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4
  },
  promoText: {
    fontSize: 13,
    color: "#FFF",
    opacity: 0.9
  }
});