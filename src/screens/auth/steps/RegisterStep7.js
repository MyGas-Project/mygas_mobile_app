import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import RegisterLayout from "../components/RegisterLayout";
import { Ionicons } from "@expo/vector-icons";

export default function Step7({ navigation }) {
  const { styles } = useTheme();
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const vehicleTypes = [
    { label: "2 wheeler", value: "2 wheeler" },
    { label: "4 wheeler", value: "4 wheeler" },
    { label: "both", value: "both" },
  ];

  const handleSelectVehicleType = (type) => {
    setSelectedVehicleType(type.value);
    setIsDropdownVisible(false);
  };

  const renderDropdownItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        selectedVehicleType === item.value && { backgroundColor: "#f0f0f0" },
      ]}
      onPress={() => handleSelectVehicleType(item)}
    >
      <Text
        style={[
          styles.text,
          selectedVehicleType === item.value && { fontWeight: "bold" },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <RegisterLayout
      step={7}
      navigation={navigation}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate("Step8")}
      backText="Back"
      nextText="Next"
    >
      <View style={{ padding: 20 }}>
        <Text style={[styles.text, styles.text_md]}>Create Your Account</Text>
        <Text style={[styles.text, styles.text_lg]}>
          What vehicle type do you have?
        </Text>
      </View>
      <View style={styles.form_container}>
        <View style={styles.form_section}>
          <TouchableOpacity
            style={[
              styles.form_input,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
            ]}
            onPress={() => setIsDropdownVisible(true)}
          >
            <Text
              style={[
                styles.text,
                { color: selectedVehicleType ? styles.text.color : "#999" },
              ]}
            >
              {selectedVehicleType || "Select vehicle type"}
            </Text>
            <Ionicons
              name={isDropdownVisible ? "chevron-up" : "chevron-down"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <FlatList
              data={vehicleTypes}
              renderItem={renderDropdownItem}
              keyExtractor={(item) => item.value}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </RegisterLayout>
  );
}
