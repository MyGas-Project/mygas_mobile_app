import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
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

export default function RewardsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ImageBackground
        source={require("../../../assets/mygas-header.jpeg")}
        resizeMode="stretch"
        style={styles.headerImage}
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

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
          <Text style={styles.title}>Rewards</Text>
          <Text style={styles.subtitle}>
            Fuel Your Savings: Earn Points, Unlock Perks, and Enjoy Exclusive
            Rewards with Every Visit!
          </Text>

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
                <Text style={styles.cardText} numberOfLines={2}>
                  {item.title}
                </Text>
                <TouchableOpacity style={styles.redeemBtn}>
                  <Text style={styles.redeemText}>{item.buttonText}</Text>
                </TouchableOpacity>
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
              <View style={styles.rewardCard}>
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.titlePointsRow}>
                  <Text style={styles.cardText} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.pointsRow}>
                    <Image
                      source={require("../../../assets/my.png")}
                      style={styles.miniIcon}
                    />
                    <Text style={styles.cardPoints}>{item.points} PTS</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.redeemBtn}>
                  <Text style={styles.redeemText}>Redeem Now</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 180,
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backCircle: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 25,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  cardContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    marginTop: -30, // overlap the image
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  pointsBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    marginTop: 12,
  },
  cardList: {
    paddingBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 230,
    marginRight: 12,
    overflow: "hidden",
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  cardText: {
    paddingHorizontal: 10,
    paddingTop: 10,
    fontWeight: "600",
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
    backgroundColor: "red",
    paddingVertical: 8,
    margin: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  redeemText: {
    color: "white",
    fontWeight: "bold",
  },
  rewardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  viewAll: {
    color: "#666",
    fontSize: 13,
  },
  gridList: {
    paddingVertical: 5,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  rewardCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "48%",
    overflow: "hidden",
    elevation: 2,
  },
  titlePointsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 10,
    gap: 4,
  },
});
