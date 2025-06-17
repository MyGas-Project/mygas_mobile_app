import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import BottomTabNavigator from "../../components/BottomNavigation";

const ProfileScreen = () => {
  const { styles } = useTheme();
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const route = useRoute();
  const [userProfile, setUserProfile] = useState({
    name: "Juan Dela Cruz",
    email: "juandelacruz@gmail.com",
    phone: "+63 123 456 7890",
    memberSince: "2024",
    points: 1250
  });

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

  const handleLogout = (navigate) => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(navigate) },
    ]);
  };

  // Animation for card container
  const scrollY = useRef(new Animated.Value(0)).current;
  const cardContainerTranslateY = scrollY.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: [20, 0, -20],
    extrapolate: "clamp"
  });

  return (
    <View style={profile_styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={profile_styles.top_bar}
      >
        <LinearGradient
          colors={["rgb(249, 250, 141)", "transparent"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.4 }}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        <Image
          source={require("../../../assets/mygas_logo.png")}
          style={profile_styles.logo}
        />
        <Navbar />
      </ImageBackground>
      <Animated.View
        style={[
          profile_styles.cardContainer,
          { transform: [{ translateY: cardContainerTranslateY }] }
        ]}
      >
        <Animated.ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={{ paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <Text style={profile_styles.myAccountTitle}>My Account</Text>
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
          <TouchableOpacity
            style={profile_styles.card}
            onPress={handleSettingsPress}
          >
            <View style={profile_styles.loyaltyProgramContent}>
              <Ionicons name="settings-outline" size={24} color="#333" />
              <Text style={profile_styles.settingsText}>Settings</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
          style={profile_styles.logoutButton}
          onPress={() => handleLogout(navigation)}
        >
          <Text style={profile_styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
        </Animated.ScrollView>
      </Animated.View>
      <View style={profile_styles.bottomNavContainer}>
        <BottomTabNavigator />
      </View>
    </View>
  );
};

const profile_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  top_bar: {
    height: 150,
    width: "100%",
    position: "relative"
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
  },
  headerRight: {
    position: "absolute",
    right: 16,
    top: 50,
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center"
  },
  headerImage: {
    width: "100%",
    height: 200
  },
  profile_info: {
    fontSize: 16,
    color: "#666",
    marginBottom: 2,
    textAlign: "left"
  },
  headerIcon: {
    padding: 5
  },
  myAccountTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333"
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20
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
    position: "relative"
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left"
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
    textAlign: "left"
  },
  editIcon: {
    position: "absolute",
    top: 20,
    right: 20
  },
  loyaltyWrapper: {
    flex: 1
  },

  loyaltyLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: "contain"
  },
  loyaltyProgramContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5
  },
  motoristaCard: {
    fontSize: 16,
    color: "#666"
  },
  settingsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    flex: 1
  },
  logoutButton: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 150,
    marginBottom: 30, // Add some bottom padding
    borderColor: "red",
    borderWidth: 1
  },
  logoutButtonText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold"
  },
  bottomNavContainer: {
    backgroundColor: "#fff",
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 999
  },
  headerLeft: {
    position: "absolute",
    left: 16,
    top: 50,
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center"
  }
});

export default ProfileScreen;
