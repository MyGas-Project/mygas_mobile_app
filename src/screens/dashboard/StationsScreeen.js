import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Linking,
} from "react-native";
import React, { useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";

export default function StationsScreeen() {
  const { styles } = useTheme();
  const mapRef = useRef(null);
  const [currLat, setCurrLat] = useState(7.102943635598714);
  const [currLong, setCurrLong] = useState(125.58125155146296);
  const stationsData = [
    {
      id: "1",
      name: "Mygas Station 1",
      fuelTypes: "Regular, Premium, Diesel",
      distance: "2.5 km",
      hours: "24/7",
      amenities: "Convenience Store, Car Wash",
      lat: 7.102943635598714,
      lon: 125.58125155146296,
    },
    {
      id: "2",
      name: "Mygas Station 2",
      fuelTypes: "Regular, Premium",
      distance: "5.8 km",
      hours: "6 AM - 10 PM",
      amenities: "Convenience Store, ATM",
      lat: 7.079302990212743,
      lon: 125.54663569839967,
    },
    {
      id: "3",
      name: "Mygas Station 3",
      fuelTypes: "Premium, Diesel",
      distance: "10.2 km",
      hours: "24/7",
      amenities: "Car Wash, Restroom",
      lat: 7.047592979513302,
      lon: 125.56948195451061,
    },
  ];
  return (
    <View style={styles.tabScreen}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        <Navbar
          onProfilePress={() => console.log("Profile tapped")}
          onNotifPress={() => console.log("Notifications tapped")}
        />
      </ImageBackground>
      <View style={{ width: "100%", paddingTop: 16, paddingHorizontal: 16 }}>
        <Text
          style={[
            styles.text,
            styles.text_md,
            styles.text_bold,
            styles.text_primary,
          ]}
        >
          Locate Stations
        </Text>
      </View>
      <View style={{ flex: 1, width: "100%", padding: 20 }}>
        <View style={{ height: "50%" }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: currLat,
              longitude: currLong,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {stationsData.map((station) => (
              <Marker
                key={station.id}
                coordinate={{
                  latitude: station.lat,
                  longitude: station.lon,
                }}
                title={station.name}
                description={`Fuel Types: ${station.fuelTypes}\n${station.amenities}`}
              />
            ))}
          </MapView>
        </View>

        {/* Gasoline Station List section */}
        <View style={{ flex: 1, paddingTop: 16 }}>
          <Text
            style={[
              styles.text,
              styles.text_md,
              styles.text_bold,
              styles.text_primary,
            ]}
          >
            Nearby Gasoline Stations
          </Text>
          <FlatList
            data={stationsData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={custom_styles.stationCard}
                onPress={() => {
                  setCurrLat(item.lat);
                  setCurrLong(item.lon);
                  mapRef.current?.animateToRegion(
                    {
                      latitude: item.lat,
                      longitude: item.lon,
                      latitudeDelta: 0.02,
                      longitudeDelta: 0.02,
                    },
                    1000
                  );
                }}
              >
                <View style={custom_styles.stationInfo}>
                  <Text style={custom_styles.stationName}>{item.name}</Text>
                  <Text style={custom_styles.fuelTypes}>
                    Fuel Types: {item.fuelTypes}
                  </Text>
                  <Text style={custom_styles.stationDistance}>
                    {item.distance}
                  </Text>
                  <Text style={custom_styles.operatingHours}>
                    Hours: {item.hours}
                  </Text>
                  <Text style={custom_styles.amenities}>
                    Amenities: {item.amenities}
                  </Text>

                  <TouchableOpacity
                    style={custom_styles.directionsButton}
                    onPress={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`;
                      Linking.openURL(url);
                    }}
                  >
                    <Text style={custom_styles.directionsButtonText}>
                      Get Directions
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={custom_styles.iconContainer}>
                  <Image
                    source={require("../../../assets/gas-station.png")}
                    style={custom_styles.icon}
                  />
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ padding: 10 }}
          />
        </View>
      </View>
      <View style={{ height: 70 }}></View>
    </View>
  );
}
const custom_styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#333",
  },
  stationCard: {
    flexDirection: "row",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  fuelTypes: {
    fontSize: 14,
    color: "#555",
  },
  stationDistance: {
    fontSize: 12,
    color: "#999",
  },
  operatingHours: {
    fontSize: 12,
    color: "#999",
  },
  amenities: {
    fontSize: 12,
    color: "#555",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  text: {
    fontFamily: "Arial",
  },
  directionsButton: {
    marginTop: 10,
    backgroundColor: "#fe0002",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  directionsButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
