import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  Animated,
  RefreshControl,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Navbar from "../../components/Navbar";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL, processResponse } from "../../config";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Responsive sizing
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
const isLargeDevice = SCREEN_WIDTH >= 414;

const scale = (size) => {
  if (isSmallDevice) return size * 0.9;
  if (isMediumDevice) return size;
  return size * 1.05;
};

// Skeleton Loader Component
const NotificationSkeleton = () => {
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
    <View style={custom_styles.notificationCard}>
      <Animated.View style={[custom_styles.skeletonIcon, { opacity }]} />
      <View style={custom_styles.notificationContent}>
        <Animated.View style={[custom_styles.skeletonTitle, { opacity }]} />
        <Animated.View style={[custom_styles.skeletonSubtitle, { opacity, marginTop: 8 }]} />
        <Animated.View style={[custom_styles.skeletonTime, { opacity, marginTop: 8 }]} />
      </View>
    </View>
  );
};

const NotificationScreen = ({ nav }) => {
  const { userInfo, userData } = useContext(AuthContext);
  const { styles } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all"); // all, earn, redeem

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

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      e.preventDefault();
      navigation.navigate(e.target.split("-")[0]);
    });
    return unsubscribe;
  }, [navigation]);

  const customer_notification = async () => {
    try {
      const response = await fetch(`${BASE_URL}customer/customer-notifications`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        }
      });
      const res = await processResponse(response);
      const { statusCode, data } = res;
      // console.log(data.result);
      setNotifications(data.result || []);
    } catch (error) {
      // console.error(error);
      console.log(error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await customer_notification();
    setRefreshing(false);
  };

  useEffect(() => {
    customer_notification();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "Earn":
        return { name: "add-circle", color: "#22C55E", bg: "#DCFCE7" };
      case "Redeem":
        return { name: "gift", color: "#EF4444", bg: "#FEE2E2" };
      case "Credit":
        return { name: "arrow-up-circle", color: "#8B5CF6", bg: "#EDE9FE" };
      case "Debit":
        return { name: "arrow-down-circle", color: "#F59E0B", bg: "#FEF3C7" };
      default:
        return { name: "notifications", color: "#3B82F6", bg: "#DBEAFE" };
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
  };

  const filteredNotifications = notifications.filter(item => {
    if (filter === "all") return true;
    if (filter === "earn") return item.type === "Earn" || item.type === "Credit";
    if (filter === "redeem") return item.type === "Redeem" || item.type === "Debit";
    return true;
  });

  const renderNotification = ({ item, index }) => {
    const icon = getNotificationIcon(item.type);
    const inputRange = [
      -1,
      0,
      (scale(100) + scale(12)) * index,
      (scale(100) + scale(12)) * (index + 1)
    ];

    const cardScale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.98],
      extrapolate: "clamp"
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.85],
      extrapolate: "clamp"
    });

    return (
      <Animated.View
        style={[
          custom_styles.notificationCard,
          {
            transform: [{ scale: cardScale }],
            opacity
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            console.log("Notification pressed:", item.transaction_number);
          }}
          style={custom_styles.notificationTouchable}
        >
          <View style={[custom_styles.iconContainer, { backgroundColor: icon.bg }]}>
            <Ionicons name={icon.name} size={scale(24)} color={icon.color} />
          </View>

          <View style={custom_styles.notificationContent}>
            <Text style={custom_styles.notificationTitle} numberOfLines={2}>
              {item.type === "Earn"
                ? `Earned points from fuel purchase`
                : item.type === "Redeem"
                  ? `Redeemed ${item.points} points`
                  : item.type === "Credit"
                    ? `Credit Memo + Adjustment`
                    : item.type === "Debit"
                      ? `Credit Memo - Adjustment`
                      : "Transaction"}
            </Text>

            <Text style={custom_styles.notificationDescription} numberOfLines={2}>
              {item.type === "Earn"
                ? `PHP ${item.amount} ${item.service || 'fuel'} at ${item.station_name}`
                : item.type === "Redeem"
                  ? `${item.description}${item.station_name ? ` at ${item.station_name}` : ''}`
                  : item.type === "Credit" || item.type === "Debit"
                    ? item.description
                    : `Transaction${item.station_name ? ` at ${item.station_name}` : ''}`}
            </Text>

            <View style={custom_styles.notificationFooter}>
              <View style={custom_styles.pointsContainer}>
                <Image
                  source={require("../../../assets/my.png")}
                  style={custom_styles.pointsIcon}
                />
                <Text style={custom_styles.pointsText}>
                  {item.type === "Earn" || item.type === "Credit" ? "+" : "-"}{item.points} pts
                </Text>
              </View>
              <Text style={custom_styles.timeText}>
                {formatTime(item.date)}
              </Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={scale(20)} color="#CBD5E1" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <View style={custom_styles.headerContainer}>
      <View style={custom_styles.titleSection}>
        <Text style={custom_styles.pageTitle}>Notifications</Text>
        <Text style={custom_styles.subtitle}>
          Stay updated with your latest activities
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={custom_styles.filterContainer}>
        <TouchableOpacity
          style={[
            custom_styles.filterTab,
            filter === "all" && custom_styles.filterTabActive
          ]}
          onPress={() => setFilter("all")}
          activeOpacity={0.7}
        >
          <Text style={[
            custom_styles.filterText,
            filter === "all" && custom_styles.filterTextActive
          ]}>
            All
          </Text>
          <View style={[
            custom_styles.filterBadge,
            filter === "all" && custom_styles.filterBadgeActive
          ]}>
            <Text style={[
              custom_styles.filterBadgeText,
              filter === "all" && custom_styles.filterBadgeTextActive
            ]}>
              {notifications.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            custom_styles.filterTab,
            filter === "earn" && custom_styles.filterTabActive
          ]}
          onPress={() => setFilter("earn")}
          activeOpacity={0.7}
        >
          <Text style={[
            custom_styles.filterText,
            filter === "earn" && custom_styles.filterTextActive
          ]}>
            Earned
          </Text>
          <View style={[
            custom_styles.filterBadge,
            filter === "earn" && custom_styles.filterBadgeActive
          ]}>
            <Text style={[
              custom_styles.filterBadgeText,
              filter === "earn" && custom_styles.filterBadgeTextActive
            ]}>
              {notifications.filter(n => n.type === "Earn" || n.type === "Credit").length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            custom_styles.filterTab,
            filter === "redeem" && custom_styles.filterTabActive
          ]}
          onPress={() => setFilter("redeem")}
          activeOpacity={0.7}
        >
          <Text style={[
            custom_styles.filterText,
            filter === "redeem" && custom_styles.filterTextActive
          ]}>
            Redeemed
          </Text>
          <View style={[
            custom_styles.filterBadge,
            filter === "redeem" && custom_styles.filterBadgeActive
          ]}>
            <Text style={[
              custom_styles.filterBadgeText,
              filter === "redeem" && custom_styles.filterBadgeTextActive
            ]}>
              {notifications.filter(n => n.type === "Redeem" || n.type === "Debit").length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={custom_styles.emptyContainer}>
      <View style={custom_styles.emptyIconContainer}>
        <Ionicons name="notifications-off-outline" size={scale(64)} color="#CBD5E1" />
      </View>
      <Text style={custom_styles.emptyTitle}>No Notifications</Text>
      <Text style={custom_styles.emptySubtitle}>
        You're all caught up! We'll notify you when something new happens.
      </Text>
    </View>
  );

  return (
    <View style={custom_styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      {/* <Animated.View style={{ opacity: headerOpacity }}>
        <ImageBackground
          resizeMode="stretch"
          source={require("../../../assets/mygas-header.jpeg")}
          style={custom_styles.top_bar}
        >
          <LinearGradient
            colors={["rgba(249, 250, 141, 0.9)", "transparent"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1.4 }}
            style={custom_styles.headerGradient}
          />
          <Image
            source={require("../../../assets/mygas_logo.png")}
            style={custom_styles.logo}
          />
          <Navbar
            onProfilePress={() => console.log("Profile tapped")}
            onNotifPress={() => console.log("Notifications tapped")}
          />
        </ImageBackground>
      </Animated.View> */}
      <Navbar
        onProfilePress={() => console.log("Profile tapped")}
        onNotifPress={() => console.log("Notifications tapped")}
      />

      {/* Main Content */}
      <Animated.View
        style={[
          custom_styles.cardContainer,
          { transform: [{ translateY: cardContainerTranslateY }] }
        ]}
      >
        {isLoading ? (
          <View style={{ flex: 1, width: "100%" }}>
            {renderHeader()}
            <View style={custom_styles.notificationList}>
              {[1, 2, 3, 4, 5].map((item) => (
                <NotificationSkeleton key={item} />
              ))}
            </View>
          </View>
        ) : (
          <Animated.FlatList
            data={filteredNotifications}
            renderItem={renderNotification}
            // keyExtractor={(item) => item.transaction_number}
            keyExtractor={(item, index) => `${item.transaction_number}-${index}`}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={[
              custom_styles.flatListContent,
              filteredNotifications.length === 0 && { flex: 1 }
            ]}
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
                progressViewOffset={20}
              />
            }
            ItemSeparatorComponent={() => <View style={{ height: scale(12) }} />}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        )}
      </Animated.View>
    </View>
  );
};

