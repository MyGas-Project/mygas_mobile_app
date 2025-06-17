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
import React, { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function ScanScreen() {
  const { styles } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const cardContainerTranslateY = scrollY.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: [20, 0, -20],
    extrapolate: "clamp",
  });

  const serviceData = [
    {
      id: "1",
      title: "Lubes and Engine Oil",
      description:
        "We offer lubes and engine oil services to help maintain and extend the life of your vehicle's engine.",
      image: require("../../../assets/motorista.png"),
    },
    {
      id: "2",
      title: "Fleet Card",
      description:
        "Get your Fleet card today for exclusive fuel discounts, 24/7 expense tracking, and seamless fleet management.",
      image: require("../../../assets/motorista.png"),
    },
  ];

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

      <View style={custom_styles.container}>
        <Text style={custom_styles.title}>Scan & Earn</Text>
        <Text style={custom_styles.subtitle}>
          Simply scan the barcode or QR code to start collecting points and
          unlock exclusive rewards!
        </Text>
        <Image
          source={require("../../../assets/code.png")}
          style={custom_styles.code}
        />
        <Text style={custom_styles.barcodeText}>1234 ******</Text>
        <Image
          source={require("../../../assets/barcode.png")}
          style={custom_styles.barcode}
        />
      </View>
    </View>
  );
}

const custom_styles = StyleSheet.create({
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
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 5,
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
    width: 350,
    height: "50%",
    resizeMode: "contain",
  },  
});
