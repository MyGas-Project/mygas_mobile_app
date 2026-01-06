import { StyleSheet, Text, View, ScrollView, Dimensions, Platform } from 'react-native'
import React, { useContext } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navbar from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'

const { width, height } = Dimensions.get('window')

// Responsive breakpoints
const isSmallDevice = width < 375
const isTablet = width >= 768
const isLargeScreen = width >= 1024

export default function TermsCondition({ navigation }) {
    const { userInfo } = useContext(AuthContext)

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            {userInfo && <Navbar />}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >

                {/* Gradient Header */}
                <LinearGradient
                    colors={['#8B2C2E', '#C84B3A', '#E8895E']}
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.headerContent}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.iconEmoji}>📋</Text>
                        </View>
                        <Text style={styles.headerTitle}>Terms & Conditions</Text>
                        <Text style={styles.headerSubtitle}>My Gas Petroleum Corporation</Text>
                        <View style={styles.dividerLine} />
                        <Text style={styles.lastUpdated}>Last Updated: October 1, 2025</Text>
                    </View>
                </LinearGradient>

                {/* Welcome Badge */}
                <View style={styles.welcomeBadge}>
                    <View style={styles.badgeIcon}>
                        <Text style={styles.badgeIconText}>👋</Text>
                    </View>
                    <Text style={styles.badgeText}>
                        Welcome to My Gas Petroleum Corporation's website and/or mobile application. By accessing
                        or using our services, you agree to be bound by these Terms and Conditions.
                    </Text>
                </View>

                {/* Content Sections */}
                <View style={styles.contentWrapper}>
                    <Section
                        number="1"
                        title="Acceptance of Terms"
                        gradient={['#8B2C2E', '#C84B3A']}
                    >
                        <Text style={styles.sectionText}>
                            By accessing this website and/or mobile application, you confirm that you have read,
                            understood, and agreed to be bound by these Terms and Conditions, including any
                            additional terms and policies referenced herein.
                        </Text>
                    </Section>

                    <Section
                        number="2"
                        title="Website and Mobile Application Usage"
                        gradient={['#C84B3A', '#E8895E']}
                    >
                        <BulletItem text="You must be at least 18 years old or have parental/guardian supervision to use this website and/or mobile application." />
                        <BulletItem text="You agree not to use the website and/or mobile application for any unlawful purpose or any purpose prohibited under these Terms." />
                        <BulletItem text="You agree not to attempt to interfere with the website and/or mobile application's proper functioning or attempt to breach security." />
                    </Section>

                    <Section
                        number="3"
                        title="Services and Content"
                        gradient={['#8B2C2E', '#C84B3A']}
                    >
                        <Text style={styles.sectionText}>
                            My Gas Petroleum Corporation provides information about our products, fuel prices,
                            promotions, station locations, and services through this website and/or mobile application.
                            All content is for informational purposes only and may be subject to change without notice.
                        </Text>
                        <Text style={styles.sectionText}>
                            We do not guarantee the accuracy, completeness, or reliability of any information on the
                            site. Prices and services may vary per branch or location.
                        </Text>
                    </Section>

                    <Section
                        number="4"
                        title="Intellectual Property"
                        gradient={['#C84B3A', '#E8895E']}
                    >
                        <Text style={styles.sectionText}>
                            All content, trademarks, logos, graphics, and other materials found on this website and/or
                            mobile application are the property of My Gas Petroleum Corporation and protected under
                            applicable copyright and trademark laws in the Philippines. You may not reproduce, distribute,
                            or modify any content without our prior written permission.
                        </Text>
                    </Section>

                    <Section
                        number="5"
                        title="User Submissions"
                        gradient={['#8B2C2E', '#C84B3A']}
                    >
                        <Text style={styles.sectionText}>
                            If you submit any feedback, suggestions, or inquiries via our contact form or email, you
                            agree that we may use this information to improve our services. We are under no obligation
                            to keep such information confidential or to compensate you for its use.
                        </Text>
                    </Section>

                    <Section
                        number="6"
                        title="Third-Party Links"
                        gradient={['#C84B3A', '#E8895E']}
                    >
                        <Text style={styles.sectionText}>
                            Our website and/or mobile application may contain links to third-party websites or services
                            that are not owned or controlled by My Gas Petroleum Corporation. We are not responsible for
                            the content, privacy policies, or practices of any third-party sites.
                        </Text>
                    </Section>

                    <Section
                        number="7"
                        title="Limitation of Liability"
                        gradient={['#8B2C2E', '#C84B3A']}
                    >
                        <Text style={styles.sectionText}>
                            To the maximum extent permitted by law, My Gas Petroleum Corporation shall not be liable
                            for any direct, indirect, incidental, or consequential damages resulting from the use or
                            inability to use the website and/or mobile application.
                        </Text>
                    </Section>

                    <Section
                        number="8"
                        title="Privacy"
                        gradient={['#C84B3A', '#E8895E']}
                    >
                        <Text style={styles.sectionText}>
                            We respect your privacy. Please refer to our Privacy Policy for information on how we
                            collect, use, and protect your personal data.
                        </Text>
                    </Section>

                    <Section
                        number="9"
                        title="Governing Law"
                        gradient={['#8B2C2E', '#C84B3A']}
                    >
                        <Text style={styles.sectionText}>
                            These Terms shall be governed by and construed in accordance with the laws of the Republic
                            of the Philippines. Any disputes arising under these Terms shall be subject to the exclusive
                            jurisdiction of the courts in Davao City, Philippines.
                        </Text>
                    </Section>

                    <Section
                        number="10"
                        title="Changes to Terms"
                        gradient={['#C84B3A', '#E8895E']}
                    >
                        <Text style={styles.sectionText}>
                            We reserve the right to update or modify these Terms and Conditions at any time without
                            prior notice. Your continued use of the website and/or mobile application after changes
                            are posted constitutes your acceptance of the revised terms.
                        </Text>
                    </Section>

                    <Section
                        number="11"
                        title="Contact Us"
                        gradient={['#8B2C2E', '#C84B3A']}
                    >
                        <Text style={styles.sectionText}>
                            For any questions regarding these Terms and Conditions, you may contact us at:
                        </Text>
                        <ContactCard
                            email="mygasmotorista@gmail.com"
                            phone="09199127793"
                            address="Purok 1-B, Lower Dampa, Barangay Magtuod, Talomo District, Davao City, 8000 Davao del Sur"
                        />
                    </Section>
                </View>

                {/* Footer Card */}
                <LinearGradient
                    colors={['#8B2C2E', '#C84B3A', '#E8895E']}
                    style={styles.footerCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.footerIconWrapper}>
                        <Text style={styles.footerIcon}>✓</Text>
                    </View>
                    <Text style={styles.footerTitle}>Agreement Confirmation</Text>
                    <Text style={styles.footerText}>
                        By using this application, you signify your acceptance of these Terms and Conditions.
                        Thank you for choosing My Gas Petroleum Corporation!
                    </Text>
                </LinearGradient>
            </ScrollView>
        </SafeAreaView>
    )
}

