import React, { useContext, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Animated, Image, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NotificationContext } from "../context/ActivityNotif";
import { LinearGradient } from "expo-linear-gradient";

export default function Navbar({ hideBack = false }) {
  const navigation = useNavigation();
  const { notifCount, setNotifCount } = useContext(NotificationContext);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({ inputRange: [0, 100], outputRange: [1, 0.8], extrapolate: "clamp" });

  return (
    <Animated.View style={{ opacity: headerOpacity }}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["rgba(249, 250, 141, 0.9)", "transparent"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.4 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Logo always stays centered, independent of buttons */}
        <Image source={require("../../assets/mygas_logo.png")} style={styles.logo} />

        {/* Full-width row: left button | spacer | right buttons */}
        <View style={styles.container}>
          <View style={styles.leftIcons}>
            {!hideBack ? (
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ) : (
              <View style={styles.iconWrapper} /> // invisible placeholder keeps logo centered
            )}
          </View>

          <View style={styles.rightIcons}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Notifications");
                setNotifCount(0);
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

      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  top_bar: {
    height: 150,
    width: "100%",
    position: "relative",
  },
  logo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -32 }, { translateY: -32 }],
    width: 65,
    height: 65,
    resizeMode: "contain",
    zIndex: 2,
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: "0%",      // accounts for status bar
    paddingBottom: 0,   // balances the top padding so items center visually
    paddingHorizontal: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    position: "relative",
  },
  iconWrapper: {
    width: 36,   // same footprint whether visible or hidden
    height: 36,
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
});