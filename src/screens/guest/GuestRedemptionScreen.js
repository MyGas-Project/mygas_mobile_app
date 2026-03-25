import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../../components/Navbar';

const { width, height } = Dimensions.get('window');

// Enhanced responsive breakpoints
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768 && width < 1024;
const isLargeTablet = width >= 1024;

// Responsive helper functions
const getResponsiveValue = (small, medium, tablet, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  if (isTablet) return tablet;
  return large;
};

export default function GuestRedemptionScreen({ navigation }) {
  const handleActivateCard = () => {
    // // Navigate to card activation or registration screen
    // navigation.navigate('CardActivation'); // Adjust to your actual route name
  };

  const handleLearnMore = () => {
    // // Navigate to info/FAQ screen about rewards
    // navigation.navigate('RewardsInfo'); // Adjust to your actual route name
  };

  const benefits = [
    {
      icon: 'gift',
      title: 'Exclusive Rewards',
      description: 'Access hundreds of exciting products and rewards',
      color: '#EF4444',
    },
    {
      icon: 'flash',
      title: 'Special Promos',
      description: 'Get exclusive discounts on weekly promotional items',
      color: '#F59E0B',
    },
    {
      icon: 'star',
      title: 'Earn Points',
      description: 'Collect points with every purchase and fuel transaction',
      color: '#8B5CF6',
    },
    {
      icon: 'trophy',
      title: 'VIP Status',
      description: 'Unlock special perks and priority access to new products',
      color: '#10B981',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      {/* <ImageBackground
        resizeMode="stretch"
        source={require('../../../assets/mygas-header.jpeg')}
        style={styles.header}
      >
        <LinearGradient
          colors={['rgba(249, 250, 141, 0.95)', 'rgba(249, 250, 141, 0.7)', 'transparent']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.headerGradient}
        />

        <Image
          source={require('../../../assets/mygas_logo.png')}
          style={styles.logo}
        />
        <View style={{ position: 'absolute', right: 0, top: 0 }}>
          <Navbar hideBack />
        </View>
      </ImageBackground> */}

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <LinearGradient
              colors={['#FEF3C7', '#FDE68A', '#FCD34D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroIconContainer}>
                <View style={styles.heroIconCircle}>
                  <Ionicons name="lock-closed" size={getResponsiveValue(40, 48, 56, 64)} color="#F59E0B" />
                </View>
              </View>

              <Text style={styles.heroTitle}>Activate Your Card</Text>
              <Text style={styles.heroSubtitle}>
                Unlock amazing rewards and start redeeming points today!
              </Text>

              <TouchableOpacity
                style={styles.activateButton}
                activeOpacity={0.8}
                onPress={handleActivateCard}
              >
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.activateGradient}
                >
                  <Ionicons name="card" size={24} color="#fff" />
                  <Text style={styles.activateButtonText}>Activate My Card</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Info Alert */}
          <View style={styles.infoAlert}>
            <LinearGradient
              colors={['#DBEAFE', '#BFDBFE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.infoGradient}
            >
              <Ionicons name="information-circle" size={20} color="#1E40AF" />
              <Text style={styles.infoText}>
                Card activation is required to access the redemption system and claim your rewards
              </Text>
            </LinearGradient>
          </View>

          {/* Benefits Section */}
          <View style={styles.benefitsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Why Activate?</Text>
              <Text style={styles.sectionSubtitle}>
                Discover the benefits of being an activated member
              </Text>
            </View>

            <View style={styles.benefitsGrid}>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitCard}>
                  <LinearGradient
                    colors={['#ffffff', '#F9FAFB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.benefitGradient}
                  >
                    <View style={[styles.benefitIconContainer, { backgroundColor: `${benefit.color}15` }]}>
                      <Ionicons name={benefit.icon} size={getResponsiveValue(28, 32, 36, 40)} color={benefit.color} />
                    </View>
                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                    <Text style={styles.benefitDescription}>{benefit.description}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>

          {/* How It Works Section */}
          <View style={styles.howItWorksSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>How It Works</Text>
              <Text style={styles.sectionSubtitle}>
                Get started in just a few simple steps
              </Text>
            </View>

            <View style={styles.stepsContainer}>
              {[
                {
                  step: '1',
                  title: 'Activate Your Card',
                  description: 'Register your MyGas loyalty card with your account',
                  icon: 'card-outline',
                },
                {
                  step: '2',
                  title: 'Earn Points',
                  description: 'Collect points with every purchase and transaction',
                  icon: 'wallet-outline',
                },
                {
                  step: '3',
                  title: 'Redeem Rewards',
                  description: 'Browse and claim exciting rewards from our catalog',
                  icon: 'gift-outline',
                },
              ].map((item, index) => (
                <View key={index} style={styles.stepCard}>
                  <View style={styles.stepIconContainer}>
                    <LinearGradient
                      colors={['#FEE2E2', '#FEF2F2']}
                      style={styles.stepIconGradient}
                    >
                      <Ionicons name={item.icon} size={32} color="#EF4444" />
                    </LinearGradient>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{item.step}</Text>
                    </View>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{item.title}</Text>
                    <Text style={styles.stepDescription}>{item.description}</Text>
                  </View>
                  {index < 2 && <View style={styles.stepConnector} />}
                </View>
              ))}
            </View>
          </View>

          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <LinearGradient
              colors={['#FEE2E2', '#FEF2F2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <View style={styles.ctaIconContainer}>
                <Ionicons name="rocket" size={48} color="#EF4444" />
              </View>
              <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
              <Text style={styles.ctaDescription}>
                Activate your card now and start enjoying exclusive rewards and benefits
              </Text>

              <View style={styles.ctaButtons}>
                <TouchableOpacity
                  style={styles.ctaPrimaryButton}
                  activeOpacity={0.8}
                  onPress={handleActivateCard}
                >
                  <LinearGradient
                    colors={['#EF4444', '#DC2626']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.ctaPrimaryGradient}
                  >
                    <Text style={styles.ctaPrimaryText}>Activate Now</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.ctaSecondaryButton}
                  activeOpacity={0.8}
                  onPress={handleLearnMore}
                >
                  <Text style={styles.ctaSecondaryText}>Learn More</Text>
                  <Ionicons name="arrow-forward" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>


        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    height: getResponsiveValue(140, 160, 190, 210),
    width: '100%',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  logo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: getResponsiveValue(-35, -45, -55, -65) },
      { translateY: getResponsiveValue(-35, -45, -55, -65) },
    ],
    width: getResponsiveValue(65, 75, 90, 110),
    height: getResponsiveValue(65, 75, 90, 110),
    resizeMode: 'contain',
    zIndex: 2,
  },
  scrollContainer: {
    flex: 1,
    marginTop: -25,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: getResponsiveValue(40, 50, 60, 70),
  },
  contentContainer: {
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: getResponsiveValue(24, 28, 32, 36),
    borderTopRightRadius: getResponsiveValue(24, 28, 32, 36),
    paddingHorizontal: getResponsiveValue(16, 20, 28, 36),
    paddingTop: getResponsiveValue(24, 28, 32, 36),
  },
  heroSection: {
    marginBottom: getResponsiveValue(20, 24, 28, 32),
    borderRadius: getResponsiveValue(20, 24, 28, 32),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroGradient: {
    padding: getResponsiveValue(20, 22, 24, 28),
    alignItems: 'center',
  },
  heroIconContainer: {
    marginBottom: getResponsiveValue(12, 14, 16, 18),
  },
  heroIconCircle: {
    width: getResponsiveValue(70, 75, 85, 95),
    height: getResponsiveValue(70, 75, 85, 95),
    borderRadius: getResponsiveValue(35, 37.5, 42.5, 47.5),
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  heroTitle: {
    fontSize: getResponsiveValue(22, 24, 26, 28),
    fontWeight: '800',
    color: '#92400E',
    textAlign: 'center',
    marginBottom: getResponsiveValue(6, 8, 10, 12),
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: '#78350F',
    textAlign: 'center',
    marginBottom: getResponsiveValue(18, 20, 22, 24),
    lineHeight: getResponsiveValue(18, 20, 22, 24),
    paddingHorizontal: getResponsiveValue(20, 30, 40, 50),
  },
  activateButton: {
    width: '100%',
    borderRadius: getResponsiveValue(14, 16, 18, 20),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  activateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveValue(16, 18, 20, 22),
    paddingHorizontal: getResponsiveValue(24, 28, 32, 36),
    gap: getResponsiveValue(10, 12, 14, 16),
  },
  activateButtonText: {
    fontSize: getResponsiveValue(16, 18, 20, 22),
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  infoAlert: {
    marginBottom: getResponsiveValue(20, 24, 28, 32),
    borderRadius: getResponsiveValue(12, 14, 16, 18),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#1E40AF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getResponsiveValue(16, 18, 20, 22),
    paddingVertical: getResponsiveValue(14, 16, 18, 20),
    gap: getResponsiveValue(12, 14, 16, 18),
    borderLeftWidth: 4,
    borderLeftColor: '#1E40AF',
  },
  infoText: {
    flex: 1,
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: '#1E3A8A',
    fontWeight: '600',
    lineHeight: getResponsiveValue(18, 20, 22, 24),
  },
  benefitsSection: {
    marginBottom: getResponsiveValue(28, 32, 36, 40),
  },
  sectionHeader: {
    marginBottom: getResponsiveValue(20, 24, 28, 32),
  },
  sectionTitle: {
    fontSize: getResponsiveValue(22, 24, 26, 28),
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: '#6B7280',
    lineHeight: getResponsiveValue(18, 20, 22, 24),
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveValue(12, 16, 20, 24),
    justifyContent: 'space-between',
  },
  benefitCard: {
    width: isTablet || isLargeTablet ? '48%' : '100%',
    borderRadius: getResponsiveValue(16, 18, 20, 22),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  benefitGradient: {
    padding: getResponsiveValue(20, 24, 28, 32),
    alignItems: 'center',
  },
  benefitIconContainer: {
    width: getResponsiveValue(70, 80, 90, 100),
    height: getResponsiveValue(70, 80, 90, 100),
    borderRadius: getResponsiveValue(35, 40, 45, 50),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsiveValue(16, 18, 20, 22),
  },
  benefitTitle: {
    fontSize: getResponsiveValue(16, 17, 18, 19),
    fontWeight: '700',
    color: '#111827',
    marginBottom: getResponsiveValue(8, 10, 12, 14),
    textAlign: 'center',
  },
  benefitDescription: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: getResponsiveValue(18, 20, 22, 24),
  },
  howItWorksSection: {
    marginBottom: getResponsiveValue(28, 32, 36, 40),
  },
  stepsContainer: {
    gap: getResponsiveValue(0, 0, 0, 0),
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: getResponsiveValue(20, 24, 28, 32),
    borderRadius: getResponsiveValue(16, 18, 20, 22),
    marginBottom: getResponsiveValue(16, 20, 24, 28),
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  stepIconContainer: {
    position: 'relative',
    marginRight: getResponsiveValue(16, 18, 20, 22),
  },
  stepIconGradient: {
    width: getResponsiveValue(60, 68, 76, 84),
    height: getResponsiveValue(60, 68, 76, 84),
    borderRadius: getResponsiveValue(30, 34, 38, 42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: getResponsiveValue(28, 32, 36, 40),
    height: getResponsiveValue(28, 32, 36, 40),
    borderRadius: getResponsiveValue(14, 16, 18, 20),
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  stepNumberText: {
    fontSize: getResponsiveValue(14, 16, 18, 20),
    fontWeight: '800',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
    paddingTop: getResponsiveValue(4, 6, 8, 10),
  },
  stepTitle: {
    fontSize: getResponsiveValue(16, 17, 18, 19),
    fontWeight: '700',
    color: '#111827',
    marginBottom: getResponsiveValue(6, 8, 10, 12),
  },
  stepDescription: {
    fontSize: getResponsiveValue(13, 14, 15, 16),
    color: '#6B7280',
    lineHeight: getResponsiveValue(18, 20, 22, 24),
  },
  stepConnector: {
    position: 'absolute',
    left: getResponsiveValue(50, 58, 66, 74),
    top: getResponsiveValue(80, 92, 104, 116),
    width: 2,
    height: getResponsiveValue(16, 20, 24, 28),
    backgroundColor: '#FEE2E2',
  },
  ctaSection: {
    marginBottom: getResponsiveValue(28, 90, 36, 40),
    borderRadius: getResponsiveValue(20, 24, 28, 32),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  ctaGradient: {
    padding: getResponsiveValue(28, 32, 36, 40),
    alignItems: 'center',
  },
  ctaIconContainer: {
    width: getResponsiveValue(80, 90, 100, 110),
    height: getResponsiveValue(80, 90, 100, 110),
    borderRadius: getResponsiveValue(40, 45, 50, 55),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsiveValue(20, 24, 28, 32),
  },
  ctaTitle: {
    fontSize: getResponsiveValue(24, 26, 28, 30),
    fontWeight: '800',
    color: '#991B1B',
    textAlign: 'center',
    marginBottom: getResponsiveValue(8, 10, 12, 14),
    letterSpacing: -0.5,
  },
  ctaDescription: {
    fontSize: getResponsiveValue(14, 15, 16, 17),
    color: '#7F1D1D',
    textAlign: 'center',
    marginBottom: getResponsiveValue(24, 28, 32, 36),
    lineHeight: getResponsiveValue(20, 22, 24, 26),
    paddingHorizontal: getResponsiveValue(10, 20, 30, 40),
  },
  ctaButtons: {
    width: '100%',
    gap: getResponsiveValue(12, 14, 16, 18),
  },
  ctaPrimaryButton: {
    width: '100%',
    borderRadius: getResponsiveValue(14, 16, 18, 20),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  ctaPrimaryGradient: {
    paddingVertical: getResponsiveValue(16, 18, 20, 22),
    alignItems: 'center',
  },
  ctaPrimaryText: {
    fontSize: getResponsiveValue(16, 17, 18, 19),
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  ctaSecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveValue(14, 16, 18, 20),
    backgroundColor: '#fff',
    borderRadius: getResponsiveValue(14, 16, 18, 20),
    gap: 8,
  },
  ctaSecondaryText: {
    fontSize: getResponsiveValue(15, 16, 17, 18),
    fontWeight: '600',
    color: '#EF4444',
  },
  previewSection: {
    marginBottom: getResponsiveValue(20, 24, 28, 32),
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: getResponsiveValue(12, 16, 20, 24),
    justifyContent: 'space-between',
  },
  previewCard: {
    width: isTablet || isLargeTablet ? '23%' : '48%',
    backgroundColor: '#fff',
    borderRadius: getResponsiveValue(14, 16, 18, 20),
    overflow: 'hidden',
    opacity: 0.6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  previewImageContainer: {
    position: 'relative',
    width: '100%',
    height: getResponsiveValue(100, 120, 140, 160),
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContent: {
    padding: getResponsiveValue(10, 12, 14, 16),
    gap: 6,
  },
  previewTextBlur: {
    height: getResponsiveValue(12, 14, 16, 18),
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    width: '100%',
  },
  previewText: {
    fontSize: getResponsiveValue(10, 12, 14, 16),
    color: 'transparent',
  },
});