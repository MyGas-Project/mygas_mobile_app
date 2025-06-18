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
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function RewardDetails() {
  const navigation = useNavigation();
  const { styles } = useTheme();

  const terms = [
    {
      number: "1",
      title: "Eligibility",
      des: "This reward is available to registered loyalty members who have accumulated enough points to redeem the offer.",
    },
    {
      number: "2",
      title: "Redemption",
      des: "Points must be redeemed before the expiry date indicated in the app.",
    },
    {
      number: "2",
      title: "Redemption",
      des: "Points must be redeemed before the expiry date indicated in the app.",
    },
  ];

  return (
    <ScrollView>
      <View style={styles.tabScreen}>
        <View
          style={{
            width: "100%",
            paddingTop: 45,
            paddingHorizontal: 16,
            paddingBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconBg}
            >
              <View style={custom_styles.iconBg}>
                <Ionicons name="arrow-back" size={20} color="white" />
              </View>
            </TouchableOpacity>
            <View
              style={{
                alignItems: "center",
                position: "absolute",
                left: 0,
                right: 0,
              }}
            >
              <Image
                source={require("../../assets/mygas_logo.png")}
                style={styles.mygas_logo}
              />
            </View>
          </View>
          <View
            style={{
              width: "100%",
              paddingTop: 45,
              alignItems: "center",
            }}
          >
            <Text style={[styles.text, styles.text_sm, styles.text_bold]}>
              Reward Detail
            </Text>
          </View>

          <View style={{ flex: 1, width: "100%", paddingTop: 10 }}>
            <Image
              source={require("../../assets/image.png")}
              style={custom_styles.imageReward}
            />
          </View>
          <View
            style={{
              width: "100%",
              paddingTop: 10,
            }}
          >
            <Text style={[styles.text, styles.text_bold, styles.text_sm]}>
              10% Off on MyGas Lubes and Oil Services
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 10,
            }}
          >
            <Text>Redeem for</Text>
            <Text>Validity</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={styles.row}>
              <Image
                source={require("../../assets/mygas_logo.png")}
                style={custom_styles.mygas_logo}
              />
              <Text style={styles.pointsText}>5,000 points</Text>
            </View>
            <Text style={[styles.warning]}>7 days upon redemption.</Text>
          </View>
          <View style={{ width: "100%", paddingTop: 10 }}>
            <Text
              style={{ textAlign: "justify", lineHeight: 20, fontSize: 15 }}
            >
              Keep your engine running smoothly and save while doing it! Redeem
              this reward for a 10% discount on all MyGas lubes and oil change
              services. Whether you need a routine oil change, synthetic oil, or
              additional lubrication services, this offer ensures your vehicle
              gets the best care at a lower cost.
            </Text>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#bdb9b9",
              width: "100%",
              marginVertical: 10,
            }}
          />
          <View style={{ paddingTop: 5, paddingBottom: 10 }}>
            <Text>Terms and Conditions</Text>
          </View>
          {terms.map((term, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                marginBottom: 8,
                alignItems: "flex-start",
              }}
            >
              <Text style={{ width: 20, fontSize: 12 }}>{term.number}.</Text>
              <Text
                style={{ fontWeight: "bold", marginRight: 6, fontSize: 12 }}
              >
                {term.title}:
              </Text>
              <Text style={{ flex: 1, fontSize: 11 }}>{term.des}</Text>
            </View>
          ))}

          <Text
            style={{
              flex: 1,
              fontSize: 12,
              textAlign: "justify",
              lineHeight: 18,
              paddingTop: 10
            }}
          >
            By redeeming this offer, you agree to the terms and conditions
            outlined above.
          </Text>

          <TouchableOpacity
            style={custom_styles.redeemButton}
            onPress={() => console.log("Redeem pressed")}
          >
            <Text style={custom_styles.redeemText}>Redeem Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const custom_styles = StyleSheet.create({
  iconBg: {
    backgroundColor: "#000",
    padding: 5,
    borderRadius: 30,
  },
  imageReward: {
    height: 200,
    width: "auto",
    resizeMode: "cover",
  },
  mygas_logo: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    marginRight: 4,
  },
  redeemButton: {
    backgroundColor: "#FE0002",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  redeemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});