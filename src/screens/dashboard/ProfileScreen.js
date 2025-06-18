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
import { useNavigation } from "@react-navigation/native";
import Navbar from "../../components/Navbar";
import { useTheme } from '../../context/ThemeContext'
import BottomTabNavigator from "../../components/BottomNavigation";


const ProfileScreen = () => {
  const {styles} = useTheme();
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState({
    name: "Juan Dela Cruz",
    email: "juandelacruz@gmail.com",
    phone: "+63 123 456 7890",
    memberSince: "2024",
    points: 1250,
  });

  const handleBackPress = () => {
    navigation.goBack();
  };

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
    
    <View style={profile_styles.container}>
      <ImageBackground source={require("../../../assets/mygas-header.jpeg")} style={styles.top_bar}>
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        <Navbar
          onProfilePress={() => console.log("Profile tapped")}
          onNotifPress={() => console.log("Notifications tapped")}
        />
      </ImageBackground>

      <Text style={profile_styles.myAccountTitle}>My Account</Text>

      <ScrollView style={profile_styles.scrollView}>
        <View style={[profile_styles.card]}>
          <View style={profile_styles.profile_info}>
            <Text style={profile_styles.profileName}>{userProfile.name}</Text>
            <Text>{userProfile.phone}</Text>
            <Text>{userProfile.email}</Text>
            <TouchableOpacity
              onPress={handleEditProfile}
              style={profile_styles.editIcon}
            >
              <Ionicons name="create-outline" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={profile_styles.card}
          onPress={handleLoyaltyProgramPress}
        >
          <View style={profile_styles.profile_info}>
          <Text style={profile_styles.profileName}>Loyalty Program</Text>
            <View style={profile_styles.loyaltyProgramContent}>
              <Image
                source={require("../../../assets/mygas_logo.png")}
                style={profile_styles.loyaltyLogo}
              />
              <Text style={profile_styles.motoristaCard}>Motorista Card</Text>
            </View>
            <TouchableOpacity
              onPress={handleEditProfile}
              style={profile_styles.editIcon}
            >
            <Ionicons name="chevron-forward" size={24} color="#333" />

            </TouchableOpacity>
          </View>
          
        </TouchableOpacity>

        <TouchableOpacity style={profile_styles.card} onPress={handleSettingsPress}>
        <View style={profile_styles.loyaltyProgramContent}>
        <Ionicons name="settings-outline" size={24} color="#333" />
              <Text style={profile_styles.settingsText}>Settings</Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={profile_styles.logoutButton} onPress={handleLogout}>
          <Text style={profile_styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* <View style={profile_styles.bottomNavContainer}>
        <BottomTabNavigator />
      </View> */}
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
    width: 100, // Adjust size as needed
    height: 40, // Adjust size as needed
    resizeMode: "contain",
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
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginTop:300,
  },
});

export default ProfileScreen;
