import { StyleSheet, Text, View, ScrollView, Dimensions, Platform, TouchableOpacity } from 'react-native'
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

export default function PrivacyPolicy({ navigation }) {
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
                            <Text style={styles.iconEmoji}>🔒</Text>
                        </View>
                        <Text style={styles.headerTitle}>Privacy Policy</Text>
                        <Text style={styles.headerSubtitle}>My Gas Petroleum Corporation</Text>
                        <View style={styles.dividerLine} />
                        <Text style={styles.lastUpdated}>Last Updated: October 14, 2025</Text>
                    </View>
                </LinearGradient>

                {/* Compliance Badge */}
                <View style={styles.complianceBadge}>
                    <View style={styles.badgeIcon}>
                        <Text style={styles.badgeIconText}>✓</Text>
                    </View>
                    <Text style={styles.badgeText}>
                        In accordance with the Philippine Data Privacy Act of 2012 (RA 10173)
                    </Text>
                </View>

                {/* Introduction Section */}
                <View style={styles.introCard}>
                    <LinearGradient
                        colors={['#F8F9FC', '#FFFFFF']}
                        style={styles.introGradient}
                    >
                        <Text style={styles.introTitle}>Introduction</Text>
                        <Text style={styles.introText}>
                            This Privacy Policy outlines how My Gas Petroleum Corporation collects, uses, stores,
                            and protects your personal information in accordance with the Philippine Data Privacy Act
                            of 2012 (Republic Act No. 10173) and its Implementing Rules and Regulations.
                        </Text>
                    </LinearGradient>
                </View>

                {/* Content Sections */}
                <View style={styles.contentWrapper}>
                    <Section
                        number="1"
                        title="What Personal Information Do We Collect?"
                        gradient={['#8B2C2E', '#C84B3A']}
                    >
                        <BulletItem
                            label="Basic information:"
                            text="Full name, contact number, address, email address, date of birth, gender, and civil status."
                        />
                        <BulletItem
                            label="Account details:"
                            text="Username, password, and login information."
                        />
                        <BulletItem
                            label="Transaction details:"
                            text="Purchase history, point rewards, and payment information."
                        />
                        <BulletItem
                            label="Website and Mobile Application usage data:"
                            text="IP address, browsing history, cookie information."
                        />
                        <BulletItem
                            label="Sensitive personal information (if applicable):"
                            text="Medical records, financial details."
                        />
                    </Section>

                    <Section
                        number="2"
                        title="How We Collect Your Personal Information"
                        gradient={['#C84B3A', '#E8895E']}
                    >
                        <BulletItem text="When you register on our website or mobile application." />
                        <BulletItem text="When you contact our customer service." />
                        <BulletItem text="When you make a purchase or transaction." />
                        <BulletItem text="Through cookies and other tracking technologies on our website or mobile application." />
                    </Section>

                    <Section
                        number="3"
                        title="Purposes of Collecting Personal Information"
                        gradient={['#8B2C2E', '#C84B3A']}
                    >
                        <BulletItem text="To process your orders and transactions." />
                        <BulletItem text="To provide customer support." />
                        <BulletItem text="To personalize your experience on our website and mobile application." />
                        <BulletItem text="To send marketing communications and promotional offers." />
                        <BulletItem text="To improve our services, website, and mobile application functionality." />
                        <BulletItem text="To comply with legal and regulatory requirements." />
                    </Section>

                    <Section
                        number="4"
                        title="Sharing of Personal Information"
                        gradient={['#C84B3A', '#E8895E']}
                    >
                        <Text style={styles.sectionText}>
                            We may share your personal data with our trusted third-party service providers who assist
                            us in operating our business, such as payment gateways, shipping carriers, and marketing platforms.
                        </Text>
                        <Text style={styles.sectionText}>
                            We will only share your personal information with these third parties with appropriate
                            safeguards and only to the extent necessary to achieve the purposes outlined above.
                        </Text>
                    </Section>

                    <Section
                        number="5"
                        title="Your Privacy Rights"
                        gradient={['#8B2C2E', '#C84B3A']}
                    >
                        <BulletItem
                            label="Access:"
                            text="You have the right to access your personal information and request a copy."
                        />
                        <BulletItem
                            label="Rectification:"
                            text="You can request to correct any inaccurate or incomplete personal information."
                        />
                        <BulletItem
                            label="Erasure:"
                            text="You can request to delete your personal information, subject to certain legal exceptions."
                        />
                        <BulletItem
                            label="Objection:"
                            text="You can object to the processing of your personal information in certain circumstances."
                        />
                        <BulletItem
                            label="Restriction:"
                            text="You can request to restrict the processing of your personal information."
                        />
                    </Section>

                    <Section
                        number="6"
                        title="How to Exercise Your Rights"
                        gradient={['#C84B3A', '#E8895E']}
                    >
                        <Text style={styles.sectionText}>
                            To exercise your privacy rights, please contact us at:
                        </Text>
                        <ContactCard
                            email="mygasmotorista@gmail.com"
                            phone="09199127793"
                        />
                    </Section>

                    <Section
                        number="7"
                        title="Data Security"
                        gradient={['#8B2C2E', '#C84B3A']}
                    >
                        <Text style={styles.sectionText}>
                            We take appropriate technical and organizational measures to protect your personal
                            information from unauthorized access, use, disclosure, alteration, or destruction.
                        </Text>
                    </Section>

                    <Section
                        number="8"
                        title="Retention of Personal Data"
                        gradient={['#C84B3A', '#E8895E']}
                    >
                        <Text style={styles.sectionText}>
                            We will retain your personal information for as long as necessary to fulfill the purposes
                            for which it was collected, considering legal requirements and our business needs.
                        </Text>
                    </Section>

                    <Section
                        number="9"
                        title="Changes to This Privacy Policy"
                        gradient={['#8B2C2E', '#C84B3A']}
                    >
                        <Text style={styles.sectionText}>
                            We may update this Privacy Policy from time to time. We will notify you of any
                            significant changes through our website, mobile application, or other communication channels.
                        </Text>
                    </Section>

                    <Section
                        number="10"
                        title="Contact Information"
                        gradient={['#C84B3A', '#E8895E']}
                    >
                        <Text style={styles.sectionText}>
                            If you have any questions about this Privacy Policy, please contact us at:
                        </Text>
                        <ContactCard email="mygasmotorista@gmail.com" />
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
                        <Text style={styles.footerIcon}>🛡️</Text>
                    </View>
                    <Text style={styles.footerTitle}>Your Privacy Matters</Text>
                    <Text style={styles.footerText}>
                        My Gas Petroleum Corporation is committed to protecting your personal information
                        and complying with the Philippine Data Privacy Act of 2012.
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
const BulletItem = ({ label, text }) => (
    <View style={styles.bulletItem}>
        <View style={styles.bulletDot} />
        <Text style={styles.bulletText}>
            {label && <Text style={styles.bulletLabel}>{label} </Text>}
            {text}
        </Text>
    </View>
)

// ContactCard Component
const ContactCard = ({ email, phone }) => (
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
                <View style={[styles.contactRow, email && styles.contactRowBorder]}>
                    <View style={styles.contactIcon}>
                        <Text style={styles.contactIconText}>📱</Text>
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactLabel}>Phone</Text>
                        <Text style={styles.contactValue}>{phone}</Text>
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
    complianceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
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
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#8B2C2E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    badgeIconText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    badgeText: {
        flex: 1,
        fontSize: 13,
        color: '#4A5568',
        lineHeight: 20,
        fontWeight: '500',
    },
    introCard: {
        marginHorizontal: isSmallDevice ? 16 : 20,
        marginTop: 16,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    introGradient: {
        padding: isSmallDevice ? 20 : 24,
    },
    introTitle: {
        fontSize: isSmallDevice ? 20 : 22,
        fontWeight: '700',
        color: '#1A1D29',
        marginBottom: 12,
        letterSpacing: -0.3,
    },
    introText: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 24,
    },
    contentWrapper: {
        paddingHorizontal: isSmallDevice ? 16 : 20,
        paddingTop: 8,
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
    bulletLabel: {
        fontWeight: '600',
        color: '#334155',
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
        alignItems: 'center',
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
        fontSize: 36,
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