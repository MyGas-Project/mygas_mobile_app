import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Navbar from "../../components/Navbar";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import BottomTabNavigator from "../../components/BottomNavigation";

const NotificationScreen = () => {
  const { styles } = useTheme();

  const navigation = useNavigation();
  const route = useRoute();
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      description: "You have purchased PHP 1000 fuel diesel",
      station: "MyGas Toril 1",
      points_earned: "1.00 points earned"
    },
    {
      id: "2",
      description: "You have purchased PHP 500 fuel diesel",
      station: "MyGas Buhangin",
      points_earned: "0.50 points earned"
    },
    {
      id: "3",
      description: "You have purchased PHP 1000 engine oil",
      station: "MyGas Cabantian",
      points_earned: "0.25 points earned"
    }
  ]);

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={notif_styles.notificationItem}
      onPress={() => {
        // Handle notification press, e.g., navigate to details
        console.log("Notification pressed:", item.id);
      }}
    >
      <View style={notif_styles.notificationContent}>
        <Text style={notif_styles.notificationDescription}>
          {item.description}
        </Text>
        <Text style={notif_styles.notificationStation}>{item.station}</Text>
        <Text style={notif_styles.notificationPoints}>
          {item.points_earned}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={notif_styles.top_bar}
      >
        <LinearGradient
          colors={["rgb(249, 250, 141)", "transparent"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.4 }}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        <Image
          source={require("../../../assets/mygas_logo.png")}
          style={notif_styles.logo}
        />
        <Navbar />
      </ImageBackground>
      <View style={notif_styles.cardContainer}>
        <Text style={notif_styles.pageTitle}>Notifications</Text>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[notif_styles.notificationList, { paddingBottom: 80 }]}
        />
      </View>
      <View style={notif_styles.bottomNavContainer}>
        <BottomTabNavigator />
      </View>
    </View>
  );
};

const notif_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  headerImage: {
    width: "100%",
    height: 150, // Adjust height as needed
    justifyContent: "center",
    alignItems: "center"
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 30 // Adjust for status bar
  },
  backButton: {
    padding: 10
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
  headerIcons: {
    flexDirection: "row"
  },
  iconButton: {
    marginLeft: 15,
    padding: 5
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333"
  },
  notificationList: {
    paddingHorizontal: 20
  },
  notificationItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3
  },
  notificationDescription: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5
  },
  notificationStation: {
    fontSize: 14,
    color: "#666"
  },
  notificationPoints: {
    fontSize: 14,
    color: "#666",
    marginTop: 2
  },
  bottomNavContainer: {
    backgroundColor: "#fff",
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 999
  },
  top_bar: {
    height: 150,
    width: "100%",
    position: "relative"
  },
  headerLeft: {
    position: "absolute",
    left: 16,
    top: 50,
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center"
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: -20,
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "relative",
    zIndex: 1
  }
});

export default NotificationScreen;
