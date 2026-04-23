import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Button, TextField, Label, InputGroup } from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import { wp, hp, isTablet } from "../lib/responsive";

export const ChangePassword = ({
  passwordData,
  setPasswordData,
  isLoading,
  onSave,
  onCancel,
}) => {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const meetsLength = passwordData.newPassword.length >= 6;
  const passwordsMatch =
    passwordData.newPassword &&
    passwordData.newPassword === passwordData.confirmPassword;
  const allFilled =
    passwordData.currentPassword &&
    passwordData.newPassword &&
    passwordData.confirmPassword;
  const strength =
    meetsLength && passwordsMatch && allFilled
      ? "strong"
      : meetsLength
        ? "medium"
        : "weak";

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Pressable onPress={onCancel} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={wp(5.5)} color="#0F1117" />
        </Pressable>
        <Text style={styles.pageTitle}>Change Password</Text>
        <View style={{ width: wp(10) }} />
      </View>

      {/* Lock Icon Hero */}
      <View style={styles.heroSection}>
        <View style={styles.heroIcon}>
          <Ionicons name="shield-checkmark" size={wp(10)} color="#FF5733" />
        </View>
        <Text style={styles.heroTitle}>Secure Your Account</Text>
        <Text style={styles.heroSubtitle}>
          Use a strong password with at least 6 characters to protect your
          account.
        </Text>
      </View>

      {/* Fields Card */}
      <View style={styles.card}>
        {/* Current Password */}
        <TextField
          value={passwordData.currentPassword}
          onChangeText={(t) =>
            setPasswordData({ ...passwordData, currentPassword: t })
          }
        >
          <Label style={styles.fieldLabel}>Current Password</Label>
          <InputGroup>
            <InputGroup.Prefix isDecorative>
              <Ionicons name="lock-closed-outline" size={wp(4.5)} color="#9CA3AF" />
            </InputGroup.Prefix>
            <InputGroup.Input
              placeholder="Enter current password"
              secureTextEntry={!showCurrent}
            />
            <InputGroup.Suffix>
              <Pressable
                onPress={() => setShowCurrent(!showCurrent)}
                hitSlop={20}
              >
                <Ionicons
                  name={showCurrent ? "eye-outline" : "eye-off-outline"}
                  size={wp(4.5)}
                  color="#9CA3AF"
                />
              </Pressable>
            </InputGroup.Suffix>
          </InputGroup>
        </TextField>

        <View style={styles.divider} />

        {/* New Password */}
        <TextField
          value={passwordData.newPassword}
          onChangeText={(t) =>
            setPasswordData({ ...passwordData, newPassword: t })
          }
        >
          <Label style={styles.fieldLabel}>New Password</Label>
          <InputGroup>
            <InputGroup.Prefix isDecorative>
              <Ionicons name="key-outline" size={wp(4.5)} color="#9CA3AF" />
            </InputGroup.Prefix>
            <InputGroup.Input
              placeholder="Min. 6 characters"
              secureTextEntry={!showNew}
            />
            <InputGroup.Suffix>
              <Pressable
                onPress={() => setShowNew(!showNew)}
                hitSlop={20}
              >
                <Ionicons
                  name={showNew ? "eye-outline" : "eye-off-outline"}
                  size={wp(4.5)}
                  color="#9CA3AF"
                />
              </Pressable>
            </InputGroup.Suffix>
          </InputGroup>
        </TextField>

        <View style={styles.divider} />

        {/* Confirm Password */}
        <TextField
          value={passwordData.confirmPassword}
          onChangeText={(t) =>
            setPasswordData({ ...passwordData, confirmPassword: t })
          }
        >
          <Label style={styles.fieldLabel}>Confirm New Password</Label>
          <InputGroup>
            <InputGroup.Prefix isDecorative>
              <Ionicons name="checkmark-circle-outline" size={wp(4.5)} color="#9CA3AF" />
            </InputGroup.Prefix>
            <InputGroup.Input
              placeholder="Re-enter new password"
              secureTextEntry={!showConfirm}
            />
            <InputGroup.Suffix>
              <Pressable
                onPress={() => setShowConfirm(!showConfirm)}
                hitSlop={20}
              >
                <Ionicons
                  name={showConfirm ? "eye-outline" : "eye-off-outline"}
                  size={wp(4.5)}
                  color="#9CA3AF"
                />
              </Pressable>
            </InputGroup.Suffix>
          </InputGroup>
        </TextField>
      </View>

      {/* Requirements Card */}
      <View style={styles.requirementsCard}>
        <Text style={styles.reqHeading}>Requirements</Text>
        <View style={styles.reqList}>
          <ReqItem met={meetsLength} label="At least 6 characters" />
          <ReqItem met={passwordsMatch} label="Passwords match" />
          <ReqItem
            met={!!passwordData.currentPassword}
            label="Current password entered"
          />
        </View>

        {passwordData.newPassword.length > 0 && (
          <View style={styles.strengthSection}>
            <View style={styles.strengthBars}>
              <View
                style={[
                  styles.strengthBar,
                  strength !== "weak" && { backgroundColor: "#10B981" },
                ]}
              />
              <View
                style={[
                  styles.strengthBar,
                  strength === "medium" && { backgroundColor: "#F59E0B" },
                  strength === "strong" && { backgroundColor: "#10B981" },
                ]}
              />
              <View
                style={[
                  styles.strengthBar,
                  strength === "strong" && { backgroundColor: "#10B981" },
                ]}
              />
            </View>
            <Text
              style={[
                styles.strengthLabel,
                strength === "weak" && { color: "#EF4444" },
                strength === "medium" && { color: "#F59E0B" },
                strength === "strong" && { color: "#10B981" },
              ]}
            >
              {strength === "weak"
                ? "Weak"
                : strength === "medium"
                  ? "Medium"
                  : "Strong"}
            </Text>
          </View>
        )}
      </View>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Button
          variant="ghost"
          onPress={onCancel}
          style={styles.footerBtnGhost}
        >
          <Button.Label style={styles.ghostLabel}>Cancel</Button.Label>
        </Button>
        <Button
          variant="primary"
          onPress={onSave}
          isLoading={isLoading}
          style={styles.footerBtnPrimary}
        >
          <Button.Label style={styles.primaryLabel}>
            Update Password
          </Button.Label>
        </Button>
      </View>
    </View>
  );
};

