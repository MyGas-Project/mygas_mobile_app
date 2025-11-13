import { StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import React from 'react'
import QRCode from 'react-native-qrcode-svg'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')

const isSmallDevice = width < 375
const isMediumDevice = width >= 375 && width < 768
const isTablet = width >= 768 && width < 1024
const isLargeTablet = width >= 1024

const getResponsiveValue = (small, medium, tablet, large) => {
    if (isSmallDevice) return small
    if (isMediumDevice) return medium
    if (isTablet) return tablet
    return large
}

export default function QrDownloadTemplate({ qrCode, transactionId }) {
    return (
        <View style={styles.container}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={['#ED8080', '#CC0E0E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.brandingSection}>
                    <Image
                        source={require("../../../../assets/mygas_logo.png")}
                        style={styles.logo}
                    />
                    <View style={styles.brandIcon}>
                        <Ionicons name="qr-code" size={32} color="#FFFFFF" />
                    </View>
                    <View>
                        <Text style={styles.brandTitle}>Redemption QR Code</Text>
                        <Text style={styles.brandSubtitle}>Scan to verify</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* QR Code Section */}
            <View style={styles.qrSection}>
                <View style={styles.qrContainer}>
                    <View style={styles.qrWrapper}>
                        {qrCode ? (
                            <QRCode
                                value={qrCode}
                                size={getResponsiveValue(200, 240, 280, 320)}
                                backgroundColor="#FFFFFF"
                                color="#1E293B"
                            />
                        ) : (
                            <View style={styles.qrPlaceholder}>
                                <Ionicons
                                    name="qr-code-outline"
                                    size={getResponsiveValue(200, 240, 280, 320)}
                                    color="#E2E8F0"
                                />
                            </View>
                        )}
                    </View>

                    {/* Corner Decorations */}
                    <View style={[styles.cornerDecoration, styles.topLeft]} />
                    <View style={[styles.cornerDecoration, styles.topRight]} />
                    <View style={[styles.cornerDecoration, styles.bottomLeft]} />
                    <View style={[styles.cornerDecoration, styles.bottomRight]} />
                </View>

                {/* Instructions */}
                <View style={styles.instructionsContainer}>
                    <View style={styles.instructionItem}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <Text style={styles.instructionText}>
                            Present this QR to the pickup station
                        </Text>
                    </View>

                    <View style={styles.instructionItem}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                        </View>
                        <Text style={styles.instructionText}>
                            Proceed to cashier for redemption
                        </Text>
                    </View>
                </View>

                {/* Transaction Details */}
                {transactionId && (
                    <View style={styles.detailsCard}>
                        <Text style={styles.detailLabel}>Transaction ID</Text>
                        <Text style={styles.detailValue}>{transactionId}</Text>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerDivider} />
                    <Text style={styles.footerText}>
                        Valid for one-time redemption only
                    </Text>
                    <Text style={styles.footerDate}>
                        Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        width: getResponsiveValue(350, 400, 450, 500),
    },
    header: {
        paddingVertical: getResponsiveValue(24, 28, 32, 36),
        paddingHorizontal: getResponsiveValue(20, 24, 28, 32),
        opacity: 0.9,
        alignItems: 'center',
    },
    brandingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(12, 14, 16, 18),
    },
    logo: {
        width: getResponsiveValue(40, 44, 48, 52),
        height: getResponsiveValue(40, 44, 48, 52),
        resizeMode: 'contain',
    },
    brandIcon: {
        width: getResponsiveValue(48, 52, 56, 60),
        height: getResponsiveValue(48, 52, 56, 60),
        borderRadius: getResponsiveValue(24, 26, 28, 30),
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandTitle: {
        fontSize: getResponsiveValue(18, 20, 22, 24),
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    brandSubtitle: {
        fontSize: getResponsiveValue(12, 13, 14, 15),
        color: 'rgba(255,255,255,0.9)',
        marginTop: 2,
    },
    qrSection: {
        padding: getResponsiveValue(24, 28, 32, 36),
        alignItems: 'center',
    },
    qrContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: getResponsiveValue(24, 28, 32, 36),
        position: 'relative',
    },
    qrWrapper: {
        padding: getResponsiveValue(20, 24, 28, 32),
        backgroundColor: '#FFFFFF',
        borderRadius: getResponsiveValue(16, 18, 20, 22),
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    qrPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cornerDecoration: {
        position: 'absolute',
        width: getResponsiveValue(20, 22, 24, 26),
        height: getResponsiveValue(20, 22, 24, 26),
        borderColor: '#EF4444',
        borderWidth: 3,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 8,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 8,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 8,
    },
    instructionsContainer: {
        width: '100%',
        backgroundColor: '#F8FAFC',
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        padding: getResponsiveValue(16, 18, 20, 22),
        marginBottom: getResponsiveValue(16, 18, 20, 22),
        gap: getResponsiveValue(12, 14, 16, 18),
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(12, 14, 16, 18),
    },
    stepNumber: {
        width: getResponsiveValue(28, 30, 32, 34),
        height: getResponsiveValue(28, 30, 32, 34),
        borderRadius: getResponsiveValue(14, 15, 16, 17),
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberText: {
        fontSize: getResponsiveValue(14, 15, 16, 17),
        fontWeight: '700',
        color: '#FFFFFF',
    },
    instructionText: {
        flex: 1,
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: '#334155',
        fontWeight: '500',
        lineHeight: getResponsiveValue(18, 20, 22, 24),
    },
    detailsCard: {
        width: '100%',
        backgroundColor: '#F8FAFC',
        borderRadius: getResponsiveValue(12, 14, 16, 18),
        padding: getResponsiveValue(16, 18, 20, 22),
        marginBottom: getResponsiveValue(16, 18, 20, 22),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    detailLabel: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        color: '#64748B',
        fontWeight: '500',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: getResponsiveValue(13, 14, 15, 16),
        color: '#1E293B',
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    footer: {
        alignItems: 'center',
        marginTop: getResponsiveValue(8, 10, 12, 14),
    },
    footerDivider: {
        width: '60%',
        height: 2,
        backgroundColor: '#E2E8F0',
        marginBottom: getResponsiveValue(12, 14, 16, 18),
        borderRadius: 1,
    },
    footerText: {
        fontSize: getResponsiveValue(11, 12, 13, 14),
        color: '#64748B',
        fontWeight: '600',
        textAlign: 'center',
    },
    footerDate: {
        fontSize: getResponsiveValue(10, 11, 12, 13),
        color: '#94A3B8',
        marginTop: 4,
        textAlign: 'center',
    },
});