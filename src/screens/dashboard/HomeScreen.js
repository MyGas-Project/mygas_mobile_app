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
  RefreshControl
} from "react-native";
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "../../components/Navbar";

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
      image: require("../../../assets/motorista.png")
    },
    {
      id: "2",
      title: "Tire Replacement",
      description:
        "Our tire replacement service offers a variety of tire brands and types, ensuring safety and comfort on the road.",
      image: require("../../../assets/motorista.png")
    },
    {
      id: "3",
      title: "Brake Service",
      description:
        "Get your brakes inspected and replaced by our experienced technicians to ensure your safety.",
      image: require("../../../assets/motorista.png")
    },
    {
      id: "4",
      title: "Battery Replacement",
      description:
        "We provide battery replacement services with high-performance, long-lasting batteries to keep your vehicle running smoothly.",
      image: require("../../../assets/motorista.png")
    }
  ];

  const REWARDS_DATA = [
    {
      id: "1",
      title: "Free Car Wash",
      description:
        "Exchange your loyalty points for a free car wash and keep your vehicle looking pristine!",
      image: require("../../../assets/motorista.png")
    },
    {
      id: "2",
      title: "Discount on Services",
      description:
        "Use your points for discounts on future services, such as oil changes, tire replacements, and more.",
      image: require("../../../assets/motorista.png")
    },
    {
      id: "3",
      title: "Gift Voucher",
      description:
        "Redeem your points for a gift voucher to use on services or products from our store.",
      image: require("../../../assets/motorista.png")
    },
    {
      id: "4",
      title: "Fuel Discount",
      description:
        "Save on fuel by using your points to receive a discount on premium gasoline or diesel.",
      image: require("../../../assets/motorista.png")
    }
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
        style={custom_styles.top_bar}
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
        <View style={custom_styles.topRightIcons}>
          <TouchableOpacity style={custom_styles.iconCircle}>
            <Ionicons name="person-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={custom_styles.iconCircle}>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <Animated.View
        style={[
          custom_styles.cardContainer,
          { transform: [{ translateY: cardContainerTranslateY }] }
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="transparent"
              colors={["transparent"]}
              progressViewOffset={60}
            />
          }
        >
          {/* your services & rewards UI here (no change needed) */}
        </Animated.ScrollView>
      </Animated.View>
      <View style={{ height: 70 }} />
    </View>
  );
}
const custom_styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
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
  coverImagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#D3D3D3"
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 6
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
    shadowRadius: 4
  },
  top_bar: {
    height: 150,
    width: "100%",
    position: "relative"
  },
  logo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -40 }, { translateY: -40 }],
    width: 65,
    height: 65,
    resizeMode: "contain",
    zIndex: 2
  },
  headerRight: {
    position: "absolute",
    right: 16,
    top: 50,
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center"
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
    zIndex: 1
  }
});
