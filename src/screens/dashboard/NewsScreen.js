import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  RefreshControl,
  Platform,
  StatusBar,
  ScrollView
} from "react-native";
import React, { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../context/ThemeContext";
import Navbar from "../../components/Navbar";
import { Ionicons } from "@expo/vector-icons";

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

  const cardContainerTranslateY = scrollY.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: [20, 0, -20],
    extrapolate: "clamp"
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const newsData = [
    {
      id: "1",
      title: "Lubes and Engine Oil",
      description:
        "Premium lubrication services to maintain and extend your vehicle's engine life with top-quality products.",
      image: require("../../../assets/lubes-engine.jpg"),
      tag: "Maintenance",
      color: "#FF6B6B",
      date: "Nov 10, 2024"
    },
    {
      id: "2",
      title: "Fleet Card",
      description:
        "Get exclusive fuel discounts, 24/7 expense tracking, and seamless fleet management with our digital solution.",
      image: require("../../../assets/fleet-cards.png"),
      tag: "Savings",
      color: "#4ECDC4",
      date: "Nov 8, 2024"
    },
    {
      id: "3",
      title: "Winter Maintenance Tips",
      description:
        "Essential tips to keep your vehicle running smoothly during the cold season. From tire pressure to battery health.",
      image: require("../../../assets/lubes-engine.jpg"),
      tag: "Tips",
      color: "#FFD93D",
      date: "Nov 5, 2024"
    }
  ];

  const renderNewsCard = (item, index) => {
    const inputRange = [
      -1,
      0,
      (scale(300) + scale(16)) * index,
      (scale(300) + scale(16)) * (index + 1)
    ];

    const cardScale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.97],
      extrapolate: "clamp"
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.8],
      extrapolate: "clamp"
    });

    return (
      <Animated.View
        key={item.id}
        style={[
          custom_styles.newsCard,
          {
            transform: [{ scale: cardScale }],
            opacity,
            marginBottom: index === newsData.length - 1 ? scale(24) : scale(16)
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => console.log(`Viewing ${item.title}`)}
        >
          {/* Image Section */}
          <View style={custom_styles.imageContainer}>
            <Image
              source={item.image}
              style={custom_styles.newsImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={custom_styles.imageGradient}
            />

            {/* Tag Badge */}
            <View style={[custom_styles.tagBadge, { backgroundColor: item.color }]}>
              <Ionicons name="pricetag" size={12} color="#FFF" />
              <Text style={custom_styles.tagText}>{item.tag}</Text>
            </View>

            {/* Date Badge */}
            <View style={custom_styles.dateBadge}>
              <Ionicons name="calendar-outline" size={12} color="#666" />
              <Text style={custom_styles.dateText}>{item.date}</Text>
            </View>
          </View>

          {/* Content Section */}
          <View style={custom_styles.cardContent}>
            <Text style={custom_styles.newsTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={custom_styles.newsDescription} numberOfLines={3}>
              {item.description}
            </Text>

            {/* Read More Button */}
            <View style={custom_styles.readMoreContainer}>
              <Text style={custom_styles.readMoreText}>Read More</Text>
              <View style={custom_styles.arrowCircle}>
                <Ionicons name="arrow-forward" size={16} color="#E0B820" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={custom_styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header matching HomeScreen */}
      <Animated.View style={{ opacity: headerOpacity }}>
        <ImageBackground
          resizeMode="stretch"
          source={require("../../../assets/mygas-header.jpeg")}
          style={custom_styles.header}
        >
          <LinearGradient
            colors={["rgba(249, 250, 141, 0.9)", "transparent"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1.4 }}
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

      {/* Main Content */}
      <Animated.View
        style={[
          custom_styles.mainContent,
          { transform: [{ translateY: cardContainerTranslateY }] }
        ]}
      >
        <Animated.ScrollView
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
              tintColor="#E0B820"
              colors={["#E0B820"]}
              progressViewOffset={20}
            />
          }
          contentContainerStyle={custom_styles.scrollContent}
        >
          {/* Header Section */}
          <View style={custom_styles.headerSection}>
            <View style={custom_styles.titleContainer}>
              <Text style={custom_styles.sectionTitle}>News & Updates</Text>
              <View style={custom_styles.titleUnderline} />
            </View>
            <Text style={custom_styles.subtitle}>
              Stay informed with the latest news, updates, and expert tips to keep you on the road
            </Text>
          </View>

          {/* Featured Stats */}
          <View style={custom_styles.statsRow}>
            <View style={custom_styles.statItem}>
              <View style={[custom_styles.statIcon, { backgroundColor: '#FFE5E5' }]}>
                <Ionicons name="newspaper-outline" size={20} color="#FF6B6B" />
              </View>
              <Text style={custom_styles.statValue}>{newsData.length}</Text>
              <Text style={custom_styles.statLabel}>Articles</Text>
            </View>

            <View style={custom_styles.statItem}>
              <View style={[custom_styles.statIcon, { backgroundColor: '#E5F5FF' }]}>
                <Ionicons name="time-outline" size={20} color="#4ECDC4" />
              </View>
              <Text style={custom_styles.statValue}>Latest</Text>
              <Text style={custom_styles.statLabel}>Updates</Text>
            </View>

            <View style={custom_styles.statItem}>
              <View style={[custom_styles.statIcon, { backgroundColor: '#FFF5E5' }]}>
                <Ionicons name="bookmark-outline" size={20} color="#FFD93D" />
              </View>
              <Text style={custom_styles.statValue}>Save</Text>
              <Text style={custom_styles.statLabel}>Favorites</Text>
            </View>
          </View>

          {/* News Cards */}
          <View style={custom_styles.newsContainer}>
            {newsData.map((item, index) => renderNewsCard(item, index))}
          </View>

          {/* Load More Button */}
          <TouchableOpacity style={custom_styles.loadMoreButton} activeOpacity={0.8}>
            <Text style={custom_styles.loadMoreText}>Load More Articles</Text>
            <Ionicons name="refresh-outline" size={18} color="#E0B820" />
          </TouchableOpacity>
        </Animated.ScrollView>
      </Animated.View>

      {/* Bottom spacing for navigation */}
      <View style={{ height: 70 }} />
    </View>
  );
}

const custom_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA"
  },
  header: {
    height: 150,
    width: "100%",
    position: "relative"
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
    transform: [{ translateX: -32.5 }, { translateY: -32.5 }],
    width: 65,
    height: 65,
    resizeMode: "contain",
    zIndex: 2
  },
  mainContent: {
    flex: 1,
    marginTop: -30,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "relative",
    zIndex: 1
  },
  scrollContent: {
    paddingBottom: scale(20)
  },
  headerSection: {
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingTop: scale(24),
    paddingBottom: scale(16)
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: scale(12)
  },
  sectionTitle: {
    fontSize: scale(26),
    fontWeight: "700",
    color: "#222",
    letterSpacing: -0.5
  },
  titleUnderline: {
    width: scale(60),
    height: 3,
    backgroundColor: "#E0B820",
    borderRadius: 2,
    marginTop: scale(8)
  },
  subtitle: {
    fontSize: scale(13),
    textAlign: "center",
    color: "#666",
    lineHeight: scale(20),
    maxWidth: SCREEN_WIDTH - scale(60)
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
    marginBottom: scale(24)
  },
  statItem: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: scale(12),
    borderRadius: scale(16),
    marginHorizontal: scale(4),
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4
      },
      android: {
        elevation: 2
      }
    })
  },
  statIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale(6)
  },
  statValue: {
    fontSize: scale(16),
    fontWeight: "bold",
    color: "#222",
    marginBottom: scale(2)
  },
  statLabel: {
    fontSize: scale(11),
    color: "#999"
  },
  newsContainer: {
    paddingHorizontal: scale(20)
  },
  newsCard: {
    backgroundColor: "#FFF",
    borderRadius: scale(20),
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
  imageContainer: {
    position: "relative",
    height: scale(200),
    width: "100%"
  },
  newsImage: {
    width: "100%",
    height: "100%"
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%"
  },
  tagBadge: {
    position: "absolute",
    top: scale(12),
    left: scale(12),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(20),
    gap: scale(4),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4
      },
      android: {
        elevation: 4
      }
    })
  },
  tagText: {
    color: "#FFF",
    fontSize: scale(11),
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  dateBadge: {
    position: "absolute",
    top: scale(12),
    right: scale(12),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(16),
    gap: scale(4),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 2
      }
    })
  },
  dateText: {
    color: "#666",
    fontSize: scale(10),
    fontWeight: "600"
  },
  cardContent: {
    padding: scale(20)
  },
  newsTitle: {
    fontSize: scale(20),
    fontWeight: "700",
    color: "#222",
    marginBottom: scale(10),
    lineHeight: scale(26)
  },
  newsDescription: {
    fontSize: scale(14),
    color: "#666",
    lineHeight: scale(22),
    marginBottom: scale(16)
  },
  readMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  readMoreText: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#E0B820"
  },
  arrowCircle: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: "#FFF5E5",
    justifyContent: "center",
    alignItems: "center"
  },
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginHorizontal: scale(20),
    marginTop: scale(8),
    paddingVertical: scale(16),
    borderRadius: scale(16),
    gap: scale(8),
    borderWidth: 2,
    borderColor: "#E0B820",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4
      },
      android: {
        elevation: 3
      }
    })
  },
  loadMoreText: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#E0B820"
  }
});