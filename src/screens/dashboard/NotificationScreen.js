import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Navbar from "../../components/Navbar";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";

const NotificationScreen = () => {
  const { styles } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  // Add navigation handlers for bottom tabs
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // Prevent default behavior
      e.preventDefault();
      // Navigate to the tab
      navigation.navigate(e.target.split("-")[0]);
    });

    return unsubscribe;
  }, [navigation]);

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

  const handleEditProfile = () => {
    console.log("Edit profile pressed");
    // Navigate to an edit profile screen or open a modal
  };

  const handleLoyaltyProgramPress = () => {
    console.log("Loyalty Program pressed");
    // Navigate to Loyalty Program screen
  };

  const handleSettingsPress = () => {
    console.log("Settings pressed");
    // Navigate to Settings screen
  };

  const handleLogout = () => {
    console.log("Logout pressed");
    // Implement logout logic
  };

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
          contentContainerStyle={[
            notif_styles.notificationList,
            { paddingBottom: 80 },
          ]}
        />
      </View>
    </View>
  );
};

const profile_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerImage: {
    width: "100%",
    height: 200,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    paddingTop: 50, // Adjust for status bar
    backgroundColor: "white",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },

  profile_info:{
    fontSize: 16,
    color: "#666",
    marginBottom: 2,
    textAlign: "left",
  },
  headerIcon: {
    padding: 5,
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
  headerRight: {
    flexDirection: "row",
  },
  myAccountTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    position: "relative",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
  },
  // profilePhone: {
  //   fontSize: 16,
  //   color: "#666",
  //   marginBottom: 2,
  //   textAlign: "left",
  // },
  profileEmail: {
    fontSize: 16,
    color: "#666",
    textAlign: "left",
  },
  editIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  loyaltyWrapper: {
    flex: 1,
  },
  
  loyaltyLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: "contain",
  },
  loyaltyProgramContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  motoristaCard: {
    fontSize: 16,
    color: "#666"

  },
  settingsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 150,
    marginBottom: 30, // Add some bottom padding
    borderColor: "red",
    borderWidth: 1,
  },
  logoutButtonText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
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

export default ProfileScreen;