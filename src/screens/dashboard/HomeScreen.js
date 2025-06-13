import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function HomeScreen({ navigation }) {
  const { styles } = useTheme();
  const DATA = [
    {
      id: "1",
      title: "Oil Change",
      description:
        "We offer high-quality oil change services with top-brand oils to ensure the best performance of your engine.",
      image: require("../../../assets/motorista.png"),
    },
    {
      id: "2",
      title: "Tire Replacement",
      description:
        "Our tire replacement service offers a variety of tire brands and types, ensuring safety and comfort on the road.",
      image: require("../../../assets/motorista.png"),
    },
    {
      id: "3",
      title: "Brake Service",
      description:
        "Get your brakes inspected and replaced by our experienced technicians to ensure your safety.",
      image: require("../../../assets/motorista.png"),
    },
    {
      id: "4",
      title: "Battery Replacement",
      description:
        "We provide battery replacement services with high-performance, long-lasting batteries to keep your vehicle running smoothly.",
      image: require("../../../assets/motorista.png"),
    },
  ];

  const REWARDS_DATA = [
    {
      id: "1",
      title: "Free Car Wash",
      description:
        "Exchange your loyalty points for a free car wash and keep your vehicle looking pristine!",
      image: require("../../../assets/motorista.png"),
    },
    {
      id: "2",
      title: "Discount on Services",
      description:
        "Use your points for discounts on future services, such as oil changes, tire replacements, and more.",
      image: require("../../../assets/motorista.png"),
    },
    {
      id: "3",
      title: "Gift Voucher",
      description:
        "Redeem your points for a gift voucher to use on services or products from our store.",
      image: require("../../../assets/motorista.png"),
    },
    {
      id: "4",
      title: "Fuel Discount",
      description:
        "Save on fuel by using your points to receive a discount on premium gasoline or diesel.",
      image: require("../../../assets/motorista.png"),
    },
  ];
  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.tabScreen}>
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
        <Image
          source={require("../../../assets/mygas_logo.png")}
          style={{
            width: 100,
            height: 50,
            resizeMode: "contain",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: [{ translateX: -50 }, { translateY: -25 }],
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            position: "absolute",
            right: 10,
            top: "50%",
            transform: [{ translateY: -17 }],
          }}
        >
          <TouchableOpacity style={custom_styles.iconCircle}>
            <Ionicons name="person-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={custom_styles.iconCircle}>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <ScrollView style={{ flex: 1, width: "100%" }}>
        <View style={styles.greetingsContainer}>
          <View>
            <Text style={[styles.text, styles.text_sm]}>Good Day,</Text>
            <Text style={[styles.text, styles.text_lg, styles.text_bold]}>
              Juan Dela Cruz
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("ScanScreen")}>
            <View
              style={{
                backgroundColor: "#FFF",
                borderRadius: 20,
                padding: 8,
              }}
            >
              <Ionicons name="qr-code-outline" size={24} color="#000" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          <ImageBackground
            source={require("../../../assets/Card.png")}
            resizeMode="contain"
            style={{
              width: width - 2,
              aspectRatio: 1.58,
              elevation: 5,
              position: "relative",
              padding: 20,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center", // center aligns vertically
                    marginTop: 70,
                    marginLeft: 25,
                  }}
                >
                  <Text
                    style={{
                      color: "#E0B820",
                      fontWeight: "bold",
                      fontSize: 30,
                    }}
                  >
                    1,234.05
                  </Text>
                  <Text
                    style={{
                      color: "#000",
                      fontSize: 18,
                      marginLeft: 4,
                      marginTop: 2,
                    }}
                  >
                    PTS
                  </Text>
                </View>

                <Text style={{ color: "#000", fontSize: 10, marginLeft: 25 }}>
                  01/22/25
                </Text>
                <Text style={{ color: "#000", fontSize: 10, marginLeft: 25 }}>
                  Earned Points: 0.25pts
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: "#000",
                fontSize: 12,
                position: "absolute",
                bottom: 20,
                left: 20,
                marginLeft: 25,
              }}
            >
              **** **** **** 1234
            </Text>
          </ImageBackground>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={[styles.text, styles.text_md, styles.text_bold]}>
            SERVICES
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>We provide best offer services</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 12 }}>View Services</Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                style={{ marginLeft: 1 }}
              />
            </View>
          </View>
          <FlatList
            style={{ marginTop: 10, padding: 10 }}
            data={DATA}
            renderItem={({ item }) => (
              <View style={custom_styles.card}>
                <Image source={item.image} style={custom_styles.coverImage} />
                <View style={custom_styles.content}>
                  <Text style={custom_styles.title}>{item.title}</Text>
                  <Text style={custom_styles.description}>
                    {item.description}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={{ padding: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.text, styles.text_md, styles.text_bold]}>
              REWARDS
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 12 }}>View Rewards</Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                style={{ marginLeft: 1 }}
              />
            </View>
          </View>
          <FlatList
            style={{ marginTop: 10, padding: 10 }}
            data={REWARDS_DATA}
            renderItem={({ item }) => (
              <View style={custom_styles.rewardcard}>
                <Image source={item.image} style={custom_styles.coverImage} />
                <View style={custom_styles.content}>
                  <Text style={custom_styles.title}>{item.title}</Text>
                  <Text style={custom_styles.description}>
                    {item.description}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
      <View style={{ height: 70 }}></View>
    </View>
  );
}
const custom_styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: 250,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: "hidden",
  },
  rewardcard: {
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
  // coverImagePlaceholder: {
  //   width: "100%",
  //   height: 200,
  //   backgroundColor: "#D3D3D3",
  // },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLogo: {
    width: 100,
    height: 50,
    position: "absolute",
    top: 20,
    left: 10,
  },
  topRightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    position: "absolute",
    top: 10,
    right: 10,
  },
  iconCircle: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 5,
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
  },
});
