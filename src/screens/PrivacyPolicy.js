import { StyleSheet, Text, View, ScrollView, Dimensions, Platform } from 'react-native'
import React, { useContext } from 'react'
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

const { width, height } = Dimensions.get('window')

// Responsive breakpoints
const isTablet = width >= 768
const isLargeScreen = width >= 1024

export default function PrivacyPolicy({ navigation }) {
    const { userInfo } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            {/* <Navbar /> */}
            {userInfo && <Navbar />}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>My Gas Petroleum Corporation{'\n'}Privacy Policy</Text>
                        <View style={styles.divider} />
                        <Text style={styles.lastUpdated}>Last Updated: October 14, 2025</Text>
                        <Text style={styles.subtitle}>
                            In accordance with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173)
                        </Text>
                    </View>
                </View>

                <View style={styles.contentWrapper}>
                    <View style={styles.introSection}>
                        <Text style={styles.introTitle}>Introduction</Text>
                        <Text style={styles.paragraph}>
                            This Privacy Policy outlines how My Gas Petroleum Corporation collects, uses, stores,
                            and protects your personal information in accordance with the Philippine Data Privacy Act
                            of 2012 (Republic Act No. 10173) ("DPA") and its Implementing Rules and Regulations ("IRR").
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={styles.numberBadgeText}>1</Text>
                            </View>
                            <Text style={styles.sectionTitle}>What Personal Information Do We Collect?</Text>
                        </View>
                        <View style={styles.bulletList}>
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
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={styles.numberBadgeText}>2</Text>
                            </View>
                            <Text style={styles.sectionTitle}>How We Collect Your Personal Information</Text>
                        </View>
                        <View style={styles.bulletList}>
                            <BulletItem text="When you register on our website or mobile application." />
                            <BulletItem text="When you contact our customer service." />
                            <BulletItem text="When you make a purchase or transaction." />
                            <BulletItem text="Through cookies and other tracking technologies on our website or mobile application." />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={styles.numberBadgeText}>3</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Purposes of Collecting Personal Information</Text>
                        </View>
                        <View style={styles.bulletList}>
                            <BulletItem text="To process your orders and transactions." />
                            <BulletItem text="To provide customer support." />
                            <BulletItem text="To personalize your experience on our website and mobile application." />
                            <BulletItem text="To send marketing communications and promotional offers." />
                            <BulletItem text="To improve our services, website, and mobile application functionality." />
                            <BulletItem text="To comply with legal and regulatory requirements." />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={styles.numberBadgeText}>4</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Sharing of Personal Information</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            We may share your personal data with our trusted third-party service providers who assist
                            us in operating our business, such as payment gateways, shipping carriers, and marketing platforms.
                        </Text>
                        <Text style={styles.paragraph}>
                            We will only share your personal information with these third parties with appropriate
                            safeguards and only to the extent necessary to achieve the purposes outlined above.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={styles.numberBadgeText}>5</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Your Privacy Rights</Text>
                        </View>
                        <View style={styles.bulletList}>
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
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={styles.numberBadgeText}>6</Text>
                            </View>
                            <Text style={styles.sectionTitle}>How to Exercise Your Rights</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            To exercise your privacy rights, please contact us at:
                        </Text>
                        <View style={styles.contactCard}>
                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>Email:</Text>
                                <Text style={styles.contactValue}>mygasmotorista@gmail.com</Text>
                            </View>
                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>Phone:</Text>
                                <Text style={styles.contactValue}>09199127793</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={styles.numberBadgeText}>7</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Data Security</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            We take appropriate technical and organizational measures to protect your personal
                            information from unauthorized access, use, disclosure, alteration, or destruction.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={styles.numberBadgeText}>8</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Retention of Personal Data</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            We will retain your personal information for as long as necessary to fulfill the purposes
                            for which it was collected, considering legal requirements and our business needs.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={styles.numberBadgeText}>9</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            We may update this Privacy Policy from time to time. We will notify you of any
                            significant changes through our website, mobile application, or other communication channels.
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.numberBadge}>
                                <Text style={styles.numberBadgeText}>10</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Contact Information</Text>
                        </View>
                        <Text style={styles.paragraph}>
                            If you have any questions about this Privacy Policy, please contact us at:
                        </Text>
                        <View style={styles.contactCard}>
                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>Email:</Text>
                                <Text style={styles.contactValue}>mygasmotorista@gmail.com</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.footerIcon}>
                            <Text style={styles.footerIconText}>🔒</Text>
                        </View>
                        <Text style={styles.footerTitle}>Your Privacy Matters</Text>
                        <Text style={styles.footerText}>
                            My Gas Petroleum Corporation is committed to protecting your personal information
                            and complying with the Philippine Data Privacy Act of 2012.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

