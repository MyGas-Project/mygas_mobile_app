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
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from "react-native-dropdown-picker";
import { BASE_URL, PATH_URL, processResponse } from "../../config";
import Constants from "expo-constants";

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
  const { userInfo, userDetails, getUserDetails } = useContext(AuthContext);
  const [showDetails, setShowDetails] = useState(globalShowDetails);
  const [editMode, setEditMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editedDetails, setEditedDetails] = useState({ ...userDetails });
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Others', value: 'others' },
  ]);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    dataCollection: false,
  });

  const { styles } = useTheme();
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const route = useRoute();

  useEffect(() => {
    globalShowDetails = showDetails;
  }, [showDetails]);

  // Reset edit mode when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setEditMode(false);
      // setShowDetails(false);
      // setShowSettings(false);
      setEditedDetails({ ...userDetails });
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, [userDetails])
  );

  const handleChangePassword = () => {
    setIsChangingPassword(true);
    setShowDetails(true);
  };

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

  const handleSavePassword = () => {
    // Validate password fields
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    fetch(`${BASE_URL}customer/update-password`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword,
        user_id: userInfo.user_id
      }),
    })
      .then(processResponse)
      .then((res) => {
        const { statusCode, data } = res;
        console.log(res);
        if (statusCode !== 200 && statusCode !== 201) {
          Alert.alert("Error", data.message);
          setPasswordData({
            // currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          return;
        } else {
          Alert.alert("Success", "Your password has been updated");
          setIsChangingPassword(false);
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          setShowDetails(false);
          getUserDetails(userInfo);
        }
      })
      .catch((error) => {
        console.error("handleSavePassword error:", error);
        Alert.alert("Error", "An error occurred while updating your password");
        return;
      });

    // Alert.alert("Success", "Your password has been updated", [
    //   {
    //     text: "OK",
    //     onPress: () => {
    //       setIsChangingPassword(false);
    //       setPasswordData({
    //         currentPassword: '',
    //         newPassword: '',
    //         confirmPassword: ''
    //       });
    //       setShowDetails(false);
    //     }
    //   }
    // ]);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowDetails(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setEditedDetails({ ...editedDetails, birthdate: formattedDate });
    }
  };

  const handleBirthdayEditAttempt = () => {
    Alert.alert(
      "Birthday Change Required",
      "To change your birthday, please visit any of our gas stations with a valid ID. Our staff will assist you with updating this information.",
      [{ text: "OK", style: "default" }]
    );
  };

  const handleLoyaltyProgramPress = () => {
    console.log("Loyalty Program pressed");
  };

  const handleSettingsPress = () => {
    setShowSettings(true);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            Linking.openURL(`${PATH_URL}support/account-deletion?fullname=${editedDetails.first_name} ${editedDetails.last_name}&email=${editedDetails.email}&phone=${editedDetails.phone_number}`);
          },
          style: "destructive"
        }
      ]
    );
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

          {/* Password Change Alert */}
          {!editMode && editedDetails?.is_pass_change === 0 ? (
            <TouchableOpacity
              style={profile_styles.alertCard}
              onPress={handleChangePassword}
              activeOpacity={0.8}
            >
              <View style={profile_styles.alertContent}>
                <View style={profile_styles.alertIconContainer}>
                  <Ionicons name="warning" size={wp(6)} color="#ff6b35" />
                </View>
                <View style={profile_styles.alertTextContainer}>
                  <Text style={profile_styles.alertTitle}>Password Update Required</Text>
                  <Text style={profile_styles.alertMessage}>
                    You're using a default password. Tap to update for better security.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={wp(5)} color="#ff6b35" />
              </View>
            </TouchableOpacity>
          ) : null}

          {showSettings ? (
            <View style={profile_styles.detailsCard}>
              <View style={profile_styles.detailsHeader}>
                <TouchableOpacity
                  onPress={() => setShowSettings(false)}
                  style={profile_styles.backButton}
                >
                  <Ionicons name="arrow-back" size={wp(6)} color="#333" />
                </TouchableOpacity>
                <Text style={profile_styles.detailsTitle}>Settings</Text>
                <View style={{ width: wp(10) }} />
              </View>

              {/* NOTIFICATION SETTINGS */}
              <View style={profile_styles.section}>
                <View style={profile_styles.sectionHeader}>
                  <Ionicons name="notifications-outline" size={wp(5)} color="#4a90e2" />
                  <Text style={profile_styles.sectionTitle}>Notifications</Text>
                </View>

                <View style={profile_styles.settingsToggleOption}>
                  <View style={profile_styles.settingsOptionLeft}>
                    <Ionicons name="notifications-outline" size={wp(5)} color="#4a90e2" />
                    <View style={profile_styles.settingsOptionContent}>
                      <Text style={profile_styles.settingsOptionTitle}>Push Notifications</Text>
                      <Text style={profile_styles.settingsOptionSubtitle}>Receive app notifications</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setNotifications({ ...notifications, pushNotifications: !notifications.pushNotifications })}
                    style={[
                      profile_styles.toggleButton,
                      notifications.pushNotifications && profile_styles.toggleButtonActive
                    ]}
                  >
                    <View style={[
                      profile_styles.toggleCircle,
                      notifications.pushNotifications && profile_styles.toggleCircleActive
                    ]} />
                  </TouchableOpacity>
                </View>

                <View style={profile_styles.settingsToggleOption}>
                  <View style={profile_styles.settingsOptionLeft}>
                    <Ionicons name="mail-outline" size={wp(5)} color="#4a90e2" />
                    <View style={profile_styles.settingsOptionContent}>
                      <Text style={profile_styles.settingsOptionTitle}>Email Notifications</Text>
                      <Text style={profile_styles.settingsOptionSubtitle}>Receive email updates</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications })}
                    style={[
                      profile_styles.toggleButton,
                      notifications.emailNotifications && profile_styles.toggleButtonActive
                    ]}
                  >
                    <View style={[
                      profile_styles.toggleCircle,
                      notifications.emailNotifications && profile_styles.toggleCircleActive
                    ]} />
                  </TouchableOpacity>
                </View>

                <View style={profile_styles.settingsToggleOption}>
                  <View style={profile_styles.settingsOptionLeft}>
                    <Ionicons name="chatbubbles-outline" size={wp(5)} color="#4a90e2" />
                    <View style={profile_styles.settingsOptionContent}>
                      <Text style={profile_styles.settingsOptionTitle}>SMS Notifications</Text>
                      <Text style={profile_styles.settingsOptionSubtitle}>Receive text messages</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setNotifications({ ...notifications, smsNotifications: !notifications.smsNotifications })}
                    style={[
                      profile_styles.toggleButton,
                      notifications.smsNotifications && profile_styles.toggleButtonActive
                    ]}
                  >
                    <View style={[
                      profile_styles.toggleCircle,
                      notifications.smsNotifications && profile_styles.toggleCircleActive
                    ]} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* PRIVACY SETTINGS */}
              <View style={profile_styles.section}>
                <View style={profile_styles.sectionHeader}>
                  <Ionicons name="eye-off-outline" size={wp(5)} color="#4a90e2" />
                  <Text style={profile_styles.sectionTitle}>Privacy & Data</Text>
                </View>

                <TouchableOpacity
                  style={profile_styles.settingsOption}
                  onPress={() => setPrivacy({ ...privacy, profileVisibility: privacy.profileVisibility === 'private' ? 'public' : 'private' })}
                  activeOpacity={0.7}
                >
                  <View style={profile_styles.settingsOptionLeft}>
                    <Ionicons name={privacy.profileVisibility === 'private' ? "lock-closed-outline" : "globe-outline"} size={wp(5)} color="#4a90e2" />
                    <View style={profile_styles.settingsOptionContent}>
                      <Text style={profile_styles.settingsOptionTitle}>Profile Visibility</Text>
                      <Text style={profile_styles.settingsOptionSubtitle}>{privacy.profileVisibility === 'private' ? 'Private' : 'Public'}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={wp(5)} color="#ccc" />
                </TouchableOpacity>

                <View style={profile_styles.settingsToggleOption}>
                  <View style={profile_styles.settingsOptionLeft}>
                    <Ionicons name="analytics-outline" size={wp(5)} color="#4a90e2" />
                    <View style={profile_styles.settingsOptionContent}>
                      <Text style={profile_styles.settingsOptionTitle}>Data Collection</Text>
                      <Text style={profile_styles.settingsOptionSubtitle}>Allow analytics tracking</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setPrivacy({ ...privacy, dataCollection: !privacy.dataCollection })}
                    style={[
                      profile_styles.toggleButton,
                      privacy.dataCollection && profile_styles.toggleButtonActive
                    ]}
                  >
                    <View style={[
                      profile_styles.toggleCircle,
                      privacy.dataCollection && profile_styles.toggleCircleActive
                    ]} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* APP SETTINGS */}
              <View style={profile_styles.section}>
                <View style={profile_styles.sectionHeader}>
                  <Ionicons name="phone-portrait-outline" size={wp(5)} color="#4a90e2" />
                  <Text style={profile_styles.sectionTitle}>App</Text>
                </View>

                <TouchableOpacity
                  style={profile_styles.settingsOption}
                  onPress={() => Alert.alert("Language", "Change app language")}
                  activeOpacity={0.7}
                >
                  <View style={profile_styles.settingsOptionLeft}>
                    <Ionicons name="language-outline" size={wp(5)} color="#4a90e2" />
                    <View style={profile_styles.settingsOptionContent}>
                      <Text style={profile_styles.settingsOptionTitle}>Language</Text>
                      <Text style={profile_styles.settingsOptionSubtitle}>English</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={wp(5)} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={profile_styles.settingsOption}
                  onPress={() => Alert.alert("Help & Support", "Visit our help center")}
                  activeOpacity={0.7}
                >
                  <View style={profile_styles.settingsOptionLeft}>
                    <Ionicons name="help-circle-outline" size={wp(5)} color="#4a90e2" />
                    <View style={profile_styles.settingsOptionContent}>
                      <Text style={profile_styles.settingsOptionTitle}>Help & Support</Text>
                      <Text style={profile_styles.settingsOptionSubtitle}>FAQs and contact us</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={wp(5)} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={profile_styles.settingsOption}
                  onPress={() => Alert.alert("About MyGas", `Version ${Constants.expoConfig.version}`)}
                  activeOpacity={0.7}
                >
                  <View style={profile_styles.settingsOptionLeft}>
                    <Ionicons name="information-circle-outline" size={wp(5)} color="#4a90e2" />
                    <View style={profile_styles.settingsOptionContent}>
                      <Text style={profile_styles.settingsOptionTitle}>About</Text>
                      <Text style={profile_styles.settingsOptionSubtitle}>App version and info</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={wp(5)} color="#ccc" />
                </TouchableOpacity>
              </View>

              {/* LEGAL */}
              <View style={profile_styles.section}>
                <View style={profile_styles.sectionHeader}>
                  <Ionicons name="document-text-outline" size={wp(5)} color="#4a90e2" />
                  <Text style={profile_styles.sectionTitle}>Legal</Text>
                </View>

                <TouchableOpacity
                  style={profile_styles.settingsOption}
                  onPress={() => navigation.navigate("TermsCondition")}
                  activeOpacity={0.7}
                >
                  <View style={profile_styles.settingsOptionLeft}>
                    <Ionicons name="document-text-outline" size={wp(5)} color="#4a90e2" />
                    <View style={profile_styles.settingsOptionContent}>
                      <Text style={profile_styles.settingsOptionTitle}>Terms & Conditions</Text>
                      <Text style={profile_styles.settingsOptionSubtitle}>Read our terms of service</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={wp(5)} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={profile_styles.settingsOption}
                  onPress={() => navigation.navigate("PrivacyPolicy")}
                  activeOpacity={0.7}
                >
                  <View style={profile_styles.settingsOptionLeft}>
                    <Ionicons name="shield-checkmark-outline" size={wp(5)} color="#4a90e2" />
                    <View style={profile_styles.settingsOptionContent}>
                      <Text style={profile_styles.settingsOptionTitle}>Privacy Policy</Text>
                      <Text style={profile_styles.settingsOptionSubtitle}>How we protect your data</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={wp(5)} color="#ccc" />
                </TouchableOpacity>
              </View>

              {/* DANGER ZONE */}
              <View style={profile_styles.section}>
                <TouchableOpacity
                  style={[profile_styles.settingsOption, profile_styles.dangerOption]}
                  onPress={handleDeleteAccount}
                  activeOpacity={0.7}
                >
                  <View style={profile_styles.settingsOptionLeft}>
                    <Ionicons name="trash-outline" size={wp(5)} color="#ff3b30" />
                    <View style={profile_styles.settingsOptionContent}>
                      <Text style={[profile_styles.settingsOptionTitle, profile_styles.dangerText]}>Delete Account</Text>
                      <Text style={profile_styles.settingsOptionSubtitle}>Permanently delete your account and data</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={wp(5)} color="#ccc" />
                </TouchableOpacity>
              </View>

              <View style={profile_styles.settingsWarning}>
                <Ionicons name="information-circle-outline" size={wp(5)} color="#ff6b35" />
                <Text style={profile_styles.warningText}>
                  Account deletion is permanent and cannot be undone. Please ensure you have backed up any important data.
                </Text>
              </View>
            </View>
          ) : showDetails ? (
            <View style={profile_styles.detailsCard}>
              <View style={profile_styles.detailsHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setShowDetails(false);
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  style={profile_styles.backButton}
                >
                  <Ionicons name="arrow-back" size={wp(6)} color="#333" />
                </TouchableOpacity>
                <Text style={profile_styles.detailsTitle}>
                  {isChangingPassword ? "Change Password" : "Profile Details"}
                </Text>
                {!editMode && !isChangingPassword && (
                  <TouchableOpacity onPress={handleEditPress} style={profile_styles.headerEditButton}>
                    <Ionicons name="create-outline" size={wp(5.5)} color="#4a90e2" />
                  </TouchableOpacity>
                )}
                {(editMode || isChangingPassword) && <View style={{ width: wp(10) }} />}
              </View>

              {isChangingPassword ? (
                // Password Change Form
                <View style={profile_styles.section}>
                  <View style={profile_styles.sectionHeader}>
                    <Ionicons name="shield-checkmark-outline" size={wp(5)} color="#4a90e2" />
                    <Text style={profile_styles.sectionTitle}>Update Your Password</Text>
                  </View>

                  <Text style={profile_styles.passwordInstruction}>
                    Please enter your current password and choose a new secure password.
                  </Text>

                  <View style={profile_styles.fieldFull}>
                    <Text style={profile_styles.fieldLabel}>Current Password</Text>
                    <View style={profile_styles.passwordInputContainer}>
                      <TextInput
                        style={profile_styles.passwordInput}
                        value={passwordData.currentPassword}
                        onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
                        secureTextEntry={!showCurrentPassword}
                        placeholder="Enter current password"
                      />
                      <TouchableOpacity
                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                        style={profile_styles.eyeIcon}
                      >
                        <Ionicons
                          name={showCurrentPassword ? "eye-outline" : "eye-off-outline"}
                          size={wp(5)}
                          color="#888"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={profile_styles.fieldFull}>
                    <Text style={profile_styles.fieldLabel}>New Password</Text>
                    <View style={profile_styles.passwordInputContainer}>
                      <TextInput
                        style={profile_styles.passwordInput}
                        value={passwordData.newPassword}
                        onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                        secureTextEntry={!showNewPassword}
                        placeholder="Enter new password (min. 6 characters)"
                      />
                      <TouchableOpacity
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        style={profile_styles.eyeIcon}
                      >
                        <Ionicons
                          name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                          size={wp(5)}
                          color="#888"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={profile_styles.fieldFull}>
                    <Text style={profile_styles.fieldLabel}>Confirm New Password</Text>
                    <View style={profile_styles.passwordInputContainer}>
                      <TextInput
                        style={profile_styles.passwordInput}
                        value={passwordData.confirmPassword}
                        onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                        secureTextEntry={!showConfirmPassword}
                        placeholder="Confirm new password"
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={profile_styles.eyeIcon}
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                          size={wp(5)}
                          color="#888"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={profile_styles.passwordRequirements}>
                    <Text style={profile_styles.requirementsTitle}>Password Requirements:</Text>
                    <View style={profile_styles.requirementItem}>
                      <Ionicons
                        name={passwordData.newPassword.length >= 6 ? "checkmark-circle" : "ellipse-outline"}
                        size={wp(4)}
                        color={passwordData.newPassword.length >= 6 ? "#4a90e2" : "#ccc"}
                      />
                      <Text style={profile_styles.requirementText}>At least 6 characters</Text>
                    </View>
                    <View style={profile_styles.requirementItem}>
                      <Ionicons
                        name={passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword ? "checkmark-circle" : "ellipse-outline"}
                        size={wp(4)}
                        color={passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword ? "#4a90e2" : "#ccc"}
                      />
                      <Text style={profile_styles.requirementText}>Passwords match</Text>
                    </View>
                  </View>

                  <View style={profile_styles.actionButtons}>
                    <TouchableOpacity
                      onPress={handleCancelPasswordChange}
                      style={[profile_styles.actionButton, profile_styles.cancelButton]}
                    >
                      <Text style={profile_styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSavePassword}
                      style={[profile_styles.actionButton, profile_styles.saveButton]}
                    >
                      <Text style={profile_styles.saveButtonText}>Update Password</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                // Profile Details View
                <>
                  {/* PERSONAL INFO */}
                  <View style={profile_styles.section}>
                    <View style={profile_styles.sectionHeader}>
                      <Ionicons name="person-outline" size={wp(5)} color="#4a90e2" />
                      <Text style={profile_styles.sectionTitle}>Personal Information</Text>
                    </View>

                    <View style={profile_styles.fieldRow}>
                      <View style={profile_styles.fieldContainer}>
                        <Text style={profile_styles.fieldLabel}>Gender</Text>
                        {editMode ? (
                          <DropDownPicker
                            open={open}
                            value={editedDetails?.gender ?? "N/A"}
                            items={items}
                            setOpen={setOpen}
                            setValue={(value) => {
                              setEditedDetails({ ...editedDetails, gender: value })
                            }}
                            setItems={setItems}
                            placeholder={'Select Gender'}
                            listMode="SCROLLVIEW"
                            style={profile_styles.input}
                            textStyle={profile_styles.inputText}
                          />
                        ) : (
                          <Text style={profile_styles.fieldValue}>
                            {userDetails?.gender || "N/A"}
                          </Text>
                        )}
                      </View>
                      <View style={profile_styles.fieldContainer}>
                        <Text style={profile_styles.fieldLabel}>Civil Status</Text>
                        {editMode ? (
                          <TextInput
                            style={profile_styles.input}
                            value={editedDetails.civil_status}
                            onChangeText={(text) => setEditedDetails({ ...editedDetails, civil_status: text })}
                            placeholder="Enter civil status"
                          />
                        ) : (
                          <Text style={profile_styles.fieldValue}>{userDetails?.civil_status || "N/A"}</Text>
                        )}
                      </View>
                    </View>

                    <View style={profile_styles.fieldRow}>
                      <View style={profile_styles.fieldContainer}>
                        <Text style={profile_styles.fieldLabel}>Birth Date</Text>
                        {showDatePicker && (
                          <DateTimePicker
                            value={new Date(editedDetails.birth_date || Date.now())}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                          />
                        )}
                        {editMode ? (
                          <TouchableOpacity
                            style={[profile_styles.input, profile_styles.lockedInput]}
                            onPress={handleBirthdayEditAttempt}
                          >
                            <Text style={profile_styles.lockedInputText}>
                              {editedDetails.birth_date || "Not set"}
                            </Text>
                            <Ionicons name="lock-closed" size={wp(4)} color="#888" />
                          </TouchableOpacity>
                        ) : (
                          <Text style={profile_styles.fieldValue}>{userDetails?.birth_date || "N/A"}</Text>
                        )}
                      </View>
                      <View style={profile_styles.fieldContainer}>
                        <Text style={profile_styles.fieldLabel}>ID Presented</Text>
                        <Text style={profile_styles.fieldValue}>
                          {userDetails?.is_presented_id_flag || "N/A"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* CONTACT INFO */}
                  <View style={profile_styles.section}>
                    <View style={profile_styles.sectionHeader}>
                      <Ionicons name="mail-outline" size={wp(5)} color="#4a90e2" />
                      <Text style={profile_styles.sectionTitle}>Contact Information</Text>
                    </View>

                    <View style={profile_styles.fieldFull}>
                      <Text style={profile_styles.fieldLabel}>Phone Number</Text>
                      <View style={[profile_styles.fieldValueContainer, profile_styles.lockedField]}>
                        <Text style={profile_styles.fieldValue}>
                          {userDetails?.phone_number || "N/A"}
                        </Text>
                        <Ionicons name="lock-closed" size={wp(4)} color="#888" />
                      </View>
                    </View>

                    <View style={profile_styles.fieldFull}>
                      <Text style={profile_styles.fieldLabel}>Email</Text>
                      {editMode ? (
                        <TextInput
                          style={profile_styles.input}
                          value={editedDetails.email}
                          onChangeText={(text) => setEditedDetails({ ...editedDetails, email: text })}
                          keyboardType="email-address"
                          placeholder="Enter email address"
                        />
                      ) : (
                        <Text style={profile_styles.fieldValue}>
                          {userDetails?.email || "Not provided"}
                        </Text>
                      )}
                    </View>

                    <View style={profile_styles.fieldFull}>
                      <Text style={profile_styles.fieldLabel}>Address</Text>
                      {editMode ? (
                        <TextInput
                          style={[profile_styles.input, profile_styles.textArea]}
                          value={editedDetails.address}
                          onChangeText={(text) => setEditedDetails({ ...editedDetails, address: text })}
                          multiline
                          numberOfLines={3}
                          placeholder="Enter your address"
                        />
                      ) : (
                        <Text style={profile_styles.fieldValue}>
                          {userDetails?.address || "N/A"}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* SECURITY */}
                  <View style={profile_styles.section}>
                    <View style={profile_styles.sectionHeader}>
                      <Ionicons name="shield-checkmark-outline" size={wp(5)} color="#4a90e2" />
                      <Text style={profile_styles.sectionTitle}>Security</Text>
                    </View>

                    <TouchableOpacity
                      style={profile_styles.passwordRow}
                      onPress={() => {
                        setIsChangingPassword(true);
                        setEditMode(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={profile_styles.passwordLeft}>
                        <Text style={profile_styles.fieldLabel}>Password</Text>
                        <Text style={profile_styles.passwordValue}>••••••••</Text>
                      </View>
                      <View style={profile_styles.passwordRight}>
                        <Text style={profile_styles.changePasswordText}>Change</Text>
                        <Ionicons name="chevron-forward" size={wp(5)} color="#4a90e2" />
                      </View>
                    </TouchableOpacity>
                  </View>

                  {editMode && (
                    <View style={profile_styles.actionButtons}>
                      <TouchableOpacity
                        onPress={handleCancelEdit}
                        style={[profile_styles.actionButton, profile_styles.cancelButton]}
                      >
                        <Text style={profile_styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSaveChanges}
                        style={[profile_styles.actionButton, profile_styles.saveButton]}
                      >
                        <Text style={profile_styles.saveButtonText}>Save Changes</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
          ) : (
            <>
              {/* Profile Summary Card */}
              <TouchableOpacity
                style={profile_styles.summaryCard}
                onPress={handleEditProfile}
                activeOpacity={0.7}
              >
                <View style={profile_styles.avatarContainer}>
                  <View style={profile_styles.avatar}>
                    <Text style={profile_styles.avatarText}>
                      {userDetails?.first_name?.charAt(0)}{userDetails?.last_name?.charAt(0)}
                    </Text>
                  </View>
                </View>
                <View style={profile_styles.summaryInfo}>
                  <Text style={profile_styles.summaryName}>
                    {userDetails?.first_name || ""} {userDetails?.middle_name ? userDetails.middle_name.charAt(0) + ". " : ""}
                    {userDetails?.last_name || ""}
                  </Text>
                  <View style={profile_styles.summaryDetail}>
                    <Ionicons name="call-outline" size={wp(4)} color="#666" />
                    <Text style={profile_styles.summaryText}>{userDetails?.phone_number}</Text>
                  </View>
                  <View style={profile_styles.summaryDetail}>
                    <Ionicons name="mail-outline" size={wp(4)} color="#666" />
                    <Text style={profile_styles.summaryText}>
                      {userDetails?.email || "No email yet"}
                    </Text>
                  </View>
                </View>
                <View style={profile_styles.chevronContainer}>
                  <Ionicons name="chevron-forward" size={wp(6)} color="#4a90e2" />
                </View>
              </TouchableOpacity>

              {/* Quick Actions */}
              <View style={profile_styles.quickActions}>
                <TouchableOpacity
                  style={profile_styles.actionCard}
                  onPress={handleLoyaltyProgramPress}
                  activeOpacity={0.7}
                >
                  <View style={profile_styles.actionIconContainer}>
                    <Image
                      source={require("../../../assets/mygas_logo.png")}
                      style={profile_styles.actionLogo}
                    />
                  </View>
                  <View style={profile_styles.actionContent}>
                    <Text style={profile_styles.actionTitle}>Loyalty Program</Text>
                    <Text style={profile_styles.actionSubtitle}>Motorista Card</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={wp(5)} color="#4a90e2" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={profile_styles.actionCard}
                  onPress={handleSettingsPress}
                  activeOpacity={0.7}
                >
                  <View style={[profile_styles.actionIconContainer, profile_styles.settingsIcon]}>
                    <Ionicons name="settings-outline" size={wp(6)} color="#4a90e2" />
                  </View>
                  <View style={profile_styles.actionContent}>
                    <Text style={profile_styles.actionTitle}>Settings</Text>
                    <Text style={profile_styles.actionSubtitle}>Preferences & more</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={wp(5)} color="#4a90e2" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={profile_styles.logoutButton}
                onPress={() => logout(userInfo)}
                activeOpacity={0.8}
              >
                <Ionicons name="log-out-outline" size={wp(5)} color="#ff3b30" />
                <Text style={profile_styles.logoutButtonText}>Log Out</Text>
              </TouchableOpacity>
            </>
          )}

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
    paddingTop: hp(2),
    paddingBottom: hp(12),
  },
  myAccountTitle: {
    fontSize: isTablet ? wp(5) : wp(6.5),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: hp(2.5),
    color: "#333",
  },
  // Alert Card
  alertCard: {
    backgroundColor: "#fff",
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    borderLeftWidth: wp(1),
    borderLeftColor: "#ff6b35",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  alertContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertIconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: "#fff5f2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: isTablet ? wp(3.5) : wp(4),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp(0.5),
  },
  alertMessage: {
    fontSize: isTablet ? wp(2.8) : wp(3.5),
    color: "#666",
    lineHeight: hp(2.2),
  },
  // Summary Card
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: wp(3),
    padding: wp(4.5),
    marginBottom: hp(2),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: wp(4),
  },
  avatar: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: "#4a90e2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: isTablet ? wp(5) : wp(6),
    fontWeight: "700",
    color: "#fff",
  },
  summaryInfo: {
    flex: 1,
  },
  summaryName: {
    fontSize: isTablet ? wp(3.5) : wp(4.5),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp(0.8),
  },
  summaryDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.4),
  },
  summaryText: {
    fontSize: isTablet ? wp(2.8) : wp(3.5),
    color: "#666",
    marginLeft: wp(2),
  },
  chevronContainer: {
    padding: wp(2),
  },
  // Quick Actions
  quickActions: {
    marginBottom: hp(2),
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(1.5),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: "#f0f7ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(3),
  },
  actionLogo: {
    width: wp(8),
    height: wp(8),
    resizeMode: "contain",
  },
  settingsIcon: {
    backgroundColor: "#f0f7ff",
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: isTablet ? wp(3.2) : wp(4),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp(0.3),
  },
  actionSubtitle: {
    fontSize: isTablet ? wp(2.5) : wp(3.2),
    color: "#888",
  },
  // Details Card
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: wp(3),
    padding: wp(4.5),
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(2.5),
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: wp(1),
  },
  detailsTitle: {
    fontSize: isTablet ? wp(3.5) : wp(4.5),
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  headerEditButton: {
    padding: wp(1),
  },
  // Sections
  section: {
    marginBottom: hp(2.5),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  sectionTitle: {
    fontSize: isTablet ? wp(3) : wp(3.8),
    fontWeight: "600",
    color: "#333",
    marginLeft: wp(2),
  },
  // Settings Options
  settingsOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    backgroundColor: "#fafafa",
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: hp(1.5),
  },
  dangerOption: {
    borderColor: "#ffebee",
    backgroundColor: "#fff9f8",
  },
  settingsOptionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  settingsOptionContent: {
    marginLeft: wp(3),
    flex: 1,
  },
  settingsOptionTitle: {
    fontSize: isTablet ? wp(3.2) : wp(4),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp(0.3),
  },
  dangerText: {
    color: "#ff3b30",
  },
  settingsOptionSubtitle: {
    fontSize: isTablet ? wp(2.5) : wp(3),
    color: "#888",
  },
  settingsToggleOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    backgroundColor: "#fafafa",
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: hp(1.5),
  },
  toggleButton: {
    width: wp(12),
    height: wp(6.5),
    borderRadius: wp(3.25),
    backgroundColor: "#e0e0e0",
    padding: wp(0.5),
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#4a90e2",
  },
  toggleCircle: {
    width: wp(5.5),
    height: wp(5.5),
    borderRadius: wp(2.75),
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  toggleCircleActive: {
    alignSelf: "flex-end",
  },
  settingsWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff5f2",
    borderRadius: wp(2),
    padding: wp(3),
    marginTop: hp(2),
    borderLeftWidth: wp(1),
    borderLeftColor: "#ff6b35",
  },
  warningText: {
    fontSize: isTablet ? wp(2.5) : wp(3),
    color: "#666",
    marginLeft: wp(2),
    flex: 1,
    lineHeight: hp(2),
  },
  // Fields
  fieldRow: {
    flexDirection: isSmallScreen ? "column" : "row",
    justifyContent: "space-between",
    marginBottom: hp(1),
  },
  fieldContainer: {
    flex: 1,
    marginRight: isSmallScreen ? 0 : wp(2),
    marginBottom: hp(1.5),
  },
  fieldFull: {
    marginBottom: hp(1.5),
  },
  fieldLabel: {
    fontSize: isTablet ? wp(2.5) : wp(3.2),
    color: "#888",
    marginBottom: hp(0.6),
    fontWeight: "500",
  },
  fieldValue: {
    fontSize: isTablet ? wp(3) : wp(3.8),
    color: "#333",
    fontWeight: "400",
  },
  fieldValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lockedField: {
    paddingVertical: hp(0.5),
  },
  // Inputs
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: wp(2),
    padding: wp(3),
    fontSize: isTablet ? wp(3) : wp(3.8),
    backgroundColor: '#fafafa',
    minHeight: hp(5.5),
    color: "#333",
  },
  inputText: {
    fontSize: isTablet ? wp(3) : wp(3.8),
    color: "#333",
  },
  textArea: {
    height: hp(10),
    textAlignVertical: "top",
  },
  lockedInput: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lockedInputText: {
    color: '#666',
    fontSize: isTablet ? wp(3) : wp(3.8),
    flex: 1,
  },
  // Password Row
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    backgroundColor: "#fafafa",
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  passwordLeft: {
    flex: 1,
  },
  passwordValue: {
    fontSize: isTablet ? wp(3.5) : wp(4.5),
    color: "#333",
    letterSpacing: 2,
    marginTop: hp(0.3),
  },
  passwordRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  changePasswordText: {
    fontSize: isTablet ? wp(3) : wp(3.8),
    color: "#4a90e2",
    fontWeight: "600",
    marginRight: wp(1),
  },
  // Password Change Form
  passwordInstruction: {
    fontSize: isTablet ? wp(2.8) : wp(3.5),
    color: "#666",
    marginBottom: hp(2),
    lineHeight: hp(2.2),
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: wp(2),
    backgroundColor: '#fafafa',
    marginBottom: hp(1.5),
  },
  passwordInput: {
    flex: 1,
    padding: wp(3),
    fontSize: isTablet ? wp(3) : wp(3.8),
    color: "#333",
    minHeight: hp(5.5),
  },
  eyeIcon: {
    padding: wp(3),
  },
  passwordRequirements: {
    backgroundColor: "#f0f7ff",
    borderRadius: wp(2),
    padding: wp(3),
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  requirementsTitle: {
    fontSize: isTablet ? wp(2.8) : wp(3.5),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp(1),
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(0.5),
  },
  requirementText: {
    fontSize: isTablet ? wp(2.5) : wp(3.2),
    color: "#666",
    marginLeft: wp(2),
  },
  // Action Buttons
  actionButtons: {
    flexDirection: isSmallScreen ? "column" : "row",
    justifyContent: "space-between",
    marginTop: hp(2),
    gap: wp(2),
  },
  actionButton: {
    flex: isSmallScreen ? 0 : 1,
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),
    borderRadius: wp(2.5),
    alignItems: "center",
    justifyContent: "center",
    marginVertical: isSmallScreen ? hp(0.5) : 0,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: isTablet ? wp(3) : wp(3.8),
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4a90e2",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: isTablet ? wp(3) : wp(3.8),
    fontWeight: "600",
  },
  // Logout Button
  logoutButton: {
    backgroundColor: "#fff",
    borderRadius: wp(2.5),
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(3),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: "#ff3b30",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutButtonText: {
    color: "#ff3b30",
    fontSize: isTablet ? wp(3.5) : wp(4),
    fontWeight: "600",
    marginLeft: wp(2),
  },
});

export default ProfileScreen;