import React, { useContext, useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  TextInput,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Navbar from "../../components/Navbar";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL, processResponse } from "../../config";
import { PointsDetailContext } from "../../context/PointsDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import haversine from "haversine";

const { width, height } = Dimensions.get("window");

const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768 && width < 1024;
const isLargeTablet = width >= 1024;

const getResponsiveValue = (small, medium, tablet, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  if (isTablet) return tablet;
  return large;
};

export default function RedemptionScreen({ navigation }) {
  const { userInfo, userDetails, userLocation } = useContext(AuthContext);
  const { rewards } = useContext(PointsDetailContext);
  const [stationLists, setStationLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [storedLocation, setStoredLocation] = useState(null);

  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const getStationLists = useCallback(async (isRefresh = false) => {
    try {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${BASE_URL}customer/station-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        signal: abortControllerRef.current.signal,
      });

      const res = await processResponse(response);
      const { statusCode, data } = res;

      if (statusCode === 200) {
        setStationLists(data.result || []);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log("Error fetching stations:", error);
        setStationLists([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userInfo.token]);

  useEffect(() => {
    const loadLocation = async () => {
      const saved = await AsyncStorage.getItem("lat_long");
      if (saved) {
        setStoredLocation(JSON.parse(saved));
      }
    };

    loadLocation();
  }, []);

  const transformedStations = useMemo(() => {
    return stationLists.map(station => {

      const user_current_location = storedLocation
        ? { latitude: storedLocation.lat, longitude: storedLocation.long }
        : { latitude: userLocation.lat, longitude: userLocation.long };

      const station_location = { latitude: station.station_lat, longitude: station.station_long };
      const distance = haversine(user_current_location, station_location, { unit: "km" });
      const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
      const rewards = Math.floor(Math.random() * 15 + 1);
      const isOpen = Math.random() > 0.3;

      return {
        ...station,
        name: station.station_name,
        address: station.station_address,
        image: station.image_path
          ? { uri: station.image_path }
          : `${require("../../../assets/mygas.jpg")}`,
        distance: `${distance.toFixed(2)} km`,
        rating: rating,
        rewards: rewards,
        isOpen: isOpen,
        distanceValue: distance.toFixed(2),
        rewardsValue: rewards,
      };
    });
  }, [stationLists]);


  const filteredStations = useMemo(() => {
    let filtered = [...transformedStations];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (station) =>
          station.name?.toLowerCase().includes(query) ||
          station.address?.toLowerCase().includes(query) ||
          station.serial_number?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [transformedStations, searchQuery]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      // Search is handled by useMemo, this is just for potential future API search
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    getStationLists();

    return () => {
      // Cleanup: abort ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const renderStationCard = useCallback(({ item: station }) => (
    <TouchableOpacity
      style={styles.stationCard}
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate("SpecificStationScreen", { station });
      }}
    >
      <Image source={station.image} style={styles.stationImage} />

      <View style={styles.stationContent}>
        <View style={styles.stationHeader}>
          <View style={styles.stationTitleContainer}>
            <Text style={styles.stationName} numberOfLines={1}>
              {station.name}
            </Text>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: station.isOpen ? "#4CAF50" : "#999" },
                ]}
              />
              <Text style={styles.statusText}>
                {station.isOpen ? "Open" : "Closed"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.stationDetails}>
          <View style={styles.detailRow}>
            <Ionicons
              name="location"
              size={getResponsiveValue(14, 16, 18, 20)}
              color="#666"
            />
            <Text style={styles.stationAddress} numberOfLines={1}>
              {station.address}
            </Text>
          </View>

          <View style={styles.stationMeta}>
            <View style={styles.metaItem}>
              <Ionicons
                name="navigate"
                size={getResponsiveValue(14, 16, 18, 20)}
                color="#FF0000"
              />
              <Text style={styles.metaText}>{station.distance}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons
                name="star"
                size={getResponsiveValue(14, 16, 18, 20)}
                color="#f39c12"
              />
              <Text style={styles.metaText}>{station.rating}</Text>
            </View>

            <View style={styles.metaItem}>
              <Image
                source={require("../../../assets/my.png")}
                style={styles.miniIcon}
              />
              <Text style={styles.rewardsText}>{station.rewards} rewards</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <Ionicons
          name="chevron-forward"
          size={getResponsiveValue(20, 24, 28, 32)}
          color="#999"
        />
      </View>
    </TouchableOpacity>
  ), [navigation]);

  const keyExtractor = useCallback((item) => item.id?.toString(), []);

  const onRefresh = useCallback(() => {
    getStationLists(true);
  }, [getStationLists]);

  const ListHeaderComponent = useMemo(() => (
    <>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Redemption Shop</Text>
        <Text style={styles.subtitle}>
          Select a gas station to view and redeem available rewards
        </Text>
      </View>

      {/* Points Display */}
      <View style={styles.pointsBoxContainer}>
        <View style={styles.pointsBox}>
          <Text style={styles.pointsLabel}>Available Points</Text>
          <View style={styles.pointsRow}>
            <Image
              source={require("../../../assets/my.png")}
              style={styles.mygasIcon}
            />
            <Text style={styles.pointsValue}>{rewards?.points || 0}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate("CartScreens");
          }}
        >
          <Ionicons
            name="cart"
            size={getResponsiveValue(22, 24, 26, 28)}
            color="#FF0000"
          />
          <Text style={styles.cartButtonText}>My Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toReceiveButton}
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate("RedemptionTransactionScreens");
          }}
        >
          <Ionicons
            name="gift"
            size={getResponsiveValue(22, 24, 26, 28)}
            color="#4CAF50"
          />
          <Text style={styles.toReceiveButtonText}>My Redeems</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={getResponsiveValue(18, 20, 22, 24)}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search gas stations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>
    </>
  ), [searchQuery, rewards?.points]);

  const ListEmptyComponent = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#FF0000" />
          <Text style={styles.emptyStateText}>Loading stations...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons
          name="location-outline"
          size={getResponsiveValue(48, 64, 80, 96)}
          color="#ccc"
        />
        <Text style={styles.emptyStateText}>No stations found</Text>
        <Text style={styles.emptyStateSubtext}>
          Try adjusting your search
        </Text>
      </View>
    );
  }, [loading]);

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

      <View style={styles.cardContainer}>
        <FlatList
          data={filteredStations}
          renderItem={renderStationCard}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          refreshing={refreshing}
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          getItemLayout={(data, index) => ({
            length: getResponsiveValue(94, 108, 122, 136),
            offset: getResponsiveValue(94, 108, 122, 136) * index,
            index,
          })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  top_bar: {
    height: getResponsiveValue(130, 150, 180, 200),
    width: "100%",
    position: "relative",
  },
  logo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [
      { translateX: getResponsiveValue(-30, -40, -50, -60) },
      { translateY: getResponsiveValue(-30, -40, -50, -60) }
    ],
    width: getResponsiveValue(55, 65, 80, 100),
    height: getResponsiveValue(55, 65, 80, 100),
    resizeMode: "contain",
    zIndex: 2,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: getResponsiveValue(16, 20, 24, 28),
    borderTopRightRadius: getResponsiveValue(16, 20, 24, 28),
    marginTop: -20,
  },
  flatListContent: {
    paddingHorizontal: getResponsiveValue(12, 16, 24, 32),
    paddingTop: getResponsiveValue(16, 20, 24, 28),
    paddingBottom: getResponsiveValue(80, 100, 120, 140),
    flexGrow: 1,
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: getResponsiveValue(16, 20, 24, 28),
  },
  title: {
    fontSize: getResponsiveValue(24, 28, 32, 36),
    fontWeight: "bold",
    color: "#333",
    marginBottom: getResponsiveValue(6, 8, 10, 12),
  },
  subtitle: {
    fontSize: getResponsiveValue(12, 13, 14, 16),
    textAlign: "center",
    color: "#777",
    paddingHorizontal: getResponsiveValue(16, 20, 24, 32),
    lineHeight: getResponsiveValue(18, 20, 22, 24),
  },
  pointsBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveValue(10, 12, 14, 16),
    marginBottom: getResponsiveValue(16, 20, 24, 28),
  },
  pointsBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: getResponsiveValue(10, 12, 14, 16),
    padding: getResponsiveValue(14, 16, 20, 24),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cartButton: {
    backgroundColor: "#fff",
    borderRadius: getResponsiveValue(10, 12, 14, 16),
    padding: getResponsiveValue(17, 22, 24, 28),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: getResponsiveValue(80, 75, 85, 95),
  },
  cartButtonText: {
    fontSize: getResponsiveValue(10, 11, 12, 13),
    color: "#FF0000",
    fontWeight: "600",
    marginTop: getResponsiveValue(4, 5, 6, 7),
  },
  toReceiveButton: {
    backgroundColor: "#fff",
    borderRadius: getResponsiveValue(10, 12, 14, 16),
    padding: getResponsiveValue(17, 22, 24, 28),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: getResponsiveValue(65, 75, 85, 95),
  },
  toReceiveButtonText: {
    fontSize: getResponsiveValue(10, 11, 12, 13),
    color: "#4CAF50",
    fontWeight: "600",
    marginTop: getResponsiveValue(4, 5, 6, 7),
  },
  pointsLabel: {
    fontSize: getResponsiveValue(11, 12, 13, 14),
    color: "#666",
    marginBottom: getResponsiveValue(4, 6, 8, 10),
    fontWeight: "500",
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mygasIcon: {
    height: getResponsiveValue(20, 24, 28, 32),
    width: getResponsiveValue(20, 24, 28, 32),
    resizeMode: "contain",
    marginRight: getResponsiveValue(6, 8, 10, 12),
  },
  pointsValue: {
    color: "#f39c12",
    fontWeight: "bold",
    fontSize: getResponsiveValue(20, 24, 28, 32),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: getResponsiveValue(10, 12, 14, 16),
    paddingHorizontal: getResponsiveValue(12, 16, 20, 24),
    paddingVertical: getResponsiveValue(10, 12, 14, 16),
    marginBottom: getResponsiveValue(12, 16, 20, 24),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: getResponsiveValue(6, 8, 10, 12),
  },
  searchInput: {
    flex: 1,
    fontSize: getResponsiveValue(13, 15, 16, 18),
    color: "#333",
  },
  stationCard: {
    backgroundColor: "#fff",
    borderRadius: getResponsiveValue(12, 16, 18, 20),
    marginBottom: getResponsiveValue(12, 16, 20, 24),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  stationImage: {
    width: getResponsiveValue(70, 80, 90, 100),
    height: getResponsiveValue(70, 80, 90, 100),
    resizeMode: "cover",
    backgroundColor: "#f9f9f9",
  },
  stationContent: {
    flex: 1,
    padding: getResponsiveValue(10, 12, 14, 16),
  },
  stationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: getResponsiveValue(6, 8, 10, 12),
  },
  stationTitleContainer: {
    flex: 1,
  },
  stationName: {
    fontSize: getResponsiveValue(14, 16, 18, 20),
    fontWeight: "bold",
    color: "#333",
    marginBottom: getResponsiveValue(4, 5, 6, 7),
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: getResponsiveValue(6, 7, 8, 9),
    height: getResponsiveValue(6, 7, 8, 9),
    borderRadius: getResponsiveValue(3, 3.5, 4, 4.5),
    marginRight: getResponsiveValue(4, 5, 6, 7),
  },
  statusText: {
    fontSize: getResponsiveValue(10, 11, 12, 13),
    color: "#666",
    fontWeight: "500",
  },
  stationDetails: {
    gap: getResponsiveValue(6, 8, 10, 12),
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveValue(4, 5, 6, 7),
  },
  stationAddress: {
    fontSize: getResponsiveValue(11, 12, 13, 14),
    color: "#666",
    flex: 1,
  },
  stationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveValue(10, 12, 14, 16),
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveValue(3, 4, 5, 6),
  },
  metaText: {
    fontSize: getResponsiveValue(11, 12, 13, 14),
    color: "#666",
    fontWeight: "500",
  },
  miniIcon: {
    width: getResponsiveValue(14, 16, 18, 20),
    height: getResponsiveValue(14, 16, 18, 20),
    resizeMode: "contain",
  },
  rewardsText: {
    fontSize: getResponsiveValue(11, 12, 13, 14),
    color: "#f39c12",
    fontWeight: "600",
  },
  arrowContainer: {
    paddingHorizontal: getResponsiveValue(10, 12, 14, 16),
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: getResponsiveValue(40, 60, 80, 100),
  },
  emptyStateText: {
    fontSize: getResponsiveValue(16, 18, 20, 22),
    color: "#999",
    marginTop: getResponsiveValue(12, 16, 20, 24),
    fontWeight: "600",
  },
  emptyStateSubtext: {
    fontSize: getResponsiveValue(12, 14, 15, 16),
    color: "#bbb",
    marginTop: getResponsiveValue(6, 8, 10, 12),
  },
});