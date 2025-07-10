import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import React, { useContext, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { Barcode } from "expo-barcode-generator";
// import { QRCode } from "react-native-qrcode-svg";

// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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
          contentContainerStyle={{ paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <View style={custom_styles.container}>
            <Text style={custom_styles.title}>Scan & Earn</Text>
            <Text style={custom_styles.subtitle}>
              Simply scan the barcode or QR code to start collecting points and
              unlock exclusive rewards!
            </Text>
            <Barcode
              value={userDetails?.bar_code}
              options={{ format: 'CODE128', background: 'transparent' }}
            />
            {/* <Image
              source={require("../../../assets/code.png")}
              style={custom_styles.code}
            /> */}
            <Text style={custom_styles.barcodeText}>{userDetails?.bar_code ? `**** **** ***${userDetails.bar_code.slice(-3)}` : ""}</Text>
            {/* <QRCode value="54321" size={300} /> */}
            {/* <Image
              source={require("../../../assets/barcode.png")}
              style={custom_styles.barcode}
            /> */}
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
  logo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -40 }, { translateY: -40 }],
    width: 65,
    height: 65,
    resizeMode: "contain",
    zIndex: 2,
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
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
    // paddingHorizontal: 20,
  },
  code: {
    width: "150%",
    height: 100,
    resizeMode: "contain",
  },
  barcodeText: {
    fontSize: 16,
    color: "#333",
  },
  barcode: {
    width: 300,
    height: 200,
    resizeMode: "contain",
  },
});