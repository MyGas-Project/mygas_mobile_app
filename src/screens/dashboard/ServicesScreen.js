import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";

import Navbar from "../../components/Navbar";

export default function ServicesScreen() {
  const { styles } = useTheme();

  const DATA = [
    {
      id: "1",
      title: "Oil Change",
      description:
        "We offer high-quality oil change services with top-brand oils to ensure the best performance of your engine.",
    },
    {
      id: "2",
      title: "Tire Replacement",
      description:
        "Our tire replacement service offers a variety of tire brands and types, ensuring safety and comfort on the road.",
    },
    {
      id: "3",
      title: "Brake Service",
      description:
        "Get your brakes inspected and replaced by our experienced technicians to ensure your safety.",
    },
    {
      id: "4",
      title: "Battery Replacement",
      description:
        "We provide battery replacement services with high-performance, long-lasting batteries to keep your vehicle running smoothly.",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <Navbar
          onProfilePress={() => console.log("Profile tapped")}
          onNotifPress={() => console.log("Notifications tapped")}
        />
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
      </ImageBackground>

      <View style={{ flex: 1, width: "100%" }}>
        <View style={{ width: "100%", paddingTop: 16, paddingHorizontal: 16 }}>
          <Text
            style={[
              styles.text,
              styles.text_md,
              styles.text_bold,
              styles.text_primary,
            ]}
          >
            Services
          </Text>
          <Text>
            Expect Care fir Your Ride: Quality Services to Keep Ypi on the Road,
            Smooth and Safe!
          </Text>

          <FlatList
            style={{ marginTop: 10, padding: 10 }}
            data={DATA}
            renderItem={({ item }) => (
              <View style={styles.card}>
                {/* Grey background placeholder for cover photo */}
                <View style={styles.coverImagePlaceholder}></View>
                <View style={styles.content}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
      <View style={{ flex: 1, width: "100%" }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: 300,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: "hidden",
  },
  coverImagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#D3D3D3",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
