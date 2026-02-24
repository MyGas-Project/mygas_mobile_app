import {
    View,
    Text,
    TouchableOpacity,
    Linking,
    Dimensions,
    StyleSheet,
    StatusBar,
    ImageBackground,
} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'

const { width } = Dimensions.get('window')
const isSmallDevice = width < 375
const isLargeDevice = width >= 414

export default function UpdateScreen({ storeUrl }) {
    const handleUpdate = () => {
        if (storeUrl) {
            Linking.openURL(storeUrl)
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <ImageBackground
                source={require('../../assets/office.jpg')}
                resizeMode='cover'
                style={styles.backgroundImage}
            >
                <LinearGradient
                    colors={[
                        'rgba(139, 44, 46, 0.92)',
                        'rgba(200, 75, 58, 0.85)',
                        'rgba(232, 137, 94, 0.75)',
                        'rgba(244, 181, 124, 0.65)'
                    ]}
                    locations={[0, 0.35, 0.65, 1]}
                    style={styles.gradient}
                >
                    <SafeAreaView style={styles.safeArea} edges={[]}>
                        <View style={styles.content}>

                            {/* Logo Section */}
                            <View style={styles.headerSection}>
                                <View style={styles.logoRow}>
                                    <View style={styles.logoWrapper}>
                                        <Icon name="flame-outline" size={isSmallDevice ? 28 : 32} color="#FFFFFF" />
                                    </View>
                                    <View style={styles.logoTextContainer}>
                                        <Text style={styles.logoMainText}>MY GAS</Text>
                                        <Text style={styles.logoSubText}>MOTORISTA APP</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Center Card */}
                            <View style={styles.card}>

                                {/* Icon */}
                                <View style={styles.iconWrapper}>
                                    <Icon name="rocket-outline" size={isSmallDevice ? 40 : 48} color="#FFFFFF" />
                                </View>

                                {/* Badge */}
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>UPDATE REQUIRED</Text>
                                </View>

                                {/* Title */}
                                <Text style={styles.title}>New Version{'\n'}Available</Text>
                                <View style={styles.underline} />

                                {/* Message */}
                                <Text style={styles.message}>
                                    To keep fueling your experience, please update MyGas to the latest version. This update is required to continue using the app.
                                </Text>

                                {/* Divider */}
                                <View style={styles.dividerContainer}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>ACTION NEEDED</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                {/* Update Button */}
                                <TouchableOpacity
                                    style={styles.updateButton}
                                    onPress={handleUpdate}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#FFFFFF', '#F8F8F8']}
                                        style={styles.buttonGradient}
                                    >
                                        <Icon name="download-outline" size={20} color="#8B2C2E" style={{ marginRight: 8 }} />
                                        <Text style={styles.updateButtonText}>UPDATE NOW</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/* Footer note */}
                                <Text style={styles.footerText}>
                                    You must update to continue using the app.
                                </Text>

                            </View>

                            {/* Bottom version note */}
                            <View style={styles.bottomSection}>
                                <Text style={styles.versionText}>A newer version is available in the store.</Text>
                            </View>

                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8B2C2E',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    gradient: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingTop: 0,
    },
    content: {
        flex: 1,
        paddingHorizontal: isSmallDevice ? 20 : 28,
        paddingTop: 40,
        paddingBottom: 20,
        justifyContent: 'space-between',
    },

    // Header
    headerSection: {
        marginBottom: 8,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        padding: 10,
        marginRight: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    logoTextContainer: {
        justifyContent: 'center',
    },
    logoMainText: {
        fontSize: isSmallDevice ? 22 : 26,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
        lineHeight: isSmallDevice ? 26 : 30,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    logoSubText: {
        fontSize: isSmallDevice ? 9 : 10,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 2,
        opacity: 0.95,
    },

    // Card
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
        padding: isSmallDevice ? 24 : 28,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    iconWrapper: {
        width: isSmallDevice ? 80 : 90,
        height: isSmallDevice ? 80 : 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 5,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
    },
    title: {
        fontSize: isSmallDevice ? 32 : isLargeDevice ? 42 : 38,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
        textAlign: 'center',
        lineHeight: isSmallDevice ? 38 : 48,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    underline: {
        width: 80,
        height: 4,
        backgroundColor: '#FFFFFF',
        marginTop: 8,
        marginBottom: 16,
        borderRadius: 2,
        elevation: 2,
    },
    message: {
        fontSize: isSmallDevice ? 14 : 15,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
        opacity: 0.95,
        paddingHorizontal: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        width: '100%',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    dividerText: {
        marginHorizontal: 12,
        fontSize: 11,
        color: '#FFFFFF',
        fontWeight: '700',
        opacity: 0.8,
        letterSpacing: 1.5,
    },
    updateButton: {
        borderRadius: 16,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: isSmallDevice ? 17 : 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 16,
    },
    updateButtonText: {
        fontSize: isSmallDevice ? 16 : 18,
        fontWeight: '900',
        color: '#8B2C2E',
        letterSpacing: 2.5,
    },
    footerText: {
        marginTop: 16,
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.8,
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 18,
    },

    // Bottom
    bottomSection: {
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
        marginTop: 8,
    },
    versionText: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.7,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
})