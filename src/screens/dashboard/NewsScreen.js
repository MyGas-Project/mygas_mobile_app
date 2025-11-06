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
  RefreshControl,
  Platform,
  StatusBar
} from "react-native";
import React, { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Responsive sizing
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
const isLargeDevice = SCREEN_WIDTH >= 414;

const scale = (size) => {
  if (isSmallDevice) return size * 0.9;
  if (isMediumDevice) return size;
  return size * 1.05;
};

export default function NewsScreen() {
  const { styles } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: "clamp"
  });

  const cardScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.05, 1],
    extrapolate: "clamp"
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const serviceData = [
    {
      id: "1",
      title: "Lubes and Engine Oil",
      description:
        "Premium lubrication services to maintain and extend your vehicle's engine life with top-quality products.",
      image: require("../../../assets/lubes-engine.jpg"),
      tag: "Maintenance"
    },
    {
      id: "2",
      title: "Fleet Card",
      description:
        "Get exclusive fuel discounts, 24/7 expense tracking, and seamless fleet management with our digital solution.",
      image: require("../../../assets/fleet-cards.png"),
      tag: "Savings"
    }
  ];

  const renderCard = ({ item, index }) => {
    const cardHeight = 280;
    const inputRange = [
      0,
      cardHeight * index,
      cardHeight * (index + 0.5),
      cardHeight * (index + 1)
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 0.98, 0.96],
      extrapolate: "clamp"
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.85],
      extrapolate: "clamp"
    });

    return (
      <Animated.View
        style={[
          custom_styles.card,
          {
            transform: [{ scale }],
            opacity
          }
        ]}
      >
        <View style={custom_styles.cardImageContainer}>
          <Image
            source={item.image}
            style={custom_styles.cardImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={custom_styles.imageGradient}
          />
          <View style={custom_styles.tagContainer}>
            <Text style={custom_styles.tagText}>{item.tag}</Text>
          </View>
        </View>

        <View style={custom_styles.content}>
          <Text style={custom_styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={custom_styles.description} numberOfLines={3}>
            {item.description}
          </Text>

          <TouchableOpacity
            style={custom_styles.button}
            onPress={() => console.log(`Learn More about ${item.title} tapped`)}
            activeOpacity={0.7}
          >
            <Text style={custom_styles.buttonText}>Learn More</Text>
            <View style={custom_styles.buttonArrow}>
              <Text style={custom_styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={custom_styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={{ opacity: headerOpacity }}>
        <ImageBackground
          resizeMode="cover"
          source={require("../../../assets/mygas-header.jpeg")}
          style={custom_styles.header}
        >
          <LinearGradient
            colors={["rgba(249, 250, 141, 0.4)", "rgba(249, 250, 141, 0.1)", "transparent"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={custom_styles.headerGradient}
          />
          <Image
            source={require("../../../assets/mygas_logo.png")}
            style={custom_styles.logo}
          />
          <Navbar
            hideBack
            onProfilePress={() => console.log("Profile tapped")}
            onNotifPress={() => console.log("Notifications tapped")}
          />
        </ImageBackground>
      </Animated.View>

      <View style={custom_styles.mainContent}>
        <AnimatedFlatList
          data={serviceData}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF0000"
              colors={["#FF0000"]}
              progressViewOffset={20}
            />
          }
          ListHeaderComponent={() => (
            <View style={custom_styles.headerContainer}>
              <View style={custom_styles.titleWrapper}>
                <Text style={custom_styles.headerTitle}>
                  News & Updates
                </Text>
                <View style={custom_styles.titleUnderline} />
              </View>
              <Text style={custom_styles.subtitle}>
                Expert care for your ride: Quality services to keep you on the road, smooth and safe
              </Text>
            </View>
          )}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={custom_styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: scale(20) }} />}
        />
      </View>
    </View>
  );
}

const custom_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA"
  },
  header: {
    height: Platform.OS === "ios" ? scale(200) : scale(180),
    width: "100%"
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  logo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [
      { translateX: -scale(32.5) },
      { translateY: -scale(32.5) }
    ],
    width: scale(65),
    height: scale(65),
    resizeMode: "contain",
    zIndex: 2
  },
  mainContent: {
    flex: 1,
    marginTop: -scale(30),
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    paddingHorizontal: scale(16),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8
      },
      android: {
        elevation: 8
      }
    })
  },
  headerContainer: {
    alignItems: "center",
    paddingTop: scale(24),
    paddingBottom: scale(16),
    paddingHorizontal: scale(16)
  },
  titleWrapper: {
    alignItems: "center",
    marginBottom: scale(12)
  },
  headerTitle: {
    fontSize: scale(26),
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: 0.5,
    textAlign: "center"
  },
  titleUnderline: {
    width: scale(60),
    height: 3,
    backgroundColor: "#FF0000",
    borderRadius: 2,
    marginTop: scale(8)
  },
  subtitle: {
    fontSize: scale(13),
    textAlign: "center",
    color: "#6B7280",
    lineHeight: scale(20),
    maxWidth: SCREEN_WIDTH - scale(80),
    fontWeight: "400"
  },
  listContent: {
    paddingBottom: scale(100)
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(16),
    marginHorizontal: scale(4),
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12
      },
      android: {
        elevation: 6
      }
    })
  },
  cardImageContainer: {
    position: "relative",
    height: scale(200),
    width: "100%"
  },
  cardImage: {
    width: "100%",
    height: "100%"
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%"
  },
  tagContainer: {
    position: "absolute",
    top: scale(12),
    right: scale(12),
    backgroundColor: "rgba(255, 0, 0, 0.9)",
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(20),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
      },
      android: {
        elevation: 3
      }
    })
  },
  tagText: {
    color: "#FFFFFF",
    fontSize: scale(11),
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  content: {
    padding: scale(20)
  },
  title: {
    fontSize: scale(20),
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: scale(10),
    lineHeight: scale(26)
  },
  description: {
    fontSize: scale(14),
    color: "#4B5563",
    lineHeight: scale(22),
    marginBottom: scale(20),
    fontWeight: "400"
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0000",
    borderRadius: scale(12),
    paddingVertical: scale(14),
    paddingHorizontal: scale(20),
    ...Platform.select({
      ios: {
        shadowColor: "#FF0000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
      },
      android: {
        elevation: 4
      }
    })
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: scale(15),
    fontWeight: "700",
    letterSpacing: 0.5
  },
  buttonArrow: {
    marginLeft: scale(8),
    width: scale(20),
    height: scale(20),
    alignItems: "center",
    justifyContent: "center"
  },
  arrowText: {
    color: "#FFFFFF",
    fontSize: scale(18),
    fontWeight: "700"
  }
});