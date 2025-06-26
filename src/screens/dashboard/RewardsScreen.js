import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Navbar from "../../components/Navbar";

import { Ionicons } from "@expo/vector-icons";

const rewardsData = [
  {
    id: "1",
    title: "10% off on MyGas Lubes and Oil",
    image: require("../../../assets/image.png"),
    buttonText: "Redeem Now",
  },
  {
    id: "2",
    title: "Free Accident Insurance",
    image: require("../../../assets/image.png"),
    buttonText: "Redeem Now",
  },
];

const offersData = [
  {
    id: "3",
    title: "Free Fuel",
    image: require("../../../assets/image.png"),
    points: 2000,
  },
  {
    id: "4",
    title: "Snack/Beverage Discount",
    image: require("../../../assets/image.png"),
    points: 500,
  },
  {
    id: "5",
    title: "Free Fuel",
    image: require("../../../assets/image.png"),
    points: 2000,
  },
  {
    id: "6",
    title: "Snack/Beverage Discount",
    image: require("../../../assets/image.png"),
    points: 500,
  },
];

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function RewardsScreen() {
  const navigation = useNavigation();
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
        <Image
          source={require("../../../assets/mygas_logo.png")}
          style={styles.logo}
        />
        <Navbar
          onProfilePress={() => console.log("Profile tapped")}
          onNotifPress={() => console.log("Notifications tapped")}
        />
      </ImageBackground>

      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ translateY: cardContainerTranslateY }],
          },
        ]}
      >
        <AnimatedScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Rewards</Text>
            <Text style={styles.subtitle}>
              Fuel Your Savings: Earn Points, Unlock Perks, and Enjoy Exclusive
              Rewards with Every Visit!
            </Text>
          </View>

          <View style={styles.pointsBox}>
            <Text style={styles.pointsLabel}>Total MyGas Points</Text>
            <View style={styles.pointsRow}>
              <Image
                source={require("../../../assets/my.png")}
                style={styles.mygasIcon}
              />
              <Text style={styles.pointsValue}>1,234.05</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            MyGas Motorista Card Member Benefits
          </Text>
          <FlatList
            data={rewardsData}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cardList}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.content}>
                  <Text style={styles.cardText} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <TouchableOpacity
                    style={styles.redeemBtn}
                    onPress={() => navigation.navigate("RewardDetails")}
                  >
                    <Text style={styles.redeemText}>{item.buttonText}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <View style={styles.rewardsRow}>
            <Text style={styles.sectionTitle}>Rewards</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All Rewards ›</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={offersData}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.gridList}
            columnWrapperStyle={styles.gridRow}
            renderItem={({ item }) => (
              <View style={styles.rewardCardNew}>
                <Image source={item.image} style={styles.cardImageNew} />
                <View style={styles.contentNew}>
                  <View style={styles.titlePointsRowNew}>
                    <Text style={styles.cardTextNew} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <View style={styles.pointsRowNew}>
                      <Image
                        source={require("../../../assets/my.png")}
                        style={styles.miniIconNew}
                      />
                      <Text style={styles.cardPointsNew}>
                        {item.points} PTS
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.redeemBtnNew}>
                    <Text style={styles.redeemTextNew}>Redeem Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </AnimatedScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  top_bar: {
    height: 150,
    width: "100%",
    position: "relative",
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingBottom: 20,
    flexGrow: 1,
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
  headerContainer: {
    alignItems: "center",
    width: "100%",
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: "#777",
    marginBottom: 20,
  },
  pointsBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 6,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: Dimensions.get("window").width - 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  pointsLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  mygasIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    marginRight: 4,
  },
  pointsValue: {
    color: "#f39c12",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  cardList: {
    paddingBottom: 10,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: Dimensions.get("window").width - 32,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  cardText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 16,
  },
  cardPoints: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#f39c12",
    marginLeft: 4,
  },
  miniIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  redeemBtn: {
    backgroundColor: "#FF0000",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  redeemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rewardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  viewAll: {
    color: "#666",
    fontSize: 13,
  },
  gridList: {
    paddingVertical: 20,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  rewardCardNew: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "48%",
    overflow: "hidden",
    marginBottom: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardImageNew: {
    width: "100%",
    height: 110,
    resizeMode: "cover",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contentNew: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  titlePointsRowNew: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTextNew: {
    fontSize: 15,
    color: "#222",
    fontWeight: "600",
    flex: 1,
    marginRight: 6,
  },
  pointsRowNew: {
    flexDirection: "row",
    alignItems: "center",
  },
  miniIconNew: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    marginRight: 2,
  },
  cardPointsNew: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#f39c12",
  },
  redeemBtnNew: {
    backgroundColor: "#FF0000",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    width: "100%",
  },
  redeemTextNew: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.2,
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
});