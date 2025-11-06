import { StyleSheet, Text, View, ScrollView, SafeAreaView, Dimensions } from 'react-native'
import React from 'react'
import Navbar from '../components/Navbar';

const { width } = Dimensions.get('window')

export default function TermsCondition({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <Navbar />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>My Gas Petroleum Corporation{'\n'}Terms and Conditions</Text>
                    <Text style={styles.lastUpdated}>Last Updated: October 1, 2025</Text>
                    <Text style={styles.welcomeText}>
                        Welcome to My Gas Petroleum Corporation's website and/or mobile application. By accessing
                        or using our website (https://mygasmotorista.com) and/or mobile application, you agree to
                        be bound by these Terms and Conditions. Please read them carefully.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                    <Text style={styles.paragraph}>
                        By accessing this website and/or mobile application, you confirm that you have read,
                        understood, and agreed to be bound by these Terms and Conditions, including any
                        additional terms and policies referenced herein.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Website and Mobile Application Usage</Text>
                    <Text style={styles.bulletPoint}>
                        • You must be at least 18 years old or have parental/guardian supervision to use this
                        website and/or mobile application
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • You agree not to use the website and/or mobile application for any unlawful purpose
                        or any purpose prohibited under these Terms.
                    </Text>
                    <Text style={styles.bulletPoint}>
                        • You agree not to attempt to interfere with the website and/or mobile application's
                        proper functioning or attempt to breach security.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Services and Content</Text>
                    <Text style={styles.paragraph}>
                        My Gas Petroleum Corporation provides information about our products, fuel prices,
                        promotions, station locations, and services through this website and/or mobile application.
                        All content is for informational purposes only and may be subject to change without notice.
                    </Text>
                    <Text style={[styles.paragraph, { marginTop: 12 }]}>
                        We do not guarantee the accuracy, completeness, or reliability of any information on the
                        site. Prices and services may vary per branch or location.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Intellectual Property</Text>
                    <Text style={styles.paragraph}>
                        All content, trademarks, logos, graphics, and other materials found on this website and/or
                        mobile application are the property of My Gas Petroleum Corporation and protected under
                        applicable copyright and trademark laws in the Philippines. You may not reproduce, distribute,
                        or modify any content without our prior written permission.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. User Submissions</Text>
                    <Text style={styles.paragraph}>
                        If you submit any feedback, suggestions, or inquiries via our contact form or email, you
                        agree that we may use this information to improve our services. We are under no obligation
                        to keep such information confidential or to compensate you for its use.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Third-Party Links</Text>
                    <Text style={styles.paragraph}>
                        Our website and/or mobile application may contain links to third-party websites or services
                        that are not owned or controlled by My Gas Petroleum Corporation. We are not responsible for
                        the content, privacy policies, or practices of any third-party sites.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
                    <Text style={styles.paragraph}>
                        To the maximum extent permitted by law, My Gas Petroleum Corporation shall not be liable
                        for any direct, indirect, incidental, or consequential damages resulting from the use or
                        inability to use the website and/or mobile application.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>8. Privacy</Text>
                    <Text style={styles.paragraph}>
                        We respect your privacy. Please refer to our Privacy Policy for information on how we
                        collect, use, and protect your personal data.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>9. Governing Law</Text>
                    <Text style={styles.paragraph}>
                        These Terms shall be governed by and construed in accordance with the laws of the Republic
                        of the Philippines. Any disputes arising under these Terms shall be subject to the exclusive
                        jurisdiction of the courts in Davao City, Philippines.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
                    <Text style={styles.paragraph}>
                        We reserve the right to update or modify these Terms and Conditions at any time without
                        prior notice. Your continued use of the website and/or mobile application after changes
                        are posted constitutes your acceptance of the revised terms.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <Text style={styles.paragraph}>
                        For any questions regarding these Terms and Conditions, you may contact us at:
                    </Text>
                    <Text style={styles.contactInfo}>Email: mygasmotorista@gmail.com</Text>
                    <Text style={styles.contactInfo}>Phone: 09199127793</Text>
                    <Text style={styles.contactInfo}>
                        Address: Purok 1-B, Lower Dampa, Barangay Magtuod, Talomo District, Davao City,
                        8000 Davao del Sur
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By using this application, you signify your acceptance of these terms and conditions.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: width > 768 ? 40 : 20,
        paddingVertical: 24,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 32,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#e9ecef',
    },
    title: {
        fontSize: width > 768 ? 32 : 28,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 8,
        lineHeight: width > 768 ? 42 : 36,
    },
    lastUpdated: {
        fontSize: 14,
        color: '#6c757d',
        fontStyle: 'italic',
        marginBottom: 12,
    },
    welcomeText: {
        fontSize: 15,
        color: '#495057',
        lineHeight: 24,
        textAlign: 'justify',
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: width > 768 ? 20 : 18,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 12,
        lineHeight: 28,
    },
    paragraph: {
        fontSize: 15,
        color: '#495057',
        lineHeight: 24,
        textAlign: 'justify',
    },
    bulletPoint: {
        fontSize: 15,
        color: '#495057',
        lineHeight: 24,
        marginLeft: 16,
        marginTop: 6,
    },
    contactInfo: {
        fontSize: 15,
        color: '#495057',
        lineHeight: 24,
        marginTop: 8,
        marginLeft: 8,
    },
    footer: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#e7f3ff',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#0066cc',
    },
    footerText: {
        fontSize: 14,
        color: '#004085',
        fontWeight: '500',
        lineHeight: 22,
    },
});