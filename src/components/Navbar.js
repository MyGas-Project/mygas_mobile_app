import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Navbar({ onProfilePress, onNotifPress, hideBack = false }) {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      {!hideBack ? (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.iconWrapper}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      <View style={styles.rightIcons}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Notifications");
          }}
          style={styles.singleIconWrapper}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile");
          }}
          style={styles.singleIconWrapper}
        >
          <Ionicons name="person-circle-outline" size={26} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  rightIconsWrapper: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  singleIconWrapper: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },

  iconWrapper: {
    marginHorizontal: 4
  }
});
