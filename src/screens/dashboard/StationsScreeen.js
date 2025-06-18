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
  RefreshControl
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import { Ionicons } from '@expo/vector-icons';

export default function StationsScreeen() {
  const { styles } = useTheme();
  const mapRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currLat, setCurrLat] = useState(7.102943635598714);
  const [currLong, setCurrLong] = useState(125.58125155146296);
  const [mapLoading, setMapLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const pullAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  const stationsData = [
    {
      id: '1',
      name: 'MyGas Toril 1',
      address: '127 Saavedra St., Toril, Davao City',
      fuelTypes: 'Regular, Premium, Diesel',
      distance: '2.5 km',
      hours: '24/7',
      amenities: 'Convenience Store, Car Wash',
      lat: 7.102943635598714,
      lon: 125.58125155146296,
    },
    {
      id: '2',
      name: 'Mygas Station 2',
      fuelTypes: 'Regular, Premium',
      distance: '5.8 km',
      hours: '6 AM - 10 PM',
      amenities: 'Convenience Store, ATM',
      lat: 7.079302990212743,
      lon: 125.54663569839967,
    },
    {
      id: '3',
      name: 'Mygas Station 3',
      fuelTypes: 'Premium, Diesel',
      distance: '10.2 km',
      hours: '24/7',
      amenities: 'Car Wash, Restroom',
      lat: 7.047592979513302,
      lon: 125.56948195451061
    },
  ];

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
      }, 1200);
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      {/* Loader Overlay */}
      {mapLoading && (
        <View style={custom_styles.loaderOverlay} pointerEvents="auto">
          <Animated.Image
            source={require('../../../assets/mygas_logo.png')}
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

      {/* Header */}
      <ImageBackground
        resizeMode="stretch"
        source={require('../../../assets/mygas-header.jpeg')}
        style={custom_styles.top_bar}
      >
        <LinearGradient
          colors={["rgb(249, 250, 141)", "transparent"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.4 }}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        <Image source={require("../../../assets/mygas_logo.png")} style={custom_styles.logo} />
        <Navbar
          onProfilePress={() => console.log("Profile tapped")}
          onNotifPress={() => console.log("Notifications tapped")}
        />
      </ImageBackground>

      {/* Scrollable Content */}
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

        {/* Map Section */}
        <View style={{ height: 500 }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: currLat,
              longitude: currLong,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onMapReady={() => setMapLoading(false)}
            onRegionChangeComplete={() => setMapLoading(false)}
            moveOnMarkerPress={false}
            scrollEnabled={true}
            zoomEnabled={true}
            rotateEnabled={true}
            pitchEnabled={true}
          >
            {stationsData.map(station => (
              <Marker
                key={station.id}
                coordinate={{ latitude: station.lat, longitude: station.lon }}
                title={station.name}
                description={`Fuel Types: ${station.fuelTypes}\n${station.amenities}`}
              />
            ))}
          </MapView>
        </View>

        {/* Station Cards */}
        <View style={{ flex: 1, paddingTop: 16 }}>
          <Text style={custom_styles.sectionTitle}>Nearby Gasoline Stations</Text>
          {stationsData.map(item => (
            <TouchableOpacity
              key={item.id}
              style={custom_styles.stationCardNew}
              onPress={() => {
                setCurrLat(item.lat);
                setCurrLong(item.lon);
                mapRef.current?.animateToRegion({
                  latitude: item.lat,
                  longitude: item.lon,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                });
              }}
            >
              <Image source={require('../../../assets/mygas_logo.png')} style={custom_styles.stationLogoRow} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={custom_styles.stationNameNew}>{item.name}</Text>
                <Text style={custom_styles.stationAddress}>{item.address}</Text>
                <TouchableOpacity
                  style={custom_styles.directionRow}
                  onPress={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`;
                    Linking.openURL(url);
                  }}
                >
                  <Text style={custom_styles.getDirectionText}>Get Direction</Text>
                  <Ionicons name="paper-plane-outline" size={16} color="#fe0002" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={custom_styles.arrowBtn}>
                <Ionicons name="chevron-forward" size={24} color="#222" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Spacer */}
      <View style={{ height: 70 }} />
    </View>
  );
}

const custom_styles = StyleSheet.create({
    top_bar: {
        height: 150,
        width: '100%',
        position: 'relative',
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
        position: 'relative',
        zIndex: 1
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
        marginBottom: 8
    },
    subtitle: {
        fontSize: 12,
        textAlign: "center",
        color: "#777",
        marginBottom: 20
    },
    scrollContent: {
        paddingBottom: 50,
        flexGrow: 1,
        paddingHorizontal: 16,
    },
    scrollableContentArea: {
        flex: 1,
        width: '100%',
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 20,
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        width: '100%',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginVertical: 10
    },
    stationCardNew: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        marginHorizontal: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        justifyContent: 'space-between',
    },
    stationLogoRow: {
        width: 36,
        height: 36,
        resizeMode: 'contain',
        marginRight: 12,
        marginLeft: 4,
        marginTop: 2,
    },
    stationNameNew: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    stationAddress: {
        fontSize: 15,
        color: '#444',
        marginTop: 2,
    },
    directionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    getDirectionText: {
        color: '#fe0002',
        fontSize: 14,
        fontWeight: '500',
    },
    arrowBtn: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)', // optional dim background
        zIndex: 10,
    },
    loaderLogo: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
    },
    refreshLogoContainer: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 20,
    },
    refreshLogo: {
        width: 48,
        height: 48,
        resizeMode: 'contain',
    },
});
