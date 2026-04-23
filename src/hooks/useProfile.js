import { useState, useContext } from "react";
import { Linking } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { AuthContext } from "../context/AuthContext";
import { updatePassword, updateUserDetails } from "../service/profileService";
import { PATH_URL } from "../config";

export const useProfile = () => {
  const { userInfo, userDetails, getUserDetails } = useContext(AuthContext);

  const [view, setView] = useState("home"); // 'home' | 'details' | 'password' | 'settings'
  const [editMode, setEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState({ ...userDetails });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: "private",
    dataCollection: false,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setView("home");
      setEditMode(false);
      setEditedDetails({ ...userDetails });
      resetPasswordData();
    }, [userDetails])
  );

  const resetPasswordData = () =>
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const { statusCode, data } = await updateUserDetails({
        userInfo,
        details: editedDetails,
      });
      if (statusCode !== 200 && statusCode !== 201) {
        return { success: false, message: data.message || "Update failed" };
      }
      setEditMode(false);
      await getUserDetails(userInfo);
      return { success: true };
    } catch {
      return { success: false, message: "An error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      return { success: false, message: "Please fill in all password fields" };
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return { success: false, message: "New passwords do not match" };
    }
    if (passwordData.newPassword.length < 6) {
      return { success: false, message: "New password must be at least 6 characters" };
    }

    setIsLoading(true);
    try {
      const { statusCode, data } = await updatePassword({ userInfo, passwordData });
      if (statusCode !== 200 && statusCode !== 201) {
        return { success: false, message: data.message || "Update failed" };
      }
      resetPasswordData();
      setView("home");
      await getUserDetails(userInfo);
      return { success: true };
    } catch {
      return { success: false, message: "An error occurred while updating your password" };
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Linking.openURL(
      `${PATH_URL}support/account-deletion?fullname=${editedDetails.first_name} ${editedDetails.last_name}&email=${editedDetails.email}&phone=${editedDetails.phone_number}`
    );
    setShowDeleteDialog(false);
  };

  const toggleNotification = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const togglePrivacy = (key) =>
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));

  return {
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
    resetPasswordData,
  };
};
