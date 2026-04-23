import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Button, Avatar, ListGroup, Separator } from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { wp, hp, isTablet } from "../lib/responsive";

export const ProfileHome = ({
  userDetails,
  userInfo,
  onEditProfile,
  onSettings,
  onChangePassword,
}) => {
  const { logout } = useContext(AuthContext);
  const initials =
    (userDetails?.first_name?.charAt(0) ?? "") +
    (userDetails?.last_name?.charAt(0) ?? "");

  const needsPasswordChange = userDetails?.is_pass_change === 0;

  const fullName = [
    userDetails?.first_name,
    userDetails?.middle_name
      ? userDetails.middle_name.charAt(0) + "."
      : null,
    userDetails?.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <View style={styles.container}>

      {/* ── Password Alert Banner ── */}
      {needsPasswordChange && (
        <View style={styles.alertBanner}>
          <View style={styles.alertLeft}>
            <View style={styles.alertIconBox}>
              <Ionicons name="warning" size={wp(5)} color="#B45309" />
            </View>
            <View style={styles.alertTextBlock}>
              <Text style={styles.alertTitle}>Password Update Required</Text>
              <Text style={styles.alertDesc}>
                You're using a default password. Update it now for better security.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onChangePassword}
            style={styles.alertBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.alertBtnLabel}>Update Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Hero Profile Card ── */}
      <View style={styles.heroCard}>
        <View style={styles.heroAccent} />
        <View style={styles.heroContent}>
          <View style={styles.avatarWrapper}>
            <Avatar size="lg" style={styles.avatar}>
              <Avatar.Fallback size="xl" color="default">{initials}</Avatar.Fallback>
            </Avatar>
            <View style={styles.avatarBadge}>
              <Ionicons name="checkmark" size={wp(3)} color="#fff"/>
            </View>
          </View>

          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{fullName || "—"}</Text>
            <View style={styles.heroMeta}>
              <View style={styles.metaRow}>
                <Ionicons name="call-outline" size={wp(3.8)} color="#6B7280" />
                <Text style={styles.metaText}>
                  {userDetails?.phone_number || "—"}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="mail-outline" size={wp(3.8)} color="#6B7280" />
                <Text style={styles.metaText} numberOfLines={1}>
                  {userDetails?.email || "No email yet"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={onEditProfile}
          activeOpacity={0.85}
        >
          <Ionicons
            name="create-outline"
            size={wp(4.5)}
            color="#fff"
            style={{ marginRight: wp(2) }}
          />
          <Text style={styles.editBtnLabel}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* ── Stats Row ── */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {userDetails?.gender
              ? userDetails.gender.charAt(0).toUpperCase() +
              userDetails.gender.slice(1)
              : "—"}
          </Text>
          <Text style={styles.statLabel}>Gender</Text>
        </View>
        <View style={[styles.statCard, styles.statCardCenter]}>
          <Text style={styles.statValue}>
            {userDetails?.civil_status || "—"}
          </Text>
          <Text style={styles.statLabel}>Civil Status</Text>
        </View>
        <View style={styles.statCard}>
          <View
            style={[
              styles.idBadge,
              userDetails?.is_presented_id_flag && styles.idBadgeActive,
            ]}
          >
            <Ionicons
              name={
                userDetails?.is_presented_id_flag
                  ? "shield-checkmark"
                  : "shield-outline"
              }
              size={wp(5.5)}
              color={userDetails?.is_presented_id_flag ? "#10B981" : "#9CA3AF"}
            />
          </View>
          <Text style={styles.statLabel}>ID Verified</Text>
        </View>
      </View>

      {/* ── Quick Access Menu ── */}
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionLabel}>QUICK ACCESS</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIcon, { backgroundColor: "#FFF3E0" }]}>
              <Image
                source={require("../../assets/mygas_logo.png")}
                style={styles.menuLogo}
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Loyalty Program</Text>
              <Text style={styles.menuSubtitle}>Motorista Card</Text>
            </View>
            <View style={styles.menuChevron}>
              <Ionicons name="chevron-forward" size={wp(4.5)} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={onSettings}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="settings-outline" size={wp(5)} color="#3B82F6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Settings</Text>
              <Text style={styles.menuSubtitle}>Preferences & privacy</Text>
            </View>
            <View style={styles.menuChevron}>
              <Ionicons name="chevron-forward" size={wp(4.5)} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={onChangePassword}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#F0FDF4" }]}>
              <Ionicons
                name="lock-closed-outline"
                size={wp(5)}
                color="#10B981"
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Security</Text>
              <Text style={styles.menuSubtitle}>Password & access</Text>
            </View>
            <View style={styles.menuChevron}>
              <Ionicons name="chevron-forward" size={wp(4.5)} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Logout ── */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => logout(userInfo)}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={wp(5)} color="#EF4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: hp(2.2) },

  // ── Alert Banner ──────────────────────────────────────
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderRadius: wp(4),
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
    paddingVertical: hp(1.8),
    paddingRight: wp(3),
    paddingLeft: wp(3.5),
    gap: wp(2),
  },
  alertLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: wp(2.5),
  },
  alertIconBox: {
    marginTop: hp(0.2),
  },
  alertTextBlock: { flex: 1 },
  alertTitle: {
    fontSize: isTablet ? wp(2.8) : wp(3.5),
    fontWeight: "700",
    color: "#92400E",
    marginBottom: hp(0.3),
  },
  alertDesc: {
    fontSize: isTablet ? wp(2.4) : wp(3),
    color: "#B45309",
    lineHeight: hp(2.2),
  },
  alertBtn: {
    backgroundColor: "#F59E0B",
    borderRadius: wp(2.5),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1),
    flexShrink: 0,
  },
  alertBtnLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: isTablet ? wp(2.4) : wp(3.2),
  },

  // ── Hero Card ──────────────────────────────────────────
  heroCard: {
    backgroundColor: "#fff",
    borderRadius: wp(5),
    padding: wp(5),
    shadowColor: "#0F1117",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
    overflow: "hidden",
  },
  heroAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: hp(0.5),
    backgroundColor: "#FF5733",
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(4),
    marginBottom: hp(2.2),
  },
  avatarWrapper: { position: "relative" },
  avatar: {
    backgroundColor: "#FF5733",
    width: isTablet ? wp(12) : wp(16),
    height: isTablet ? wp(12) : wp(16),
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#10B981",
    borderRadius: 99,
    width: wp(5),
    height: wp(5),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  heroInfo: { flex: 1 },
  heroName: {
    fontSize: isTablet ? wp(3.5) : wp(5),
    fontWeight: "800",
    color: "#0F1117",
    letterSpacing: -0.3,
    marginBottom: hp(0.8),
  },
  heroMeta: { gap: hp(0.5) },
  metaRow: { flexDirection: "row", alignItems: "center", gap: wp(2) },
  metaText: {
    fontSize: isTablet ? wp(2.5) : wp(3.3),
    color: "#6B7280",
    flex: 1,
  },
  editBtn: {
    borderRadius: wp(3),
    backgroundColor: "#FF5733",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1.6),
  },
  editBtnLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: isTablet ? wp(2.8) : wp(4),
  },

  // ── Stats Row ──────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    gap: wp(3),
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: wp(4),
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    alignItems: "center",
    shadowColor: "#0F1117",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: hp(0.6),
  },
  statCardCenter: {
    borderWidth: 1.5,
    borderColor: "#F3F4F6",
  },
  statValue: {
    fontSize: isTablet ? wp(2.8) : wp(3.8),
    fontWeight: "700",
    color: "#0F1117",
    textAlign: "center",
  },
  statLabel: {
    fontSize: isTablet ? wp(2.2) : wp(2.8),
    color: "#9CA3AF",
    fontWeight: "500",
    textAlign: "center",
  },
  idBadge: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(2.5),
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  idBadgeActive: { backgroundColor: "#ECFDF5" },

  // ── Menu ───────────────────────────────────────────────
  menuSection: { gap: hp(1) },
  menuSectionLabel: {
    fontSize: wp(2.8),
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 1,
    paddingHorizontal: wp(1),
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: wp(5),
    overflow: "hidden",
    shadowColor: "#0F1117",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4.5),
    gap: wp(3.5),
  },
  menuIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(3),
    alignItems: "center",
    justifyContent: "center",
  },
  menuLogo: { width: wp(6.5), height: wp(6.5), resizeMode: "contain" },
  menuContent: { flex: 1 },
  menuTitle: {
    fontSize: isTablet ? wp(3) : wp(3.8),
    fontWeight: "600",
    color: "#111827",
  },
  menuSubtitle: {
    fontSize: isTablet ? wp(2.5) : wp(3.2),
    color: "#9CA3AF",
    marginTop: hp(0.2),
  },
  menuChevron: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(2),
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: wp(4.5) + wp(10) + wp(3.5),
  },

  // ── Logout ─────────────────────────────────────────────
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2.5),
    paddingVertical: hp(1.8),
    borderRadius: wp(3.5),
    borderWidth: 1.5,
    borderColor: "#FEE2E2",
    backgroundColor: "#FFF5F5",
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: isTablet ? wp(2.8) : wp(3.8),
  },
});