import React, { useContext } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NotificationContext } from "../context/ActivityNotif";

export default function Navbar({ hideBack = false }) {
  const navigation = useNavigation();
  const { notifCount, setNotifCount } = useContext(NotificationContext);

  return (
    <View style={styles.container}>
      {!hideBack ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
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
            setNotifCount(0); // reset counter when visiting notifications
          }}
          style={styles.singleIconWrapper}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
          {notifCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notifCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
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
    shadowRadius: 4,
    position: "relative"
  },
  iconWrapper: {
    marginHorizontal: 4
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center"
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold"
  }
});
