import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import React, { useContext, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { Barcode } from "expo-barcode-generator";
import QRCode from "react-native-qrcode-svg";

const { width, height } = Dimensions.get("window");

export default function ScanScreen() {
  const { userInfo, userDetails } = useContext(AuthContext);
  const { styles } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;

  const cardContainerTranslateY = scrollY.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: [20, 0, -20],
    extrapolate: "clamp",
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["rgb(249, 250, 141)", "transparent"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.4 }}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        <Navbar
          onProfilePress={() => console.log("Profile tapped")}
          onNotifPress={() => console.log("Notifications tapped")}
        />
      </ImageBackground>

      <Animated.View
        style={[
          custom_styles.cardContainer,
          { transform: [{ translateY: cardContainerTranslateY }] },
        ]}
      >
        <Animated.ScrollView
          style={{ flex: 1, width: "100%" }}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <View style={custom_styles.container}>
            {/* Header Section */}
            <View style={custom_styles.headerSection}>
              <Text style={custom_styles.title}>Scan & Earn</Text>
              <Text style={custom_styles.subtitle}>
                Simply scan the barcode or QR code to start collecting points and
                unlock exclusive rewards!
              </Text>
            </View>

            {/* Barcode Section */}
            <View style={custom_styles.codeCard}>
              <View style={custom_styles.codeWrapper}>
                <Barcode
                  value={userDetails?.bar_code || "000000000000"}
                  options={{
                    format: 'CODE128',
                    background: 'transparent',
                    displayValue: false
                  }}
                />
              </View>
              <Text style={custom_styles.barcodeText}>
                {userDetails?.bar_code ? `**** **** ***${userDetails.bar_code.slice(-3)}` : "**** **** ***"}
              </Text>
            </View>

            {/* Divider */}
            <View style={custom_styles.divider}>
              <View style={custom_styles.dividerLine} />
              <Text style={custom_styles.dividerText}>OR</Text>
              <View style={custom_styles.dividerLine} />
            </View>

            {/* QR Code Section */}
            <View style={custom_styles.codeCard}>
              <View style={custom_styles.qrWrapper}>
                <QRCode
                  value={userDetails?.bar_code || "000000000000"}
                  size={width * 0.5}
                  backgroundColor="white"
                />
              </View>
              <Text style={custom_styles.qrLabel}>Scan QR Code</Text>
            </View>

            {/* Info Section */}
            <View style={custom_styles.infoSection}>
              <Text style={custom_styles.infoText}>
                Present this code at the counter to earn points with every purchase
              </Text>
            </View>
          </View>
        </Animated.ScrollView>
      </Animated.View>
    </View>
  );
}

const custom_styles = StyleSheet.create({
  top_bar: {
    height: 150,
    width: "100%",
    position: "relative",
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: -20,
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "relative",
    zIndex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  headerSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: Math.min(width * 0.065, 28),
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Math.min(width * 0.037, 15),
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  codeCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  codeWrapper: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 120,
  },
  barcodeText: {
    fontSize: Math.min(width * 0.042, 18),
    color: "#333",
    fontWeight: "600",
    marginTop: 16,
    letterSpacing: 2,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDD",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
  },
  qrWrapper: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  qrLabel: {
    fontSize: Math.min(width * 0.04, 16),
    color: "#666",
    marginTop: 16,
    fontWeight: "500",
  },
  infoSection: {
    width: "100%",
    backgroundColor: "#FFF9E6",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  infoText: {
    fontSize: Math.min(width * 0.035, 14),
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});