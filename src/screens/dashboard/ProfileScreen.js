import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "heroui-native";
import Navbar from "../../components/Navbar";
import { useProfile } from "../../hooks/useProfile";
import { ProfileDetails } from "../../components/ProfileDetails";
import { ChangePassword } from "../../components/ChangePassword";
import { ProfileSettings } from "../../components/ProfileSettings";
import { ProfileHome } from "../../components/ProfileHome";
import { hp, wp } from "../../lib/responsive";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { toast } = useToast();

  const {
    userInfo,
    userDetails,
    view,
    setView,
    editMode,
    setEditMode,
    editedDetails,
    setEditedDetails,
    passwordData,
    setPasswordData,
    notifications,
    toggleNotification,
    privacy,
    togglePrivacy,
    showDeleteDialog,
    setShowDeleteDialog,
    isLoading,
    handleSaveProfile,
    handleSavePassword,
    handleDeleteAccount,
  } = useProfile();

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0.85],
    extrapolate: "clamp",
  });

  const onSaveProfile = async () => {
    const result = await handleSaveProfile();
    if (result.success) {
      toast.show({ variant: "success", label: "Profile updated successfully", duration: 3000, icon: <Ionicons name="checkmark-circle" size={24} color="green" /> });
    } else {
      toast.show({ variant: "danger", label: "Failed to update profile", description: result.message, duration: 4000, icon: <Ionicons name="close-circle" size={24} color="red" /> });
    }
  };

  const onSavePassword = async () => {
    const result = await handleSavePassword();
    if (result.success) {
      toast.show({ variant: "success", label: "Password updated successfully", duration: 3000, icon: <Ionicons name="checkmark-circle" size={24} color="green" /> });
    } else {
      toast.show({ variant: "danger", label: "Failed to update password", description: result.message, duration: 4000, icon: <Ionicons name="close-circle" size={24} color="red" /> });
    }
  };

  const onBirthdayEditAttempt = () => {
    toast.show({
      variant: "warning",
      label: "Birthday Change Required",
      description: "To change your birthday, please visit any of our gas stations with a valid ID.",
      icon: <Ionicons name="alert-circle" size={24} color="orange" />,
      duration: 4500
    });
  };

  const renderView = () => {
    switch (view) {
      case "details":
        return (
          <ProfileDetails
            userDetails={userDetails}
            editedDetails={editedDetails}
            setEditedDetails={setEditedDetails}
            editMode={editMode}
            setEditMode={setEditMode}
            isLoading={isLoading}
            onSave={onSaveProfile}
            onCancel={() => setEditMode(false)}
            onChangePassword={() => setView("password")}
            onBack={() => {
              setEditMode(false);
              setView("home");
            }}
            onBirthdayEditAttempt={onBirthdayEditAttempt}
          />
        );
      case "password":
        return (
          <ChangePassword
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            isLoading={isLoading}
            onSave={onSavePassword}
            onCancel={() =>
              setView(view === "password" && editMode ? "details" : "home")
            }
          />
        );
      case "settings":
        return (
          <ProfileSettings
            notifications={notifications}
            toggleNotification={toggleNotification}
            privacy={privacy}
            togglePrivacy={togglePrivacy}
            showDeleteDialog={showDeleteDialog}
            setShowDeleteDialog={setShowDeleteDialog}
            onDeleteConfirm={handleDeleteAccount}
            onBack={() => setView("home")}
            navigation={navigation}
          />
        );
      default:
        return (
          <ProfileHome
            userDetails={userDetails}
            userInfo={userInfo}
            onEditProfile={() => setView("details")}
            onSettings={() => setView("settings")}
            onChangePassword={() => setView("password")}
          />
        );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" />
      <Navbar />

      <View style={styles.sheet}>
        {/* Drag handle */}
        {/* <View style={styles.dragHandle} /> */}

        <Animated.ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <Animated.View style={[styles.titleRow, { opacity: headerOpacity }]}>
            <Text style={styles.screenTitle}>My Account</Text>
            <View style={styles.titleAccent} />
          </Animated.View>

          {renderView()}
          <View style={{ height: hp(10) }} />
        </Animated.ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1117",
  },
  sheet: {
    flex: 1,
    backgroundColor: "#F7F8FC",
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    marginTop: -hp(3),
    paddingTop: hp(1.5),
    overflow: "hidden",
    // Soft shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  dragHandle: {
    width: wp(10),
    height: hp(0.5),
    backgroundColor: "#D1D5E0",
    borderRadius: 99,
    alignSelf: "center",
    marginBottom: hp(1.5),
  },
  scrollContent: {
    paddingHorizontal: wp(4.5),
    paddingBottom: hp(12),
  },
  titleRow: {
    marginBottom: hp(2.5),
    paddingTop: hp(0.5),
  },
  screenTitle: {
    fontSize: wp(7),
    fontWeight: "800",
    color: "#0F1117",
    letterSpacing: -0.5,
  },
  titleAccent: {
    width: wp(8),
    height: hp(0.4),
    backgroundColor: "#FF5733",
    borderRadius: 99,
    marginTop: hp(0.6),
  },
});

export default ProfileScreen;