import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import {
  Card,
  Button,
  TextField,
  Label,
  InputGroup,
  Select,
} from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import { wp, hp, isTablet } from "../lib/responsive";

const SectionHeader = ({ icon, title, color = "#3B82F6", bg = "#EFF6FF" }) => (
  <View style={sectionStyles.row}>
    <View style={[sectionStyles.iconBox, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={wp(4.5)} color={color} />
    </View>
    <Text style={sectionStyles.title}>{title}</Text>
  </View>
);

const FieldView = ({ label, value }) => (
  <View style={styles.fieldBlock}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value || "—"}</Text>
  </View>
);

export const ProfileDetails = ({
  userDetails,
  editedDetails,
  setEditedDetails,
  editMode,
  setEditMode,
  isLoading,
  onSave,
  onCancel,
  onChangePassword,
  onBack,
  onBirthdayEditAttempt,
}) => {
  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Others", value: "others" },
  ];

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={wp(5.5)} color="#0F1117" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Profile Details</Text>
        {!editMode ? (
          <TouchableOpacity onPress={() => setEditMode(true)} style={styles.editBtn}>
            <Ionicons name="create-outline" size={wp(5.5)} color="#FF5733" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: wp(10) }} />
        )}
      </View>

      {/* Personal Info Card */}
      <Card style={styles.card}>
        <View style={styles.cardInner}>
          <SectionHeader
            icon="person-outline"
            title="Personal Information"
            color="#3B82F6"
            bg="#EFF6FF"
          />

          <View style={styles.fieldRow}>
            {/* Gender */}
            <View style={styles.fieldHalf}>
              {editMode ? (
                <View style={styles.fieldBlock}>
                  <Text style={styles.fieldLabel}>Gender</Text>
                  <Select
                    value={editedDetails?.gender ?? ""}
                    onValueChange={(val) =>
                      setEditedDetails({ ...editedDetails, gender: val })
                    }
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="select gender" />
                      <Select.TriggerIndicator />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Overlay />
                      <Select.Content presentation="popover" width="trigger">
                        {genderOptions.map((opt) => (
                          <Select.Item
                            key={opt.value}
                            value={opt.value}
                            label={opt.label}
                          />
                        ))}
                      </Select.Content>
                    </Select.Portal>
                  </Select>
                </View>
              ) : (
                <FieldView label="Gender" value={userDetails?.gender} />
              )}
            </View>

            {/* Civil Status */}
            <View style={styles.fieldHalf}>
              {editMode ? (
                <TextField>
                  <Label><Text>Civil Status</Text></Label>
                  <InputGroup>
                    <InputGroup.Prefix isDecorative>
                      <Ionicons name="heart-outline" size={wp(4)} color="#9CA3AF" />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      value={editedDetails.civil_status}
                      onChangeText={(t) =>
                        setEditedDetails({ ...editedDetails, civil_status: t })
                      }
                      placeholder="e.g. Single"
                    />
                  </InputGroup>
                </TextField>
              ) : (
                <FieldView label="Civil Status" value={userDetails?.civil_status} />
              )}
            </View>
          </View>

          {/* Birth Date + ID Presented */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              {editMode ? (
                <TextField>
                  <Label><Text>Birth Date</Text></Label>
                  <InputGroup>
                    <InputGroup.Input
                      value={editedDetails.birth_date || ""}
                      placeholder="Not set"
                      editable={false}
                      onPressIn={onBirthdayEditAttempt}
                    />
                    <InputGroup.Suffix>
                      <Pressable onPress={onBirthdayEditAttempt} hitSlop={10}>
                        <Ionicons name="lock-closed-outline" size={wp(4)} color="#9CA3AF" />
                      </Pressable>
                    </InputGroup.Suffix>
                  </InputGroup>
                </TextField>
              ) : (
                <FieldView label="Birth Date" value={userDetails?.birth_date} />
              )}
            </View>

            <View style={styles.fieldHalf}>
              <FieldView label="ID Presented" value={userDetails?.is_presented_id_flag} />
            </View>
          </View>
        </View>
      </Card>

      {/* Contact Info Card */}
      <Card style={styles.card}>
        <View style={styles.cardInner}>
          <SectionHeader
            icon="mail-outline"
            title="Contact Information"
            color="#8B5CF6"
            bg="#F5F3FF"
          />

          {/* Phone Number — always locked */}
          <TextField>
            <Label><Text>Phone Number</Text></Label>
            <InputGroup isDisabled>
              <InputGroup.Prefix isDecorative>
                <Ionicons name="call-outline" size={wp(4)} color="#9CA3AF" />
              </InputGroup.Prefix>
              <InputGroup.Input
                value={userDetails?.phone_number || ""}
                placeholder="—"
                editable={false}
              />
              <InputGroup.Suffix isDecorative>
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={wp(3)} color="#9CA3AF" />
                  <Text style={styles.lockBadgeText}>Locked</Text>
                </View>
              </InputGroup.Suffix>
            </InputGroup>
          </TextField>

          {/* Email */}
          <TextField>
            <Label><Text>Email</Text></Label>
            <InputGroup isDisabled={!editMode}>
              <InputGroup.Prefix isDecorative>
                <Ionicons name="mail-outline" size={wp(4)} color="#9CA3AF" />
              </InputGroup.Prefix>
              <InputGroup.Input
                value={editMode ? editedDetails.email : (userDetails?.email || "")}
                onChangeText={
                  editMode
                    ? (t) => setEditedDetails({ ...editedDetails, email: t })
                    : undefined
                }
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter email address"
                editable={editMode}
              />
            </InputGroup>
          </TextField>

          {/* Address */}
          <TextField>
            <Label><Text>Address</Text></Label>
            <InputGroup isDisabled={!editMode}>
              <InputGroup.Prefix isDecorative>
                <Ionicons name="location-outline" size={wp(4)} color="#9CA3AF" />
              </InputGroup.Prefix>
              <InputGroup.Input
                value={editMode ? editedDetails.address : (userDetails?.address || "")}
                onChangeText={
                  editMode
                    ? (t) => setEditedDetails({ ...editedDetails, address: t })
                    : undefined
                }
                placeholder="Enter your address"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={editMode}
              />
            </InputGroup>
          </TextField>
        </View>
      </Card>

      {/* Security Card */}
      <Card style={styles.card}>
        <View style={styles.cardInner}>
          <SectionHeader
            icon="shield-checkmark-outline"
            title="Security"
            color="#10B981"
            bg="#ECFDF5"
          />

          <TouchableOpacity
            style={styles.securityRow}
            onPress={onChangePassword}
            activeOpacity={0.7}
          >
            <View style={styles.securityLeft}>
              <Text style={styles.securityLabel}>Password</Text>
              <Text style={styles.securityDots}>••••••••</Text>
            </View>
            <View style={styles.changeChip}>
              <Text style={styles.changeChipText}>Change</Text>
              <Ionicons name="chevron-forward" size={wp(4)} color="#FF5733" />
            </View>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Edit Mode Footer */}
      {editMode && (
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
            <Button.Label style={styles.primaryLabel}>Save Changes</Button.Label>
          </Button>
        </View>
      )}
    </View>
  );
};

const sectionStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2.5),
    marginBottom: hp(1.8),
  },
  iconBox: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(2.2),
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: isTablet ? wp(3) : wp(3.8),
    fontWeight: "700",
    color: "#111827",
  },
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
  editBtn: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(3),
    backgroundColor: "#FFF3F1",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: wp(5),
    shadowColor: "#0F1117",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    padding: 0,
  },
  cardInner: {
    padding: wp(5),
    gap: hp(1.6),
  },

  fieldRow: { flexDirection: "row", gap: wp(4) },
  fieldHalf: { flex: 1 },
  fieldBlock: { gap: hp(0.5) },
  fieldLabel: {
    fontSize: isTablet ? wp(2.4) : wp(3.1),
    color: "#9CA3AF",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  fieldValue: {
    fontSize: isTablet ? wp(3) : wp(3.8),
    color: "#111827",
    fontWeight: "500",
  },

  lockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
    backgroundColor: "#F3F4F6",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: 99,
  },
  lockBadgeText: {
    fontSize: wp(2.8),
    color: "#9CA3AF",
    fontWeight: "600",
  },

  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.6),
  },
  securityLeft: { gap: hp(0.3) },
  securityLabel: {
    fontSize: isTablet ? wp(2.5) : wp(3.3),
    color: "#9CA3AF",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  securityDots: {
    fontSize: isTablet ? wp(3) : wp(4),
    color: "#374151",
    letterSpacing: 2,
  },
  changeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(1),
    backgroundColor: "#FFF3F1",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.7),
    borderRadius: 99,
  },
  changeChipText: {
    color: "#FF5733",
    fontWeight: "700",
    fontSize: isTablet ? wp(2.8) : wp(3.5),
  },

  footer: {
    flexDirection: "row",
    gap: wp(3),
    paddingTop: hp(0.5),
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