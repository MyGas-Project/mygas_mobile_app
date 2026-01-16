import React from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QRCustomer({ customerBarcode }) {
    return (
        <View style={styles.container}>
            <ImageBackground
                resizeMode="stretch"
                source={require("../../assets/mygas-header.jpeg")}
                style={styles.header}
            >
                <LinearGradient
                    colors={["rgba(249, 250, 141, 0.9)", "transparent"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1.4 }}
                    style={styles.headerGradient}
                />
                <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Member QR Code</Text>
                        <Text style={styles.headerSubtitle}>Scan at checkout to redeem rewards</Text>
                    </View>
                </SafeAreaView>
            </ImageBackground>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={styles.qrCard}>
                        <View style={styles.iconBadge}>
                            <Ionicons name="qr-code" size={24} color="#E0B820" />
                        </View>

                        <View style={styles.qrWrapper}>
                            <QRCode
                                value={customerBarcode || "N/A"} // fallback if null
                                size={240}
                                backgroundColor="#FFFFFF"
                                color="#000000"
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.idSection}>
                            <Text style={styles.idLabel}>Member ID</Text>
                            <Text style={styles.idValue}>{customerBarcode || "N/A"}</Text>
                        </View>

                        <View style={styles.infoBadge}>
                            <Ionicons name="information-circle" size={16} color="#666" />
                            <Text style={styles.infoText}>
                                Position code within scanner frame
                            </Text>
                        </View>
                    </View>

                    {/* Benefits Card */}
                    <View style={styles.benefitsCard}>
                        <LinearGradient
                            colors={['#FFD93D', '#E0B820']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.benefitGradient}
                        >
                            <Ionicons name="star" size={32} color="#FFF" />
                            <View style={styles.benefitContent}>
                                <Text style={styles.benefitTitle}>Earn Points with Every Scan</Text>
                                <Text style={styles.benefitText}>
                                    Get exclusive rewards and special offers
                                </Text>
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
        backgroundColor: '#F8F9FA',
    },
    header: {
        width: '100%',
        position: 'relative',
    },
    safeAreaHeader: {
        justifyContent: 'flex-end',
    },
    headerGradient: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    headerContent: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: -50,
        zIndex: 2,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#222',
        marginBottom: 6,
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#666',
        fontWeight: '400',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 32,
    },
    qrCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        width: '100%',
        maxWidth: 400,
    },
    iconBadge: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFF5E5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    qrWrapper: {
        padding: 20,
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#F0F0F0',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#E9ECEF',
        marginVertical: 24,
    },
    idSection: {
        alignItems: 'center',
        marginBottom: 16,
    },
    idLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    idValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222',
        letterSpacing: 2,
    },
    infoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    benefitsCard: {
        width: '100%',
        marginTop: 24,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#E0B820',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    benefitGradient: {
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        gap: 16,
    },
    benefitContent: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4,
    },
    benefitText: {
        fontSize: 13,
        color: '#FFF',
        opacity: 0.9,
    },
})