// Reusable BulletItem component
const BulletItem = ({ label, text }) => (
    <View style={styles.bulletItem}>
        <View style={styles.bulletDot} />
        <Text style={styles.bulletText}>
            {label && <Text style={styles.bulletLabel}>{label} </Text>}
            {text}
        </Text>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollView: {
        flex: 1,
        paddingTop: 10
    },
    contentContainer: {
        paddingBottom: 60,
    },
    headerContainer: {
        backgroundColor: '#f8f9fc',
        paddingHorizontal: isLargeScreen ? 60 : isTablet ? 40 : 20,
        paddingTop: isTablet ? 40 : 24,
        paddingBottom: isTablet ? 40 : 24,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    header: {
        maxWidth: isLargeScreen ? 900 : '100%',
        marginHorizontal: 'auto',
    },
    title: {
        fontSize: isLargeScreen ? 36 : isTablet ? 32 : 26,
        fontWeight: '700',
        color: '#1a1d29',
        marginBottom: 16,
        letterSpacing: -0.5,
        lineHeight: isLargeScreen ? 48 : isTablet ? 44 : 36,
    },
    divider: {
        height: 4,
        width: 60,
        backgroundColor: '#4a5568',
        borderRadius: 2,
        marginBottom: 16,
    },
    lastUpdated: {
        fontSize: isTablet ? 15 : 14,
        color: '#64748b',
        marginBottom: 12,
        fontWeight: '500',
    },
    subtitle: {
        fontSize: isTablet ? 15 : 14,
        color: '#475569',
        lineHeight: 22,
        fontStyle: 'italic',
    },
    contentWrapper: {
        paddingHorizontal: isLargeScreen ? 60 : isTablet ? 40 : 20,
        paddingTop: isTablet ? 48 : 32,
        maxWidth: isLargeScreen ? 900 : '100%',
        marginHorizontal: 'auto',
        width: '100%',
    },
    introSection: {
        marginBottom: isTablet ? 48 : 36,
        padding: isTablet ? 24 : 20,
        backgroundColor: '#f8f9fc',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#4a5568',
    },
    introTitle: {
        fontSize: isLargeScreen ? 24 : isTablet ? 22 : 20,
        fontWeight: '700',
        color: '#1a1d29',
        marginBottom: 12,
        letterSpacing: -0.3,
    },
    section: {
        marginBottom: isTablet ? 48 : 36,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    numberBadge: {
        width: isTablet ? 36 : 32,
        height: isTablet ? 36 : 32,
        borderRadius: isTablet ? 18 : 16,
        backgroundColor: '#4a5568',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    numberBadgeText: {
        color: '#ffffff',
        fontSize: isTablet ? 16 : 14,
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: isLargeScreen ? 24 : isTablet ? 22 : 20,
        fontWeight: '700',
        color: '#1a1d29',
        flex: 1,
        letterSpacing: -0.3,
    },
    paragraph: {
        fontSize: isTablet ? 16 : 15,
        color: '#475569',
        lineHeight: isTablet ? 28 : 26,
        marginBottom: 16,
    },
    bulletList: {
        marginTop: 12,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingLeft: 8,
    },
    bulletDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#64748b',
        marginTop: isTablet ? 11 : 10,
        marginRight: 12,
    },
    bulletText: {
        flex: 1,
        fontSize: isTablet ? 16 : 15,
        color: '#475569',
        lineHeight: isTablet ? 28 : 26,
    },
    bulletLabel: {
        fontWeight: '600',
        color: '#334155',
    },
    contactCard: {
        marginTop: 20,
        backgroundColor: '#f8f9fc',
        padding: isTablet ? 24 : 20,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#4a5568',
    },
    contactItem: {
        marginBottom: 12,
    },
    contactLabel: {
        fontSize: isTablet ? 15 : 14,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 4,
    },
    contactValue: {
        fontSize: isTablet ? 16 : 15,
        color: '#1a1d29',
        fontWeight: '500',
    },
    footer: {
        marginTop: isTablet ? 60 : 40,
        padding: isTablet ? 32 : 24,
        backgroundColor: '#f0fdf4',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#bbf7d0',
        alignItems: 'center',
    },
    footerIcon: {
        width: isTablet ? 56 : 48,
        height: isTablet ? 56 : 48,
        borderRadius: isTablet ? 28 : 24,
        backgroundColor: '#dcfce7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    footerIconText: {
        fontSize: isTablet ? 28 : 24,
    },
    footerTitle: {
        fontSize: isTablet ? 20 : 18,
        fontWeight: '700',
        color: '#15803d',
        marginBottom: 12,
        textAlign: 'center',
    },
    footerText: {
        fontSize: isTablet ? 15 : 14,
        color: '#15803d',
        lineHeight: isTablet ? 24 : 22,
        textAlign: 'center',
        fontWeight: '500',
    },
});