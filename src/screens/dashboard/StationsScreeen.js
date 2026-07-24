import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  Dimensions,
  Animated,
  TextInput,
  RefreshControl,
  Platform,
} from "react-native";
import React, { useState, useRef, useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL, processResponse } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Websockets } from "../../lib/Websockets";
import GetStationsLists from "../../service/Stations";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size) => (SCREEN_WIDTH / 375) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / 667) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Breakpoints
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
const isLargeDevice = SCREEN_WIDTH >= 414;
const isTablet = SCREEN_WIDTH >= 768;

export default function StationsScreen({ navigation }) {
  const { userInfo, userDetails } = useContext(AuthContext);
  const { styles } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currLat, setCurrLat] = useState(7.102943635598714);
  const [currLong, setCurrLong] = useState(125.58125155146296);
  const [showMap, setShowMap] = useState(true);
  const [locationPermission, setLocationPermission] = useState(null);
  const [stationsLists, setStationsLists] = useState(null);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cardContainerTranslateY = scrollY.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: [20, 0, -20],
    extrapolate: "clamp",
  });

  const [mapLoading, setMapLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const [refreshing, setRefreshing] = useState(false);
  const pullAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Shimmer animation
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, []);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const location = await Location.getCurrentPositionAsync({});
  //       const currentLat = location.coords.latitude;
  //       const currentLong = location.coords.longitude;

  //       const storedLocation = await AsyncStorage.getItem("lat_long");

  //       if (storedLocation) {
  //         const { lat: savedLat, long: savedLong } = JSON.parse(storedLocation);

  //         if (savedLat !== currentLat || savedLong !== currentLong) {
  //           await AsyncStorage.setItem("lat_long", JSON.stringify({
  //             lat: currentLat,
  //             long: currentLong
  //           }));
  //         }

  //         setCurrLat(savedLat);
  //         setCurrLong(savedLong);
  //       } else {
  //         await AsyncStorage.setItem("lat_long", JSON.stringify({
  //           lat: currentLat,
  //           long: currentLong
  //         }));

  //         setCurrLat(currentLat);
  //         setCurrLong(currentLong);
  //       }
  //     } catch (error) {
  //       console.error("Location error:", error);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    let animation;
    if (mapLoading) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.5,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      animation.start();
    } else {
      scaleAnim.setValue(1);
      opacityAnim.setValue(1);
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [mapLoading]);

  useEffect(() => {
    let spinLoop;
    if (refreshing) {
      spinAnim.setValue(0);
      spinLoop = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      );
      spinLoop.start();
    } else {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
    return () => {
      if (spinLoop) spinLoop.stop();
    };
  }, [refreshing]);

  const onRefresh = () => {
    setRefreshing(true);
    Animated.timing(pullAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        getStationLists(searchQuery);
        setRefreshing(false);
        Animated.timing(pullAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, 1200);
    });
  };

  const getStationLists = async (value = "") => {
    try {
      setStationsLoading(true);
      const result = await GetStationsLists(userInfo.token, value, "", true);

      console.log("Stations fetched:", result.success ? "Success" : "Failed", result.data?.length || 0);

      if (result.success) {
        setStationsLists(result.data);
      } else {
        console.log("Failed to fetch stations:", result.message || result.error);
      }
    } catch (error) {
      console.log("Error fetching stations:", error);
    } finally {
      setStationsLoading(false);
    }
  };

  useEffect(() => {
    getStationLists();
  }, []);

  useEffect(() => {
    let subscription;

    const setup = async () => {
      subscription = await Websockets("station-add", "station-add-event", (event) => {
        console.info("📡 Received from StationScreen:");
        getStationLists(searchQuery);
      });
    };

    setup();
  }, [searchQuery]);

  const SkeletonLoader = () => (
    <View style={custom_styles.skeletonCard}>
      <View style={custom_styles.skeletonLogo}>
        <Animated.View
          style={[
            custom_styles.shimmerOverlay,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        />
      </View>
      <View style={custom_styles.skeletonContent}>
        <View style={custom_styles.skeletonTitle}>
          <Animated.View
            style={[
              custom_styles.shimmerOverlay,
              {
                transform: [{ translateX: shimmerTranslate }],
              },
            ]}
          />
        </View>
        <View style={custom_styles.skeletonAddress}>
          <Animated.View
            style={[
              custom_styles.shimmerOverlay,
              {
                transform: [{ translateX: shimmerTranslate }],
              },
            ]}
          />
        </View>
        <View style={custom_styles.skeletonButton}>
          <Animated.View
            style={[
              custom_styles.shimmerOverlay,
              {
                transform: [{ translateX: shimmerTranslate }],
              },
            ]}
          />
        </View>
      </View>
      <View style={custom_styles.skeletonArrow}>
        <Animated.View
          style={[
            custom_styles.shimmerOverlay,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      {/* Loader Overlay */}
      {mapLoading && (
        <View style={custom_styles.loaderOverlay} pointerEvents="auto">
          <Animated.Image
            source={require("../../../assets/mygas_logo.png")}
            style={[
              custom_styles.loaderLogo,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          />
        </View>
      )}
      {/* <ImageBackground
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
        <Navbar
          hideBack
          onProfilePress={() => console.log("Profile tapped")}
          onNotifPress={() => console.log("Notifications tapped")}
        />
      </ImageBackground> */}

      <Animated.View
        style={[
          custom_styles.cardContainer,
          {
            transform: [{ translateY: cardContainerTranslateY }],
          },
        ]}
      >
        <Animated.ScrollView
          contentContainerStyle={custom_styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          style={custom_styles.scrollableContentArea}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fe0002"
              colors={["#fe0002"]}
              progressViewOffset={moderateScale(60)}
            />
          }
        >
          <View style={custom_styles.headerContainer}>
            <View style={custom_styles.titleRow}>
              <Ionicons name="location" size={moderateScale(32)} color="#fe0002" />
              <Text style={custom_styles.title}>Locate Stations</Text>
            </View>
            <Text style={custom_styles.subtitle}>
              Find the nearest MyGas stations and plan your journey with ease!
            </Text>
          </View>

          <View style={custom_styles.searchBarContainer}>
            <View style={custom_styles.searchIconWrapper}>
              <Ionicons
                name="search-outline"
                size={moderateScale(20)}
                color="#fe0002"
              />
            </View>
            <TextInput
              style={custom_styles.searchInput}
              placeholder="Search for stations..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={(value) => {
                setSearchQuery(value);
                if (value === "") {
                  getStationLists();
                  setShowMap(true);
                } else {
                  getStationLists(value);
                  setShowMap(false);
                }
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  getStationLists();
                  setShowMap(true);
                }}
                style={custom_styles.clearButton}
              >
                <Ionicons name="close-circle" size={moderateScale(20)} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flex: 1, paddingTop: moderateScale(8), marginBottom: 45 }}>
            <View style={custom_styles.sectionHeader}>
              <Text style={custom_styles.sectionTitle}>
                {searchQuery ? 'Search Results' : 'Nearby Stations'}
              </Text>
              {!stationsLoading && stationsLists?.length > 0 && (
                <View style={custom_styles.countBadge}>
                  <Text style={custom_styles.countText}>{stationsLists.length}</Text>
                </View>
              )}
            </View>

            {stationsLoading ? (
              <View style={custom_styles.loadingContainer}>
                {[1, 2, 3].map((item) => (
                  <SkeletonLoader key={item} />
                ))}
              </View>
            ) : stationsLists?.length > 0 ? (
              stationsLists.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={custom_styles.stationCardNew}
                  activeOpacity={0.7}
                >
                  <View style={custom_styles.logoContainer}>
                    <Image
                      source={require("../../../assets/mygas_logo.png")}
                      style={custom_styles.stationLogoRow}
                    />
                    <View style={custom_styles.statusBadge}>
                      <View style={custom_styles.statusDot} />
                      <Text style={custom_styles.statusText}>Open</Text>
                    </View>
                  </View>
                  <View style={custom_styles.stationInfoContainer}>
                    <Text style={custom_styles.stationNameNew} numberOfLines={2}>
                      {item.station_name}
                    </Text>
                    <View style={custom_styles.addressRow}>
                      <Ionicons
                        name="location-outline"
                        size={moderateScale(14)}
                        color="#666"
                      />
                      <Text style={custom_styles.stationAddress} numberOfLines={2}>
                        {item.station_address}
                      </Text>
                    </View>
                    <View style={custom_styles.actionButtons}>
                      <TouchableOpacity
                        style={custom_styles.directionButton}
                        onPress={() => {
                          const lat = item.station_lat;
                          const long = item.station_long;

                          if (Platform.OS === "ios") {
                            // Apple Maps built-in
                            const appleMapsUrl = `http://maps.apple.com/?daddr=${lat},${long}`;
                            Linking.openURL(appleMapsUrl);
                          } else {
                            // Android → Google Maps
                            const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`;
                            Linking.openURL(gmapsUrl);
                          }
                        }}
                      >
                        <Ionicons
                          name="navigate"
                          size={moderateScale(16)}
                          color="#fff"
                        />
                        <Text style={custom_styles.directionButtonText}>Directions</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={custom_styles.callButton}>
                        <Ionicons
                          name="call-outline"
                          size={moderateScale(16)}
                          color="#fe0002"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={custom_styles.emptyState}>
                <Ionicons name="file-tray-outline" size={moderateScale(64)} color="#ccc" />
                <Text style={custom_styles.emptyStateTitle}>No Stations Found</Text>
                <Text style={custom_styles.emptyStateText}>
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'No stations available in your area'}
                </Text>
              </View>
            )}
          </View>

        </Animated.ScrollView>
      </Animated.View>
    </View>
  );
}

const custom_styles = StyleSheet.create({
  top_bar: {
    height: verticalScale(150),
    width: "100%",
    position: "relative",
    minHeight: 120,
  },
  logo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [
      { translateX: -moderateScale(32.5) },
      { translateY: -moderateScale(32.5) }
    ],
    width: moderateScale(65),
    height: moderateScale(65),
    resizeMode: "contain",
    zIndex: 2,
  },
  cardContainer: {
    flex: 1,
    marginTop: -moderateScale(25),
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    position: "relative",
    zIndex: 1,
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
    paddingTop: moderateScale(24),
    paddingHorizontal: moderateScale(16),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
    marginBottom: moderateScale(8),
  },
  title: {
    fontSize: isTablet ? moderateScale(32) : moderateScale(26),
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  subtitle: {
    fontSize: isTablet ? moderateScale(14) : moderateScale(13),
    textAlign: "center",
    color: "#666",
    marginBottom: moderateScale(24),
    paddingHorizontal: moderateScale(20),
    lineHeight: moderateScale(20),
  },
  scrollContent: {
    paddingBottom: moderateScale(50),
    flexGrow: 1,
    paddingHorizontal: moderateScale(16),
    // marginBottom: 80,
  },
  scrollableContentArea: {
    flex: 1,
    width: "100%",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    marginBottom: moderateScale(20),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    width: "100%",
    minHeight: moderateScale(52),
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  searchIconWrapper: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: "#fff5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(15),
    color: "#333",
    paddingVertical: Platform.OS === 'ios' ? moderateScale(8) : 0,
  },
  clearButton: {
    padding: moderateScale(4),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(16),
  },
  sectionTitle: {
    fontSize: isTablet ? moderateScale(20) : moderateScale(18),
    fontWeight: "bold",
    color: "#222",
  },
  countBadge: {
    backgroundColor: "#fe0002",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  countText: {
    color: "#fff",
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  stationCardNew: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(16),
    marginBottom: moderateScale(16),
    marginHorizontal: moderateScale(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    minHeight: moderateScale(120),
    borderWidth: 1,
    borderColor: "#f5f5f5",
  },
  logoContainer: {
    alignItems: "center",
    marginRight: moderateScale(12),
  },
  stationLogoRow: {
    width: moderateScale(48),
    height: moderateScale(48),
    resizeMode: "contain",
    borderRadius: moderateScale(12),
    backgroundColor: "#fff5f5",
    padding: moderateScale(8),
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(8),
    marginTop: moderateScale(6),
  },
  statusDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: "#4caf50",
    marginRight: moderateScale(4),
  },
  statusText: {
    fontSize: moderateScale(10),
    color: "#4caf50",
    fontWeight: "600",
  },
  stationInfoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  stationNameNew: {
    fontSize: isTablet ? moderateScale(18) : moderateScale(16),
    fontWeight: "bold",
    color: "#222",
    marginBottom: moderateScale(6),
    lineHeight: moderateScale(22),
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: moderateScale(12),
  },
  stationAddress: {
    flex: 1,
    fontSize: isTablet ? moderateScale(14) : moderateScale(13),
    color: "#666",
    lineHeight: moderateScale(18),
    marginLeft: moderateScale(4),
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
  },
  directionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fe0002",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(12),
    gap: moderateScale(6),
    flex: 1,
    justifyContent: "center",
  },
  directionButtonText: {
    color: "#fff",
    fontSize: moderateScale(13),
    fontWeight: "600",
  },
  callButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    backgroundColor: "#fff5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffe0e0",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    zIndex: 10,
  },
  loaderLogo: {
    width: moderateScale(90),
    height: moderateScale(90),
    resizeMode: "contain",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(60),
    paddingHorizontal: moderateScale(40),
  },
  emptyStateTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#333",
    marginTop: moderateScale(16),
    marginBottom: moderateScale(8),
  },
  emptyStateText: {
    fontSize: moderateScale(14),
    color: "#777",
    textAlign: "center",
    lineHeight: moderateScale(20),
  },
  loadingContainer: {
    marginTop: moderateScale(8),
  },
  skeletonCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(16),
    marginBottom: moderateScale(16),
    marginHorizontal: moderateScale(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    minHeight: moderateScale(120),
    borderWidth: 1,
    borderColor: "#f5f5f5",
    overflow: "hidden",
  },
  skeletonLogo: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    backgroundColor: "#E8E8E8",
    marginRight: moderateScale(12),
    overflow: "hidden",
  },
  skeletonContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  skeletonTitle: {
    height: moderateScale(18),
    backgroundColor: "#E8E8E8",
    borderRadius: moderateScale(6),
    marginBottom: moderateScale(10),
    width: "70%",
    overflow: "hidden",
  },
  skeletonAddress: {
    height: moderateScale(14),
    backgroundColor: "#E8E8E8",
    borderRadius: moderateScale(6),
    marginBottom: moderateScale(12),
    width: "90%",
    overflow: "hidden",
  },
  skeletonButton: {
    height: moderateScale(36),
    backgroundColor: "#E8E8E8",
    borderRadius: moderateScale(12),
    width: "60%",
    overflow: "hidden",
  },
  skeletonArrow: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    backgroundColor: "#E8E8E8",
    marginLeft: moderateScale(8),
    overflow: "hidden",
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});