import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function GuestRewardsComponent() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Locked Rewards Preview */}
      <View style={styles.rewardsPreview}>
        {/* First blurred reward card */}
        <View style={[styles.previewCard, styles.card1]}>
          <View style={styles.blurOverlay}>
            <Ionicons name="gift" size={40} color="#E0B820" />
          </View>
        </View>

        {/* Second blurred reward card */}
        <View style={[styles.previewCard, styles.card2]}>
          <View style={styles.blurOverlay}>
            <Ionicons name="ticket" size={40} color="#4ECDC4" />
          </View>
        </View>

        {/* Third blurred reward card */}
        <View style={[styles.previewCard, styles.card3]}>
          <View style={styles.blurOverlay}>
            <Ionicons name="star" size={40} color="#FF6B6B" />
          </View>
        </View>

        {/* Lock Icon Overlay */}
        <View style={styles.lockContainer}>
          <View style={styles.lockCircle}>
            <Ionicons name="lock-closed" size={32} color="#FFF" />
          </View>
        </View>
      </View>

      {/* Call to Action Card */}
      <View style={styles.ctaCard}>
        <LinearGradient
          colors={['#FFD93D', '#E0B820']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaGradient}
        >
          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <View style={styles.ctaContent}>
            <View style={styles.iconBadge}>
              <Ionicons name="card-outline" size={28} color="#E0B820" />
            </View>

            <Text style={styles.ctaTitle}>Unlock Exclusive Rewards!</Text>
            <Text style={styles.ctaDescription}>
              Activate your MyGas card to access amazing discounts, special offers, and earn points with every purchase.
            </Text>

            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.benefitText}>Earn points on every visit</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.benefitText}>Exclusive member discounts</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.benefitText}>Special birthday rewards</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.activateButton}
              activeOpacity={0.8}
              onPress={() => {
                // Navigate to card activation screen
                // navigation.navigate('CardActivation');
                console.log('Navigate to card activation');
              }}
            >
              <Text style={styles.activateButtonText}>Activate Card Now</Text>
              <Ionicons name="arrow-forward" size={20} color="#E0B820" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.learnMoreButton}
              activeOpacity={0.7}
              onPress={() => {
                // Navigate to learn more about rewards
                console.log('Learn more about rewards');
              }}
            >
              <Text style={styles.learnMoreText}>Learn More About Rewards</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Quick Stats Preview */}
      <View style={styles.statsPreview}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statLabel}>Active Rewards</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1000+</Text>
          <Text style={styles.statLabel}>Happy Members</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24/7</Text>
          <Text style={styles.statLabel}>Support</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  rewardsPreview: {
    height: 160,
    marginBottom: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  previewCard: {
    position: 'absolute',
    width: 200,
    height: 140,
    backgroundColor: '#FFF',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  card1: {
    transform: [{ rotate: '-8deg' }, { translateX: -40 }],
    zIndex: 1
  },
  card2: {
    transform: [{ rotate: '0deg' }],
    zIndex: 2
  },
  card3: {
    transform: [{ rotate: '8deg' }, { translateX: 40 }],
    zIndex: 1
  },
  blurOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6
  },
  lockContainer: {
    position: 'absolute',
    zIndex: 3
  },
  lockCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0B820',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#E0B820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    borderWidth: 4,
    borderColor: '#FFF'
  },
  ctaCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#E0B820',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12
  },
  ctaGradient: {
    padding: 24,
    position: 'relative',
    overflow: 'hidden'
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  ctaContent: {
    position: 'relative',
    zIndex: 1
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8
  },
  ctaDescription: {
    fontSize: 14,
    color: '#FFF',
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.95
  },
  benefitsList: {
    marginBottom: 24
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  benefitText: {
    fontSize: 14,
    color: '#FFF',
    marginLeft: 10,
    fontWeight: '500'
  },
  activateButton: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  activateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E0B820',
    marginRight: 8
  },
  learnMoreButton: {
    paddingVertical: 12,
    alignItems: 'center'
  },
  learnMoreText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    textDecorationLine: 'underline'
  },
  statsPreview: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E0B820',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0'
  }
});