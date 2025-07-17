import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Linking,
  Dimensions,
  Animated,
  ScrollView,
  TextInput,
  RefreshControl,
  VirtualizedList,
} from "react-native";
import React, { useState, useRef, useEffect, useContext } from "react";
// import MapView, { Marker } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location'
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL, processResponse } from "../../config";
import Mapbox, { UserLocationRenderMode } from "@rnmapbox/maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

const window_height = Dimensions.get('window').height;
Mapbox.setAccessToken('pk.eyJ1IjoicnVpbnplIiwiYSI6ImNrOTd0N3F2bjBpdjkzZnBha3FsZmk4NjcifQ.VprSZLmMu0zRldMobXT6Fg');

export default function StationsScreeen() {
  const { userInfo, userDetails } = useContext(AuthContext);
  const { styles } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currLat, setCurrLat] = useState(7.102943635598714);
  const [currLong, setCurrLong] = useState(125.58125155146296);
  const [showMap, setShowMap] = useState(true);
  const [locationPermission, setLocationPermission] = useState(null);
  const [stationsLists, setStationsLists] = useState(null);
  const getItem = (data, index) => data[index];
  const getItemCount = (data) => data.length;

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

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status);

        // if (status !== 'granted') {
        //   Alert.alert(
        //     "Location Permission Required",
        //     "Please enable location services to find nearby gas stations."
        //   );
        //   return;
        // }

        const location = await Location.getCurrentPositionAsync({});
        const currentLat = location.coords.latitude;
        const currentLong = location.coords.longitude;

        const storedLocation = await AsyncStorage.getItem("lat_long");

        if (storedLocation) {
          const { lat: savedLat, long: savedLong } = JSON.parse(storedLocation);

          if (savedLat !== currentLat || savedLong !== currentLong) {
            await AsyncStorage.setItem("lat_long", JSON.stringify({
              lat: currentLat,
              long: currentLong
            }));
          }

          setCurrLat(savedLat);
          setCurrLong(savedLong);
        } else {
          await AsyncStorage.setItem("lat_long", JSON.stringify({
            lat: currentLat,
            long: currentLong
          }));

          setCurrLat(currentLat);
          setCurrLong(currentLong);
        }
      } catch (error) {
        console.error("Location error:", error);
        Alert.alert(
          "Location Error",
          "Unable to get your current location. Using default location instead."
        );
      }
    })();
  }, []);

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
        setRefreshing(false);
        Animated.timing(pullAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, 1200); // simulate loading
    });
  };

  const getStationLists = (value) => {
    // console.info(value);
    try {
      fetch(`${BASE_URL}customer/station-list?filter=${value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        }
      }).then(processResponse).then((res) => {
        const { statusCode, data } = res;
        // console.log(data.result);
        if (statusCode === 200) {
          setStationsLists(data.result);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStationLists();
  }, []);

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
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={custom_styles.top_bar}
      >
        <LinearGradient
          colors={["rgb(249, 250, 141)", "transparent"]}
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
      </ImageBackground>

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
              tintColor="transparent"
              colors={["transparent"]}
              progressViewOffset={60}
            />
          }
        >
          <View style={custom_styles.headerContainer}>
            <Text style={custom_styles.title}>Locate Stations</Text>
            <Text style={custom_styles.subtitle}>
              Find the nearest MyGas stations and plan your journey with ease!
            </Text>
          </View>

          <View style={custom_styles.searchBarContainer}>
            <Ionicons
              name="compass-outline"
              size={20}
              color="#777"
              style={custom_styles.searchIcon}
            />
            <TextInput
              style={custom_styles.searchInput}
              placeholder="Search Location"
              placeholderTextColor="#777"
              onChangeText={(value) => {
                if (value === "") {
                  getStationLists();
                  setShowMap(true);
                } else {
                  getStationLists(value);
                  setShowMap(false);
                }
              }}
            />
          </View>

          {showMap ?
            <>
              <View style={{ height: 200 }}>
                {/* Map Here */}
                <Mapbox.MapView
                  style={{ flex: 1 }}
                  onDidFinishRenderingMapFully={() => setMapLoading(false)}
                  onMapIdle={() => setMapLoading(false)}
                  compassEnabled={true}
                  onTouchStart={() => scrollY.setValue(0)}
                  zoomEnabled={true}
                  scrollEnabled={true}
                  rotateEnabled={true}
                  pitchEnabled={true}
                  logoEnabled={false}
                  attributionEnabled={false}
                  scaleBarEnabled={false}
                  styleURL={`mapbox://styles/mapbox/navigation-day-v1`}
                >
                  <Mapbox.UserLocation
                    androidRenderMode='gps'
                    visible={true}
                    requestsAlwaysUse={true}
                  />
                  {currLat && currLong && !isNaN(currLat) && !isNaN(currLong) && (
                    <Mapbox.Camera
                      // followUserLocation={true}
                      // followUserMode="normal"
                      zoomLevel={13}
                      centerCoordinate={[currLong, currLat]}
                      animationMode='flyTo'
                      animationDuration={2000}
                      // pitch={0}
                    />
                  )}
                  {stationsLists?.map((item, index) => {
                    const lat = item?.station_lat;
                    const long = item?.station_long;

                    if (lat != null && long != null) {
                      return (
                        <Mapbox.PointAnnotation
                          id={index.toString()}
                          key={index}
                          coordinate={[parseFloat(long), parseFloat(lat)]}
                        >
                          <Mapbox.Callout
                            title={item.station_name}
                            snippet={item.station_address}
                          />
                        </Mapbox.PointAnnotation>
                      );
                    }

                    return null;
                  })}
                </Mapbox.MapView>
              </View>
            </>
            :
            null
          }
          <View style={{ flex: 1, paddingTop: 16 }}>
            <Text style={custom_styles.sectionTitle}>
              Nearby Gasoline Stations
            </Text>
            {stationsLists?.map((item, index) => (
              <View key={item.id} style={custom_styles.stationCardNew}>
                <Image
                  source={require("../../../assets/mygas_logo.png")}
                  style={custom_styles.stationLogoRow}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={custom_styles.stationNameNew}>{item.station_name}</Text>
                  <Text style={custom_styles.stationAddress}>
                    {item.station_address}
                  </Text>
                  <TouchableOpacity
                    style={custom_styles.directionRow}
                    onPress={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${item.station_lat},${item.station_long}`;
                      Linking.openURL(url);
                    }}
                  >
                    <Text style={custom_styles.getDirectionText}>
                      Get Direction
                    </Text>
                    <Ionicons
                      name="paper-plane-outline"
                      size={16}
                      color="#fe0002"
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={custom_styles.arrowBtn}>
                  <Ionicons name="chevron-forward" size={24} color="#222" />
                </TouchableOpacity>
              </View>
            )) || null}
          </View>
        </Animated.ScrollView>
      </Animated.View>
    </View>
  );
}

const custom_styles = StyleSheet.create({
  top_bar: {
    height: 150,
    width: "100%",
    position: "relative",
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
  cardContainer: {
    flex: 1,
    marginTop: -20,
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "relative",
    zIndex: 1,
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: 16,
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
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 50,
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  scrollableContentArea: {
    flex: 1,
    width: "100%",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: "100%",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  stationCardNew: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    justifyContent: "space-between",
  },
  stationLogoRow: {
    width: 36,
    height: 36,
    resizeMode: "contain",
    marginRight: 12,
    marginLeft: 4,
    marginTop: 2,
  },
  stationNameNew: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  stationAddress: {
    fontSize: 15,
    color: "#444",
    marginTop: 2,
  },
  directionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  getDirectionText: {
    color: "#fe0002",
    fontSize: 14,
    fontWeight: "500",
  },
  arrowBtn: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)", // optional dim background
    zIndex: 10,
  },
  loaderLogo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  refreshLogoContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
  },
  refreshLogo: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
});
