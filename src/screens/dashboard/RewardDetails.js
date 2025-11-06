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
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Bottom tab bar height constants
const BOTTOM_TAB_HEIGHT = Platform.OS === 'ios' ? 85 : 70;

export default function RewardDetails({ navigation, route }) {
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
    <View style={customStyles.container}>
      {/* Custom Header with Gradient */}
      <LinearGradient
        colors={['#e74c3c', '#c0392b']}
        style={customStyles.headerGradient}
      >
        <SafeAreaView>
          <View style={customStyles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={customStyles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={customStyles.headerTitle}>Reward Details</Text>
            <TouchableOpacity style={customStyles.shareButton}>
              <Ionicons name="share-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={customStyles.scrollView}
        contentContainerStyle={customStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Card */}
        <View style={customStyles.imageCard}>
          <Image
            source={require("../../../assets/image.png")}
            style={customStyles.rewardImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={customStyles.imageOverlay}
          />
          <View style={customStyles.imageBadge}>
            <Ionicons name="time-outline" size={14} color="#fff" style={{ marginRight: 4 }} />
            <Text style={customStyles.imageBadgeText}>Limited Offer</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={customStyles.infoCard}>
          <View style={customStyles.infoCardContent}>
            <View style={customStyles.pointsSection}>
              <View style={customStyles.pointsIconContainer}>
                <Image
                  source={require("../../../assets/mygas_logo.png")}
                  style={customStyles.mygasLogo}
                />
              </View>
              <View>
                <Text style={customStyles.pointsLabel}>Redeem for</Text>
                <Text style={customStyles.pointsValue}>{details?.points || 0} Points</Text>
              </View>
            </View>

            <View style={customStyles.cardDivider} />

            <View style={customStyles.validitySection}>
              <View style={customStyles.validityIconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#e74c3c" />
              </View>
              <View>
                <Text style={customStyles.validityLabel}>Valid for</Text>
                <Text style={customStyles.validityValue}>7 Days</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={customStyles.contentSection}>
          {/* Reward Title */}
          <View style={customStyles.titleSection}>
            <Text style={customStyles.rewardTitle}>
              {details?.name || "Special Reward Offer"}
            </Text>
            <View style={customStyles.categoryBadge}>
              <Text style={customStyles.categoryText}>Popular</Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={customStyles.statsRow}>
            <View style={customStyles.statItem}>
              <Ionicons name="people-outline" size={18} color="#666" />
              <Text style={customStyles.statText}>1.2k redeemed</Text>
            </View>
            <View style={customStyles.statItem}>
              <Ionicons name="star" size={18} color="#f39c12" />
              <Text style={customStyles.statText}>4.8 rating</Text>
            </View>
          </View>

          {/* Description Card */}
          <View style={customStyles.descriptionCard}>
            <View style={customStyles.sectionHeader}>
              <Ionicons name="information-circle" size={20} color="#e74c3c" />
              <Text style={customStyles.sectionTitle}>About this reward</Text>
            </View>
            <Text style={customStyles.description}>
              {details?.description || "Enjoy exclusive benefits with this amazing reward. Perfect for loyal customers who want to maximize their points and get the best value."}
            </Text>
          </View>

          {/* How to Redeem */}
          <View style={customStyles.howToCard}>
            <View style={customStyles.sectionHeader}>
              <Ionicons name="gift-outline" size={20} color="#e74c3c" />
              <Text style={customStyles.sectionTitle}>How to Redeem</Text>
            </View>
            <View style={customStyles.stepsList}>
              <View style={customStyles.stepItem}>
                <View style={customStyles.stepNumber}>
                  <Text style={customStyles.stepNumberText}>1</Text>
                </View>
                <Text style={customStyles.stepText}>Tap "Redeem Now" button below</Text>
              </View>
              <View style={customStyles.stepItem}>
                <View style={customStyles.stepNumber}>
                  <Text style={customStyles.stepNumberText}>2</Text>
                </View>
                <Text style={customStyles.stepText}>Show QR code at checkout</Text>
              </View>
              <View style={customStyles.stepItem}>
                <View style={customStyles.stepNumber}>
                  <Text style={customStyles.stepNumberText}>3</Text>
                </View>
                <Text style={customStyles.stepText}>Enjoy your reward!</Text>
              </View>
            </View>
          </View>

          {/* Terms Section */}
          <View style={customStyles.termsCard}>
            <View style={customStyles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#e74c3c" />
              <Text style={customStyles.sectionTitle}>Terms & Conditions</Text>
            </View>

            {terms.map((term, index) => (
              <View key={index} style={customStyles.termItem}>
                <View style={customStyles.termBullet}>
                  <Text style={customStyles.termNumber}>{term.number}</Text>
                </View>
                <View style={customStyles.termContent}>
                  <Text style={customStyles.termTitle}>{term.title}</Text>
                  <Text style={customStyles.termDescription}>{term.des}</Text>
                </View>
              </View>
            ))}

            <View style={customStyles.agreementBox}>
              <Ionicons name="shield-checkmark" size={20} color="#27ae60" />
              <Text style={customStyles.agreementText}>
                By redeeming, you agree to all terms and conditions
              </Text>
            </View>
          </View>

          {/* Redeem Button - Now in scroll view */}
          <TouchableOpacity
            style={customStyles.redeemButton}
            onPress={() => console.log("Redeem pressed")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#e74c3c', '#c0392b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={customStyles.buttonGradient}
            >
              <Ionicons name="gift" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={customStyles.redeemButtonText}>Redeem Now</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Bottom Spacing for Bottom Nav */}
          <View style={{ height: BOTTOM_TAB_HEIGHT + 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const customStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Header
  headerGradient: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 25,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Image Card
  imageCard: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  rewardImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  imageBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 4,
  },
  imageBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Info Card
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  infoCardContent: {
    flexDirection: 'row',
    padding: 20,
  },
  pointsSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff5f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mygasLogo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  pointsLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#e74c3c',
  },
  cardDivider: {
    width: 1,
    backgroundColor: '#e8e8e8',
    marginHorizontal: 16,
  },
  validitySection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  validityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff5f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  validityLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  validityValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
  },

  // Content Section
  contentSection: {
    paddingHorizontal: 15,
  },

  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rewardTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: 0.3,
    lineHeight: 32,
  },
  categoryBadge: {
    backgroundColor: '#fff3e0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f39c12',
    textTransform: 'uppercase',
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginLeft: 6,
  },

  // Cards
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  howToCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  termsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
    color: '#555',
    fontWeight: '400',
  },

  // Steps
  stepsList: {
    marginTop: 4,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff5f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#e74c3c',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  // Terms
  termItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  termBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff5f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  termNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#e74c3c',
  },
  termContent: {
    flex: 1,
  },
  termTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  termDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    fontWeight: '400',
  },

  // Agreement Box
  agreementBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9f4',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c8e6d4',
  },
  agreementText: {
    fontSize: 13,
    color: '#27ae60',
    marginLeft: 10,
    flex: 1,
    fontWeight: '600',
  },

  // Redeem Button - Now inline with content
  redeemButton: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    marginTop: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  redeemButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});