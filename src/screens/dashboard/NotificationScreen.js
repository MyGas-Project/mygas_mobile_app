import React, { useContext, useEffect, useState } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import Navbar from "../../components/Navbar";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL, processResponse } from "../../config";

const NotificationScreen = () => {
  const { userInfo, userData } = useContext(AuthContext);

  const { styles } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  // Add navigation handlers for bottom tabs
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      e.preventDefault();
      navigation.navigate(e.target.split("-")[0]);
    });

    return unsubscribe;
  }, [navigation]);

  const [notifications, setNotifications] = useState({});

  const renderNotification = (item) => (
    <TouchableOpacity
      style={notif_styles.notificationItem}
      onPress={() => {
        // Handle notification press, e.g., navigate to details
        console.log("Notification pressed:", item.transaction_number);
      }}
    >
      <View style={notif_styles.notificationContent}>
        <Text style={notif_styles.notificationDescription}>
          {item.type === "Earn" ? `You have purchased PHP ${item.amount} fuel ${item.service}` : `You have redeemed ${item.points}`}
        </Text>
        <Text style={notif_styles.notificationStation}>{item.station_name}</Text>
        <Text style={notif_styles.notificationPoints}>
          {item.points}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const customer_notification = () => {
    try {
      fetch(`${BASE_URL}customer/customer-notifications`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        }
      }).then(processResponse).then((res) => {
        const { statusCode, data } = res;
        // console.log(data.result);
        setNotifications(data.result);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    customer_notification();
  }, [])


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
        <Navbar
          onProfilePress={() => console.log("Profile tapped")}
          onNotifPress={() => console.log("Notifications tapped")}
        />
      </ImageBackground>
      <View style={notif_styles.cardContainer}>
        <Text style={notif_styles.pageTitle}>Notifications</Text>
        <FlatList
          data={notifications}
          renderItem={({ item }) => renderNotification(item)}
          keyExtractor={(item) => item.transaction_number}
          contentContainerStyle={[
            notif_styles.notificationList,
            { paddingBottom: 80 },
          ]}
        />
      </View>
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
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -40 }, { translateY: -40 }],
    width: 65,
    height: 65,
    resizeMode: "contain",
    zIndex: 2,
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
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 999,
  },
  top_bar: {
    height: 150,
    width: "100%",
    position: "relative",
  },
  headerLeft: {
    position: "absolute",
    left: 16,
    top: 50,
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
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
    zIndex: 1,
  },
});

export default NotificationScreen;