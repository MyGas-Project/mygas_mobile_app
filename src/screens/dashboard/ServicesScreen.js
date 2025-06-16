import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated
} from "react-native";
import React, { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function ServicesScreen() {
  const { styles } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const cardContainerTranslateY = scrollY.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: [20, 0, -20],
    extrapolate: "clamp"
  });

  const serviceData = [
    {
      id: "1",
      title: "Lubes and Engine Oil",
      description:
        "We offer lubes and engine oil services to help maintain and extend the life of your vehicle's engine.",
      image: require("../../../assets/lubes-engine.jpg")
    },
    {
      id: "2",
      title: "Fleet Card",
      description:
        "Get your Fleet card today for exclusive fuel discounts, 24/7 expense tracking, and seamless fleet management.",
      image: require("../../../assets/fleet-cards.png")
    }
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
        <Image
          source={require("../../../assets/mygas_logo.png")}
          style={custom_styles.logo}
        />
        <Navbar
          onProfilePress={() => console.log("Profile tapped")}
          onNotifPress={() => console.log("Notifications tapped")}
        />
      </ImageBackground>

      <Animated.View
        style={[
          custom_styles.cardContainer,
          {
            transform: [{ translateY: cardContainerTranslateY }]
          }
        ]}
      >
        <AnimatedFlatList
          style={custom_styles.flatListContainer}
          data={serviceData}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          ListHeaderComponent={() => (
            <View style={custom_styles.headerContainer}>
              <Text
                style={[
                  styles.text,
                  styles.text_md,
                  styles.text_bold,
                  styles.text_align
                ]}
              >
                SERVICES
              </Text>
              <Text style={custom_styles.subtitle}>
                Expert Care for Your Ride: Quality Services to Keep You on the
                Road, Smooth and Safe!
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={custom_styles.card}>
              <Image
                source={item.image}
                style={custom_styles.cardImage}
                resizeMode="cover"
              />
              <View style={custom_styles.content}>
                <Text style={custom_styles.title}>{item.title}</Text>
                <Text style={custom_styles.description}>
                  {item.description}
                </Text>
                <TouchableOpacity
                  style={custom_styles.button}
                  onPress={() => console.log(`Learn More about ${item.title} tapped`)}
                  activeOpacity={0.8}
                >
                  <Text style={custom_styles.buttonText}>Learn More</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={custom_styles.flatListContentContainer}
        />
      </Animated.View>
    </View>
  );
}

const custom_styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: Dimensions.get("window").width - 32,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover"
  },
  content: {
    padding: 16
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#FF0000",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#777",
    marginBottom: 20,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: -70,
    backgroundColor: "#F5F5F5",
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  flatListContainer: {
    marginTop: 10,
    width: '100%',
  },
  flatListContentContainer: {
    paddingHorizontal: 0,
    paddingBottom: 20,
    flexGrow: 1,
  },
  button: {
    backgroundColor: "#FF0000",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#777",
    marginBottom: 20
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
  },
  flatListContainer: {
    marginTop: 0,
    width: "100%"
  },
  flatListContentContainer: {
    paddingHorizontal: 0,
    paddingBottom: 60,
    flexGrow: 1
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
    paddingTop: 20
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
  }
});
