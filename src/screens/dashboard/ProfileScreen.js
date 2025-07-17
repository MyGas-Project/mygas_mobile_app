import React, { useContext, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import DateTimePicker from '@react-native-community/datetimepicker';

const ProfileScreen = () => {
  const { userInfo, userDetails, updateUserDetails } = useContext(AuthContext);
  const [showDetails, setShowDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editedDetails, setEditedDetails] = useState({ ...userDetails });

  const { styles } = useTheme();
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const route = useRoute();

  const handleEditProfile = () => {
    setShowDetails(true);
  };

  const handleEditPress = () => {
    setEditMode(true);
    setEditedDetails({ ...userDetails });
  };

  const handleSaveChanges = () => {
    updateUserDetails(editedDetails);
    setEditMode(false);
    Alert.alert("Success", "Your profile has been updated");
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedDetails({ ...userDetails });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setEditedDetails({ ...editedDetails, birthdate: formattedDate });
    }
  };

  const handleLoyaltyProgramPress = () => {
    console.log("Loyalty Program pressed");
  };

  const handleSettingsPress = () => {
    console.log("Settings pressed");
  };

  const handleLogout = (data) => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(data) },
    ]);
  };

  const scrollY = useRef(new Animated.Value(0)).current;
  const cardContainerTranslateY = scrollY.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: [20, 0, -20],
    extrapolate: "clamp",
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
          { transform: [{ translateY: cardContainerTranslateY }] },
        ]}
      >
        <Animated.ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={profile_styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <Text style={profile_styles.myAccountTitle}>My Account</Text>

          {showDetails ? (
            <View style={profile_styles.card}>
              <View style={profile_styles.headerRow}>
                <Text style={profile_styles.profileName}>User Details</Text>
                {!editMode && (
                  <TouchableOpacity onPress={handleEditPress} style={profile_styles.editButton}>
                    <Ionicons name="create-outline" size={20} color="#4a90e2" />
                    <Text style={profile_styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* PERSONAL INFO */}
              <Text style={profile_styles.sectionTitle}>Personal Information</Text>
              <View style={profile_styles.divider} />

              <View style={profile_styles.row}>
                <View style={profile_styles.col}>
                  <Text style={profile_styles.profileLabel}>Gender</Text>
                  {editMode ? (
                    <TextInput
                      style={profile_styles.input}
                      value={editedDetails.gender}
                      onChangeText={(text) => setEditedDetails({ ...editedDetails, gender: text })}
                    />
                  ) : (
                    <Text style={profile_styles.profileValue}>{userDetails?.gender || "N/A"}</Text>
                  )}
                </View>
                <View style={profile_styles.col}>
                  <Text style={profile_styles.profileLabel}>Civil Status</Text>
                  {editMode ? (
                    <TextInput
                      style={profile_styles.input}
                      value={editedDetails.civil_status}
                      onChangeText={(text) => setEditedDetails({ ...editedDetails, civil_status: text })}
                    />
                  ) : (
                    <Text style={profile_styles.profileValue}>{userDetails?.civil_status || "N/A"}</Text>
                  )}
                </View>
              </View>

              <View style={profile_styles.row}>
                <View style={profile_styles.col}>
                  <Text style={profile_styles.profileLabel}>Birth Date</Text>
                  {editMode ? (
                    <>
                      <TouchableOpacity
                        style={profile_styles.input}
                        onPress={() => setShowDatePicker(true)}
                      >
                        <Text>{editedDetails.birthdate || "Select date"}</Text>
                      </TouchableOpacity>
                      {showDatePicker && (
                        <DateTimePicker
                          value={new Date(editedDetails.birthdate || Date.now())}
                          mode="date"
                          display="default"
                          onChange={handleDateChange}
                        />
                      )}
                    </>
                  ) : (
                    <Text style={profile_styles.profileValue}>{userDetails?.birthdate || "N/A"}</Text>
                  )}
                </View>
                <View style={profile_styles.col}>
                  <Text style={profile_styles.profileLabel}>ID Presented</Text>
                  {editMode ? (
                    <TextInput
                      style={profile_styles.input}
                      value={editedDetails.id_presented}
                      onChangeText={(text) => setEditedDetails({ ...editedDetails, id_presented: text })}
                    />
                  ) : (
                    <Text style={profile_styles.profileValue}>{userDetails?.id_presented || "N/A"}</Text>
                  )}
                </View>
              </View>

              {/* CONTACT INFO */}
              <Text style={profile_styles.sectionTitle}>Contact Information</Text>
              <View style={profile_styles.divider} />

              <View style={profile_styles.colFull}>
                <Text style={profile_styles.profileLabel}>Phone Number</Text>
                {editMode ? (
                  <TextInput
                    style={profile_styles.input}
                    value={editedDetails.phone_number}
                    onChangeText={(text) => setEditedDetails({ ...editedDetails, phone_number: text })}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={profile_styles.profileValue}>
                    {userDetails?.phone_number || "N/A"}
                  </Text>
                )}
              </View>

              <View style={profile_styles.colFull}>
                <Text style={profile_styles.profileLabel}>Email</Text>
                {editMode ? (
                  <TextInput
                    style={profile_styles.input}
                    value={editedDetails.email}
                    onChangeText={(text) => setEditedDetails({ ...editedDetails, email: text })}
                    keyboardType="email-address"
                  />
                ) : (
                  <Text style={profile_styles.profileValue}>
                    {userDetails?.email || "Not provided"}
                  </Text>
                )}
              </View>

              <View style={profile_styles.colFull}>
                <Text style={profile_styles.profileLabel}>Address</Text>
                {editMode ? (
                  <TextInput
                    style={[profile_styles.input, { height: 60 }]}
                    value={editedDetails.address}
                    onChangeText={(text) => setEditedDetails({ ...editedDetails, address: text })}
                    multiline
                  />
                ) : (
                  <Text style={profile_styles.profileValue}>
                    {userDetails?.address || "N/A"}
                  </Text>
                )}
              </View>

              {editMode && (
                <View style={profile_styles.editButtonsContainer}>
                  <TouchableOpacity
                    onPress={handleCancelEdit}
                    style={[profile_styles.editActionButton, { backgroundColor: '#f5f5f5' }]}
                  >
                    <Text style={[profile_styles.editActionButtonText, { color: '#333' }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveChanges}
                    style={[profile_styles.editActionButton, { backgroundColor: '#4a90e2' }]}
                  >
                    <Text style={[profile_styles.editActionButtonText, { color: '#fff' }]}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!editMode && (
                <TouchableOpacity
                  onPress={() => setShowDetails(false)}
                  style={[profile_styles.logoutButton, { marginTop: 30, borderColor: "#ccc" }]}
                >
                  <Text style={[profile_styles.logoutButtonText, { color: "#333" }]}>Close</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <View style={[profile_styles.card]}>
                <View style={profile_styles.profile_info}>
                  <Text style={profile_styles.profileName}>
                    {userDetails?.first_name || ""},{" "}
                    {userDetails?.middle_name ? userDetails.middle_name.charAt(0) + "." : ""}{" "}
                    {userDetails?.last_name || ""}
                  </Text>
                  <Text style={profile_styles.profileText}>{userDetails?.phone_number}</Text>
                  <Text style={profile_styles.profileText}>{userDetails?.email || "No email yet!"}</Text>
                  <TouchableOpacity
                    onPress={handleEditProfile}
                    style={profile_styles.editIcon}
                  >
                    <Ionicons name="create-outline" size={20} color="#4a90e2" />
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
                    <Ionicons name="chevron-forward" size={24} color="#4a90e2" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={profile_styles.card}
                onPress={handleSettingsPress}
              >
                <View style={profile_styles.loyaltyProgramContent}>
                  <Ionicons name="settings-outline" size={24} color="#4a90e2" />
                  <Text style={profile_styles.settingsText}>Settings</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={profile_styles.logoutButton}
                onPress={() => handleLogout(userInfo)}
              >
                <Text style={profile_styles.logoutButtonText}>Log Out</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Add padding at the bottom to prevent navbar overlap */}
          <View style={{ height: 80 }} />
        </Animated.ScrollView>
      </Animated.View>
    </View>
  );
};

const profile_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: -20,
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "relative",
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 100, // Added padding to prevent navbar overlap
  },
  headerRight: {
    position: "absolute",
    right: 16,
    top: 50,
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  headerImage: {
    width: "100%",
    height: 200,
  },
  profile_info: {
    fontSize: 16,
    color: "#666",
    marginBottom: 2,
    textAlign: "left",
  },
  headerIcon: {
    padding: 5,
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
  profileText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
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
    color: "#666",
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
    marginTop: 100,
    marginBottom: 20,
    borderColor: "red",
    borderWidth: 1,
  },
  logoutButtonText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerLeft: {
    position: "absolute",
    left: 16,
    top: 50,
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 6,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  col: {
    flex: 1,
    paddingRight: 10,
  },
  colFull: {
    marginBottom: 16,
  },
  profileLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  profileValue: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 20,
  },
  editButtonText: {
    color: '#4a90e2',
    marginLeft: 5,
    fontWeight: '500',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20, // Added margin to prevent overlap
  },
  editActionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  editActionButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;