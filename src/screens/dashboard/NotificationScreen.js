import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Navbar from "../../components/Navbar";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";

const NotificationScreen = () => {
  const { styles } = useTheme();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      description: "You have purchased PHP 1000 fuel diesel",
      station: "MyGas Toril 1",
      points_earned: "1.00 points earned",
    },
    {
      id: "2",
      description: "You have purchased PHP 500 fuel diesel",
      station: "MyGas Buhangin",
      points_earned: "0.50 points earned",
    },
    {
      id: "3",
      description: "You have purchased PHP 1000 engine oil",
      station: "MyGas Cabantian",
      points_earned: "0.25 points earned",
    },
  ]);

  const handleBackPress = () => {
    navigation.goBack();
  };

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
    <View style={notif_styles.cardContainer}>
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

      <Text style={notif_styles.pageTitle}>Notifications</Text>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={notif_styles.notificationList}
      />
      {/* <View style={notif_styles.bottomNavContainer}>
        <BottomTabNavigator />
      </View> */}
    </View>
  );
};

const notif_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerImage: {
    width: "100%",
    height: 150, // Adjust height as needed
    justifyContent: "center",
    alignItems: "center",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 30, // Adjust for status bar
  },
  backButton: {
    padding: 10,
  },
  logo: {
    width: 100, // Adjust size as needed
    height: 40, // Adjust size as needed
    resizeMode: "contain",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  notificationList: {
    paddingHorizontal: 20,
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
    elevation: 3,
  },
  notificationDescription: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  notificationStation: {
    fontSize: 14,
    color: "#666",
  },
  notificationPoints: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  bottomNavContainer: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginTop:300,
  },
});

export default NotificationScreen;