// Section Component
const Section = ({ number, title, gradient, children }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <LinearGradient
                colors={gradient}
                style={styles.numberBadge}
            >
                <Text style={styles.numberText}>{number}</Text>
            </LinearGradient>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionContent}>
            {children}
        </View>
    </View>
)

// BulletItem Component
const BulletItem = ({ text }) => (
    <View style={styles.bulletItem}>
        <View style={styles.bulletDot} />
        <Text style={styles.bulletText}>{text}</Text>
    </View>
)

// ContactCard Component
const ContactCard = ({ email, phone, address }) => (
    <View style={styles.contactCard}>
        <LinearGradient
            colors={['#FFFFFF', '#F8F9FC']}
            style={styles.contactGradient}
        >
            {email && (
                <View style={styles.contactRow}>
                    <View style={styles.contactIcon}>
                        <Text style={styles.contactIconText}>✉️</Text>
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Email</Text>
                        <Text style={styles.contactValue}>{email}</Text>
                    </View>
                </View>
            )}
            {phone && (
                <View style={[styles.contactRow, styles.contactRowBorder]}>
                    <View style={styles.contactIcon}>
                        <Text style={styles.contactIconText}>📱</Text>
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Phone</Text>
                        <Text style={styles.contactValue}>{phone}</Text>
                    </View>
                </View>
            )}
            {address && (
                <View style={[styles.contactRow, styles.contactRowBorder]}>
                    <View style={styles.contactIcon}>
                        <Text style={styles.contactIconText}>📍</Text>
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Address</Text>
                        <Text style={styles.contactValue}>{address}</Text>
                    </View>
                </View>
            )}
        </LinearGradient>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 32,
        paddingHorizontal: isSmallDevice ? 20 : 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#8B2C2E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    headerContent: {
        alignItems: 'center',
    },
    iconContainer: {
        width: isSmallDevice ? 64 : 72,
        height: isSmallDevice ? 64 : 72,
        borderRadius: isSmallDevice ? 32 : 36,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    iconEmoji: {
        fontSize: isSmallDevice ? 32 : 36,
    },
    headerTitle: {
        fontSize: isSmallDevice ? 28 : 32,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 0.5,
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    headerSubtitle: {
        fontSize: isSmallDevice ? 14 : 16,
        fontWeight: '600',
        color: '#FFFFFF',
        opacity: 0.95,
        marginBottom: 12,
    },
    dividerLine: {
        width: 60,
        height: 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        marginBottom: 12,
        opacity: 0.9,
    },
    lastUpdated: {
        fontSize: 13,
        color: '#FFFFFF',
        opacity: 0.85,
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 32,
    },
    welcomeBadge: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        marginHorizontal: isSmallDevice ? 16 : 20,
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#8B2C2E',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    badgeIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF3E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    badgeIconText: {
        fontSize: 20,
    },
    badgeText: {
        flex: 1,
        fontSize: 13,
        color: '#4A5568',
        lineHeight: 20,
        fontWeight: '500',
    },
    contentWrapper: {
        paddingHorizontal: isSmallDevice ? 16 : 20,
        paddingTop: 16,
    },
    section: {
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: isSmallDevice ? 16 : 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    numberBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        shadowColor: '#8B2C2E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    numberText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    sectionTitle: {
        flex: 1,
        fontSize: isSmallDevice ? 17 : 18,
        fontWeight: '700',
        color: '#1A1D29',
        letterSpacing: -0.2,
        lineHeight: 24,
    },
    sectionContent: {
        paddingLeft: 4,
    },
    sectionText: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 24,
        marginBottom: 12,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#8B2C2E',
        marginTop: 9,
        marginRight: 12,
    },
    bulletText: {
        flex: 1,
        fontSize: 15,
        color: '#475569',
        lineHeight: 24,
    },
    contactCard: {
        marginTop: 12,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    contactGradient: {
        padding: 16,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 8,
    },
    contactRowBorder: {
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
        marginTop: 12,
        paddingTop: 16,
    },
    contactIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F8F9FC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contactIconText: {
        fontSize: 20,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    contactValue: {
        fontSize: 15,
        color: '#1A1D29',
        fontWeight: '600',
        lineHeight: 22,
    },
    footerCard: {
        marginHorizontal: isSmallDevice ? 16 : 20,
        marginTop: 24,
        padding: isSmallDevice ? 24 : 32,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#8B2C2E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    footerIconWrapper: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    footerIcon: {
        fontSize: 40,
        color: '#FFFFFF',
        fontWeight: '900',
    },
    footerTitle: {
        fontSize: isSmallDevice ? 20 : 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    footerText: {
        fontSize: 15,
        color: '#FFFFFF',
        lineHeight: 24,
        textAlign: 'center',
        opacity: 0.95,
        paddingHorizontal: 8,
    },
})