import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function RewardDetails({ navigation, route}) {
  const { styles, currentTheme } = useTheme();
  const { details } = route.params;

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
      number: "3",
      title: "Usage",
      des: "This offer cannot be combined with other promotions and is valid for one-time use only.",
    },
  ];

  return (
    <SafeAreaView style={customStyles.safeArea}>
      <View style={customStyles.container}>
        {/* Header with Back Button */}
        <View style={customStyles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={customStyles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={customStyles.headerTitle}>Reward Detail</Text>
          <View style={customStyles.placeholder} />
        </View>

        <ScrollView
          style={customStyles.scrollView}
          contentContainerStyle={customStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Reward Image */}
          <View style={customStyles.imageContainer}>
            <Image
              source={require("../../../assets/image.png")}
              style={customStyles.rewardImage}
            />
          </View>

          {/* Reward Title */}
          <Text style={customStyles.rewardTitle}>
            {details?.name || "N/A"}
          </Text>

          {/* Points and Validity Section */}
          <View style={customStyles.infoSection}>
            <View style={customStyles.infoRow}>
              <Text style={customStyles.infoLabel}>Redeem for</Text>
              <Text style={customStyles.infoLabel}>Validity</Text>
            </View>

            <View style={customStyles.infoValueRow}>
              <View style={customStyles.pointsContainer}>
                <Image
                  source={require("../../../assets/mygas_logo.png")}
                  style={customStyles.mygasLogo}
                />
                <Text style={customStyles.pointsText}>{details?.points || 0} points</Text>
              </View>
              <Text style={customStyles.validityText}>7 days upon redemption.</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={customStyles.description}>
            {details?.description || "N/A"}
          </Text>

          {/* Divider */}
          <View style={customStyles.divider} />

          {/* Terms and Conditions */}
          <Text style={customStyles.termsTitle}>Terms and Conditions</Text>

          {terms.map((term, index) => (
            <View key={index} style={customStyles.termItem}>
              <Text style={customStyles.termNumber}>{term.number}.</Text>
              <Text style={customStyles.termTitle}>{term.title}:</Text>
              <Text style={customStyles.termDescription}>{term.des}</Text>
            </View>
          ))}

          <Text style={customStyles.agreementText}>
            By redeeming this offer, you agree to the terms and conditions
            outlined above.
          </Text>

          {/* Redeem Button */}
          <TouchableOpacity
            style={customStyles.redeemButton}
            onPress={() => console.log("Redeem pressed")}
          >
            <Text style={customStyles.redeemButtonText}>Redeem Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const customStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  placeholder: {
    width: 40, // Same width as back button for centering
  },
  scrollView: {
    flex: 1,
    marginBottom: 35
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  imageContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  rewardImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  infoSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mygasLogo: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  validityText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: 'black',
    textAlign: 'justify',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
    marginVertical: 20,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  termItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  termNumber: {
    width: 20,
    fontSize: 12,
    color: 'black',
  },
  termTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 6,
  },
  termDescription: {
    flex: 1,
    fontSize: 11,
    color: 'black',
    lineHeight: 16,
  },
  agreementText: {
    fontSize: 12,
    color: 'black',
    textAlign: 'justify',
    lineHeight: 18,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  redeemButton: {
    backgroundColor: '#FE0002',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redeemButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});