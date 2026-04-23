import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Button,
  Switch,
  Dialog,
} from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { wp, hp, isTablet } from "../lib/responsive";

// ─── Sub-components ───────────────────────────────────────────────
const SectionLabel = ({ icon, title }) => (
  <View style={labelStyles.row}>
    <Ionicons name={icon} size={wp(4)} color="#9CA3AF" />
    <Text style={labelStyles.text}>{title}</Text>
  </View>
);

const SettingsGroup = ({ children }) => (
  <View style={groupStyles.container}>{children}</View>
);

const SettingsRow = ({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  right,
  onPress,
  isLast = false,
  danger = false,
}) => (
  <>
    <TouchableOpacity
      style={groupStyles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[groupStyles.iconBox, { backgroundColor: iconBg || "#F3F4F6" }]}>
        <Ionicons name={icon} size={wp(5)} color={iconColor || "#6B7280"} />
      </View>
      <View style={groupStyles.content}>
        <Text style={[groupStyles.title, danger && groupStyles.dangerTitle]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={groupStyles.subtitle}>{subtitle}</Text>
        ) : null}
      </View>
      <View style={groupStyles.right}>{right}</View>
    </TouchableOpacity>
    {!isLast && <View style={groupStyles.divider} />}
  </>
);

// ─── Main Component ───────────────────────────────────────────────
export const ProfileSettings = ({
  notifications,
  toggleNotification,
  privacy,
  togglePrivacy,
  showDeleteDialog,
  setShowDeleteDialog,
  onDeleteConfirm,
  onBack,
  navigation,
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={wp(5.5)} color="#0F1117" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Settings</Text>
        <View style={{ width: wp(10) }} />
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <SectionLabel icon="notifications-outline" title="NOTIFICATIONS" />
        <SettingsGroup>
          <SettingsRow
            icon="notifications-outline"
            iconBg="#EFF6FF"
            iconColor="#3B82F6"
            title="Push Notifications"
            subtitle="Alerts and activity updates"
            right={
              <Switch
                isSelected={notifications.pushNotifications}
                onValueChange={() => toggleNotification("pushNotifications")}
              />
            }
          />
          <SettingsRow
            icon="mail-outline"
            iconBg="#F5F3FF"
            iconColor="#8B5CF6"
            title="Email Notifications"
            subtitle="Receive email updates"
            right={
              <Switch
                isSelected={notifications.emailNotifications}
                onValueChange={() => toggleNotification("emailNotifications")}
              />
            }
          />
          <SettingsRow
            icon="chatbubbles-outline"
            iconBg="#ECFDF5"
            iconColor="#10B981"
            title="SMS Notifications"
            subtitle="Text message alerts"
            right={
              <Switch
                isSelected={notifications.smsNotifications}
                onValueChange={() => toggleNotification("smsNotifications")}
              />
            }
            isLast
          />
        </SettingsGroup>
      </View>

      {/* Privacy */}
      <View style={styles.section}>
        <SectionLabel icon="eye-off-outline" title="PRIVACY & DATA" />
        <SettingsGroup>
          <SettingsRow
            icon={
              privacy.profileVisibility === "private"
                ? "lock-closed-outline"
                : "globe-outline"
            }
            iconBg="#FFF7ED"
            iconColor="#F97316"
            title="Profile Visibility"
            subtitle={
              privacy.profileVisibility === "private" ? "Private" : "Public"
            }
            onPress={() => togglePrivacy("profileVisibility")}
            right={
              <View style={styles.visibilityChip}>
                <Text style={styles.visibilityText}>
                  {privacy.profileVisibility === "private" ? "Private" : "Public"}
                </Text>
              </View>
            }
          />
          <SettingsRow
            icon="analytics-outline"
            iconBg="#F0FDF4"
            iconColor="#22C55E"
            title="Data Collection"
            subtitle="Allow analytics tracking"
            right={
              <Switch
                isSelected={privacy.dataCollection}
                onValueChange={() => togglePrivacy("dataCollection")}
              />
            }
            isLast
          />
        </SettingsGroup>
      </View>

      {/* App */}
      <View style={styles.section}>
        <SectionLabel icon="phone-portrait-outline" title="APP" />
        <SettingsGroup>
          <SettingsRow
            icon="language-outline"
            iconBg="#EFF6FF"
            iconColor="#3B82F6"
            title="Language"
            subtitle="English"
            onPress={() => { }}
            right={
              <Ionicons name="chevron-forward" size={wp(4.5)} color="#D1D5DB" />
            }
          />
          <SettingsRow
            icon="help-circle-outline"
            iconBg="#F5F3FF"
            iconColor="#8B5CF6"
            title="Help & Support"
            subtitle="FAQs and contact us"
            onPress={() => { }}
            right={
              <Ionicons name="chevron-forward" size={wp(4.5)} color="#D1D5DB" />
            }
          />
          <SettingsRow
            icon="information-circle-outline"
            iconBg="#F9FAFB"
            iconColor="#6B7280"
            title="About"
            subtitle={`Version ${Constants.expoConfig?.version ?? "—"}`}
            onPress={() => { }}
            right={
              <Ionicons name="chevron-forward" size={wp(4.5)} color="#D1D5DB" />
            }
            isLast
          />
        </SettingsGroup>
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <SectionLabel icon="document-text-outline" title="LEGAL" />
        <SettingsGroup>
          <SettingsRow
            icon="document-text-outline"
            iconBg="#ECFDF5"
            iconColor="#10B981"
            title="Terms & Conditions"
            subtitle="Read our terms of service"
            onPress={() => navigation.navigate("TermsCondition")}
            right={
              <Ionicons name="chevron-forward" size={wp(4.5)} color="#D1D5DB" />
            }
          />
          <SettingsRow
            icon="shield-checkmark-outline"
            iconBg="#EFF6FF"
            iconColor="#3B82F6"
            title="Privacy Policy"
            subtitle="How we protect your data"
            onPress={() => navigation.navigate("PrivacyPolicy")}
            right={
              <Ionicons name="chevron-forward" size={wp(4.5)} color="#D1D5DB" />
            }
            isLast
          />
        </SettingsGroup>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <SectionLabel icon="warning-outline" title="DANGER ZONE" />
        <SettingsGroup>
          <SettingsRow
            icon="trash-outline"
            iconBg="#FEF2F2"
            iconColor="#EF4444"
            title="Delete Account"
            subtitle="Permanently remove your account"
            onPress={() => setShowDeleteDialog(true)}
            danger
            right={
              <Ionicons name="chevron-forward" size={wp(4.5)} color="#FCA5A5" />
            }
            isLast
          />
        </SettingsGroup>
        <View style={styles.dangerWarning}>
          <Ionicons name="information-circle" size={wp(4.5)} color="#EF4444" />
          <Text style={styles.dangerWarningText}>
            Account deletion is permanent and cannot be undone.
          </Text>
        </View>
      </View>

      {/* Delete Dialog */}
      <Dialog isOpen={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content style={styles.dialogContent}>
            <Dialog.Close />
            <View style={styles.dialogIcon}>
              <Ionicons name="trash" size={wp(8)} color="#EF4444" />
            </View>
            <Dialog.Title style={styles.dialogTitle}>Delete Account?</Dialog.Title>
            <Dialog.Description style={styles.dialogDesc}>
              This action is permanent and cannot be undone. All your data will
              be removed forever.
            </Dialog.Description>
            <View style={styles.dialogFooter}>
              <Button
                variant="ghost"
                onPress={() => setShowDeleteDialog(false)}
                style={styles.dialogCancelBtn}
              >
                <Button.Label style={styles.dialogCancelLabel}>Cancel</Button.Label>
              </Button>
              <Button
                variant="primary"
                onPress={onDeleteConfirm}
                style={styles.dialogDeleteBtn}
              >
                <Button.Label style={styles.dialogDeleteLabel}>
                  Yes, Delete
                </Button.Label>
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  );
};

// ─── Sub-component styles ─────────────────────────────────────────
const labelStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
    marginBottom: hp(1),
    paddingHorizontal: wp(1),
  },
  text: {
    fontSize: isTablet ? wp(2.4) : wp(3),
    color: "#9CA3AF",
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});

const groupStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: wp(5),
    overflow: "hidden",
    shadowColor: "#0F1117",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4.5),
    gap: wp(3.5),
  },
  iconBox: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(3),
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1 },
  title: {
    fontSize: isTablet ? wp(3) : wp(3.8),
    fontWeight: "600",
    color: "#111827",
  },
  dangerTitle: { color: "#EF4444" },
  subtitle: {
    fontSize: isTablet ? wp(2.4) : wp(3.1),
    color: "#9CA3AF",
    marginTop: hp(0.2),
  },
  right: { alignItems: "center", justifyContent: "center" },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: wp(4.5) + wp(10) + wp(3.5),
  },
});

const styles = StyleSheet.create({
  wrapper: { gap: hp(1.5) },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(1),
    marginBottom: hp(1),
  },
  pageTitle: {
    fontSize: isTablet ? wp(4) : wp(5.5),
    fontWeight: "800",
    color: "#0F1117",
    letterSpacing: -0.3,
  },
  backBtn: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(3),
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  section: { gap: hp(0.5) },

  visibilityChip: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: 99,
  },
  visibilityText: {
    fontSize: wp(3),
    color: "#F97316",
    fontWeight: "700",
  },

  dangerWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: wp(2),
    paddingHorizontal: wp(1),
    paddingTop: hp(0.5),
  },
  dangerWarningText: {
    flex: 1,
    fontSize: isTablet ? wp(2.5) : wp(3.1),
    color: "#9CA3AF",
    lineHeight: hp(2.2),
  },

  // Dialog
  dialogContent: {
    alignItems: "center",
    paddingTop: hp(3),
    gap: hp(1),
  },
  dialogIcon: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(5),
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(0.5),
  },
  dialogTitle: {
    fontSize: isTablet ? wp(4) : wp(5),
    fontWeight: "800",
    color: "#0F1117",
    textAlign: "center",
  },
  dialogDesc: {
    fontSize: isTablet ? wp(2.8) : wp(3.5),
    color: "#6B7280",
    textAlign: "center",
    lineHeight: hp(2.5),
    paddingHorizontal: wp(3),
  },
  dialogFooter: {
    flexDirection: "row",
    gap: wp(3),
    width: "100%",
    marginTop: hp(1.5),
  },
  dialogCancelBtn: {
    flex: 1,
    borderRadius: wp(3),
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingVertical: hp(1.6),
  },
  dialogCancelLabel: {
    color: "#6B7280",
    fontWeight: "700",
    fontSize: isTablet ? wp(2.8) : wp(3.8),
  },
  dialogDeleteBtn: {
    flex: 1,
    borderRadius: wp(3),
    backgroundColor: "#EF4444",
    paddingVertical: hp(1.6),
  },
  dialogDeleteLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: isTablet ? wp(2.8) : wp(3.8),
  },
});