const custom_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  top_bar: {
    height: 150,
    width: "100%",
    position: "relative",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  logo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -32.5 }, { translateY: -32.5 }],
    width: 65,
    height: 65,
    resizeMode: "contain",
    zIndex: 2,
  },
  cardContainer: {
    flex: 1,
    marginTop: -30,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "relative",
    zIndex: 1,
  },
  headerContainer: {
    paddingHorizontal: scale(5),
    paddingTop: scale(24),
    paddingBottom: scale(16),
  },
  titleSection: {
    alignItems: "center",
    marginBottom: scale(20),
  },
  pageTitle: {
    fontSize: scale(26),
    fontWeight: "700",
    color: "#222",
    letterSpacing: -0.5,
    marginBottom: scale(4),
  },
  subtitle: {
    fontSize: scale(13),
    color: "#666",
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: scale(16),
    padding: scale(8),
    gap: scale(8),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  filterTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scale(10),
    paddingHorizontal: scale(12),
    borderRadius: scale(12),
    gap: scale(6),
  },
  filterTabActive: {
    backgroundColor: "#E0B820",
  },
  filterText: {
    fontSize: scale(12),
    fontWeight: "600",
    color: "#64748B",
  },
  filterTextActive: {
    color: "#FFF",
  },
  filterBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
    minWidth: scale(24),
    alignItems: "center",
  },
  filterBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  filterBadgeText: {
    fontSize: scale(11),
    fontWeight: "700",
    color: "#64748B",
  },
  filterBadgeTextActive: {
    color: "#FFF",
  },
  flatListContent: {
    paddingHorizontal: scale(20),
    paddingBottom: scale(100),
  },
  notificationList: {
    paddingHorizontal: scale(20),
  },
  notificationCard: {
    backgroundColor: "#FFF",
    borderRadius: scale(16),
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
    marginBottom: scale(12),
  },
  notificationTouchable: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
    gap: scale(12),
  },
  iconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: scale(15),
    fontWeight: "700",
    color: "#222",
    marginBottom: scale(4),
    lineHeight: scale(20),
  },
  notificationDescription: {
    fontSize: scale(13),
    color: "#64748B",
    marginBottom: scale(8),
    lineHeight: scale(18),
  },
  notificationFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E5",
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    gap: scale(4),
  },
  pointsIcon: {
    width: scale(14),
    height: scale(14),
    resizeMode: "contain",
  },
  pointsText: {
    fontSize: scale(12),
    fontWeight: "700",
    color: "#E0B820",
  },
  timeText: {
    fontSize: scale(11),
    color: "#94A3B8",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scale(60),
    paddingHorizontal: scale(40),
  },
  emptyIconContainer: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: scale(24),
  },
  emptyTitle: {
    fontSize: scale(20),
    fontWeight: "700",
    color: "#222",
    marginBottom: scale(8),
  },
  emptySubtitle: {
    fontSize: scale(14),
    color: "#64748B",
    textAlign: "center",
    lineHeight: scale(20),
  },
  // Skeleton Styles
  skeletonIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: "#E1E9EE",
  },
  skeletonTitle: {
    width: "70%",
    height: scale(16),
    borderRadius: scale(8),
    backgroundColor: "#E1E9EE",
  },
  skeletonSubtitle: {
    width: "90%",
    height: scale(14),
    borderRadius: scale(7),
    backgroundColor: "#E1E9EE",
  },
  skeletonTime: {
    width: "40%",
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: "#E1E9EE",
  },
});

export default NotificationScreen