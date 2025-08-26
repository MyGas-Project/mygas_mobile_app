import React, { useContext, useState, useRef, useEffect } from "react";
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
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import DateTimePicker from '@react-native-community/datetimepicker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive helper functions
const wp = (percentage) => {
  return (percentage * screenWidth) / 100;
};

const hp = (percentage) => {
  return (percentage * screenHeight) / 100;
};

const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 375;

// Global state to persist the showDetails state
let globalShowDetails = false;

const ProfileScreen = () => {
  const { userInfo, userDetails, updateUserDetails } = useContext(AuthContext);
  const [showDetails, setShowDetails] = useState(globalShowDetails);
  const [editMode, setEditMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editedDetails, setEditedDetails] = useState({ ...userDetails });

  const { styles } = useTheme();
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const route = useRoute();

  // Update global state whenever local state changes
  let globalShowDetails = false;

  useEffect(() => {
    globalShowDetails = showDetails;
  }, [showDetails]);

  // Reset edit mode when the screen is focused (when returning from another screen)
  useFocusEffect(
    React.useCallback(() => {
      setEditMode(false);
      setShowDetails(false); // <-- force hide details when screen is refocused
      setEditedDetails({ ...userDetails });
    }, [userDetails])
  );


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

  // New function to handle birthday edit attempt
  const handleBirthdayEditAttempt = () => {
    Alert.alert(
      "Birthday Change Required",
      "To change your birthday, please visit any of our gas stations with a valid ID. Our staff will assist you with updating this information.",
      [
        { text: "OK", style: "default" }
      ]
    );
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
    <KeyboardAvoidingView
      style={profile_styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
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
                    <Ionicons name="create-outline" size={wp(5)} color="#4a90e2" />
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
                  {showDatePicker && (
                    <DateTimePicker
                      value={new Date(editedDetails.birthdate || Date.now())}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                  {editMode ? (
                    <TouchableOpacity
                      style={[profile_styles.input, profile_styles.disabledInput]}
                      onPress={handleBirthdayEditAttempt}
                    >
                      <Text style={profile_styles.disabledInputText}>
                        {editedDetails.birthdate || "Select date"}
                      </Text>
                      <Ionicons name="information-circle-outline" size={wp(4)} color="#666" style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
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
                  <View style={[profile_styles.input, profile_styles.disabledInput]}>
                    <Text style={profile_styles.disabledInputText}>
                      {editedDetails.phone_number || "N/A"}
                    </Text>
                  </View>
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
                    style={[profile_styles.input, { height: hp(8) }]}
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
                  style={[profile_styles.logoutButton, { marginTop: hp(4), borderColor: "#ccc" }]}
                >
                  <Text style={[profile_styles.logoutButtonText, { color: "#333" }]}>Close</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[profile_styles.card]}
                onPress={handleEditProfile}
                activeOpacity={0.7}
              >
                <View style={profile_styles.profile_content}>
                  <View style={profile_styles.profile_text_container}>
                    <Text style={profile_styles.profileName}>
                      {userDetails?.first_name || ""},{" "}
                      {userDetails?.middle_name ? userDetails.middle_name.charAt(0) + "." : ""}{" "}
                      {userDetails?.last_name || ""}
                    </Text>
                    <Text style={profile_styles.profileText}>{userDetails?.phone_number}</Text>
                    <Text style={profile_styles.profileText}>{userDetails?.email || "No email yet!"}</Text>
                  </View>
                  <View style={profile_styles.editIconContainer}>
                    <Ionicons name="create-outline" size={wp(5)} color="#4a90e2" />
                  </View>
                </View>
              </TouchableOpacity>

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
                    <Ionicons name="chevron-forward" size={wp(6)} color="#4a90e2" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={profile_styles.card}
                onPress={handleSettingsPress}
              >
                <View style={profile_styles.loyaltyProgramContent}>
                  <Ionicons name="settings-outline" size={wp(6)} color="#4a90e2" />
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
          <View style={{ height: hp(10) }} />
        </Animated.ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const profile_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  top_bar: {
    height: hp(20),
    width: "100%",
    position: "relative",
  },
  logo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -wp(8) }, { translateY: -wp(8) }],
    width: wp(16),
    height: wp(16),
    resizeMode: "contain",
    zIndex: 2,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: wp(4),
    alignItems: "center",
    marginTop: -hp(2.5),
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    position: "relative",
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: hp(1.5),
    paddingBottom: hp(12),
  },
  headerRight: {
    position: "absolute",
    right: wp(4),
    top: hp(6),
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  headerImage: {
    width: "100%",
    height: hp(25),
  },
  profile_info: {
    fontSize: wp(4),
    color: "#666",
    marginBottom: hp(0.3),
    textAlign: "left",
  },
  headerIcon: {
    padding: wp(1.2),
  },
  myAccountTitle: {
    fontSize: isTablet ? wp(4.5) : wp(6),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: hp(2.5),
    color: "#333",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  card: {
    backgroundColor: "white",
    borderRadius: wp(2.5),
    padding: wp(5),
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    position: "relative",
    minHeight: isSmallScreen ? hp(8) : hp(6),
  },
  profileName: {
    fontSize: isTablet ? wp(3.5) : wp(5),
    fontWeight: "bold",
    marginBottom: hp(0.6),
    textAlign: "left",
  },
  profileText: {
    fontSize: isTablet ? wp(3) : wp(4),
    color: "#666",
    marginBottom: hp(0.6),
  },
  profileEmail: {
    fontSize: isTablet ? wp(3) : wp(4),
    color: "#666",
    textAlign: "left",
  },
  editIcon: {
    position: "absolute",
    top: hp(2.5),
    right: wp(5),
  },
  loyaltyWrapper: {
    flex: 1,
  },
  loyaltyLogo: {
    width: wp(7.5),
    height: wp(7.5),
    marginRight: wp(2.5),
    resizeMode: "contain",
  },
  loyaltyProgramContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.6),
  },
  motoristaCard: {
    fontSize: isTablet ? wp(3) : wp(4),
    color: "#666",
  },
  settingsText: {
    fontSize: isTablet ? wp(3.5) : wp(4.5),
    fontWeight: "bold",
    marginLeft: wp(3.7),
    flex: 1,
  },
  logoutButton: {
    backgroundColor: "white",
    borderRadius: wp(2.5),
    padding: hp(2),
    alignItems: "center",
    marginTop: hp(12),
    marginBottom: hp(2.5),
    borderColor: "red",
    borderWidth: 1,
  },
  logoutButtonText: {
    color: "red",
    fontSize: isTablet ? wp(3.5) : wp(4.5),
    fontWeight: "bold",
  },
  headerLeft: {
    position: "absolute",
    left: wp(4),
    top: hp(6),
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: isTablet ? wp(3) : wp(4),
    marginTop: hp(1.2),
    marginBottom: hp(0.7),
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: hp(1.2),
  },
  row: {
    flexDirection: isSmallScreen ? "column" : "row",
    justifyContent: "space-between",
    marginBottom: hp(2),
  },
  col: {
    flex: 1,
    paddingRight: isSmallScreen ? 0 : wp(2.5),
    marginBottom: isSmallScreen ? hp(1) : 0,
  },
  colFull: {
    marginBottom: hp(2),
  },
  profileLabel: {
    fontSize: isTablet ? wp(2.5) : wp(3.5),
    color: "#888",
    marginBottom: hp(0.5),
  },
  profileValue: {
    fontSize: isTablet ? wp(3) : wp(4),
    color: "#333",
    marginBottom: hp(1.5),
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: wp(1.5),
    padding: wp(2.5),
    fontSize: isTablet ? wp(3) : wp(4),
    marginBottom: hp(1.5),
    backgroundColor: '#f9f9f9',
    minHeight: hp(5.5),
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledInputText: {
    color: '#666',
    fontSize: isTablet ? wp(3) : wp(4),
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: wp(5),
    top: hp(2.5),
  },
  editButtonText: {
    color: '#4a90e2',
    marginLeft: wp(1.2),
    fontWeight: '500',
    fontSize: isTablet ? wp(2.8) : wp(3.5),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.2),
  },
  editButtonsContainer: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    marginTop: hp(2.5),
    marginBottom: hp(2.5),
  },
  editActionButton: {
    flex: isSmallScreen ? 0 : 1,
    padding: hp(1.5),
    borderRadius: wp(1.5),
    alignItems: 'center',
    marginHorizontal: isSmallScreen ? 0 : wp(1.2),
    marginVertical: isSmallScreen ? hp(0.5) : 0,
  },
  editActionButtonText: {
    fontWeight: 'bold',
    fontSize: isTablet ? wp(3) : wp(4),
  },
  profile_content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(0.6),
  },
  profile_text_container: {
    flex: 1,
    paddingRight: wp(3.7),
  },
  editIconContainer: {
    padding: wp(3.7),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: wp(12.5),
    minHeight: wp(12.5),
    borderRadius: wp(6.2),
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
});

export default ProfileScreen;