const ReqItem = ({ met, label }) => (
  <View style={reqStyles.row}>
    <View style={[reqStyles.dot, met && reqStyles.dotMet]}>
      <Ionicons
        name={met ? "checkmark" : "remove"}
        size={wp(3)}
        color={met ? "#fff" : "#9CA3AF"}
      />
    </View>
    <Text style={[reqStyles.label, met && reqStyles.labelMet]}>{label}</Text>
  </View>
);

const reqStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: wp(2.5) },
  dot: {
    width: wp(5),
    height: wp(5),
    borderRadius: 99,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  dotMet: { backgroundColor: "#10B981" },
  label: {
    fontSize: isTablet ? wp(2.5) : wp(3.3),
    color: "#9CA3AF",
    fontWeight: "500",
  },
  labelMet: { color: "#374151", fontWeight: "600" },
});

const styles = StyleSheet.create({
  wrapper: { gap: hp(2) },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(1),
    marginBottom: hp(0.5),
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

  heroSection: {
    alignItems: "center",
    paddingVertical: hp(2),
    gap: hp(1),
  },
  heroIcon: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(5),
    backgroundColor: "#FFF3F1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(0.5),
  },
  heroTitle: {
    fontSize: isTablet ? wp(4) : wp(5.5),
    fontWeight: "800",
    color: "#0F1117",
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: isTablet ? wp(2.8) : wp(3.5),
    color: "#6B7280",
    textAlign: "center",
    lineHeight: hp(2.5),
    paddingHorizontal: wp(4),
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: wp(5),
    padding: wp(5),
    gap: hp(1.5),
    shadowColor: "#0F1117",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  fieldLabel: {
    fontSize: isTablet ? wp(2.8) : wp(3.3),
    fontWeight: "600",
    color: "#374151",
    marginBottom: hp(0.5),
  },

  requirementsCard: {
    backgroundColor: "#fff",
    borderRadius: wp(5),
    padding: wp(5),
    gap: hp(1.5),
    shadowColor: "#0F1117",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  reqHeading: {
    fontSize: isTablet ? wp(2.8) : wp(3.3),
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  reqList: { gap: hp(1.1) },

  strengthSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
    marginTop: hp(0.5),
    paddingTop: hp(1),
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  strengthBars: { flexDirection: "row", gap: wp(2), flex: 1 },
  strengthBar: {
    flex: 1,
    height: hp(0.6),
    borderRadius: 99,
    backgroundColor: "#F3F4F6",
  },
  strengthLabel: {
    fontSize: isTablet ? wp(2.8) : wp(3.5),
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    gap: wp(3),
  },
  footerBtnGhost: {
    flex: 1,
    borderRadius: wp(3),
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingVertical: hp(1.6),
  },
  ghostLabel: {
    color: "#6B7280",
    fontWeight: "700",
    fontSize: isTablet ? wp(2.8) : wp(3.8),
  },
  footerBtnPrimary: {
    flex: 2,
    borderRadius: wp(3),
    backgroundColor: "#FF5733",
    paddingVertical: hp(1.6),
  },
  primaryLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: isTablet ? wp(2.8) : wp(3.8),
  },
});