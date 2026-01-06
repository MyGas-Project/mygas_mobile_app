import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ImageBackground, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width, height } = Dimensions.get('window');

// Responsive sizing helper
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;
const isLargeDevice = width >= 414;

export default function WelcomeScreen({ navigation }) {
    const handleTermsPress = () => {
        navigation.navigate('TermsCondition');
    };

    const handlePrivacyPress = () => {
        navigation.navigate('PrivacyPolicy');
    };

    const navigateUser = async (label) => {
        const accepted = await AsyncStorage.getItem('agreementAccepted');

        if (accepted === 'true') {
            switch (label) {
                case 'signin':
                    navigation.navigate('Login');
                    break;
                case 'register':
                    navigation.navigate('Register');
                    break;
                default:
                    break;
            }
        } else {
            navigation.navigate('AgreementScreen', { label });
        }
    }

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            <StatusBar barStyle="light-content" />
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
                    <View style={styles.content}>
                        {/* Top Section - Logo and Title */}
                        <View style={styles.topSection}>
                            <View style={styles.logoRow}>
                                <View style={styles.logoWrapper}>
                                    <Image
                                        source={require('../../assets/heart_logo.png')}
                                        style={styles.logo}
                                        resizeMode='contain'
                                    />
                                </View>
                                <View style={styles.logoTextContainer}>
                                    <Text style={styles.logoMainText}>MY GAS</Text>
                                    <Text style={styles.logoSubText}>MOTORISTA APP</Text>
                                </View>
                            </View>

                            <View style={styles.titleContainer}>
                                <Text style={styles.welcomeText}>WELCOME,</Text>
                                <Text style={styles.motoristaText}>MOTORISTA!</Text>
                                <View style={styles.underline} />
                            </View>

                            <View style={styles.subtitleContainer}>
                                <Text style={styles.subtitleText}>Your Points. Your Rewards.</Text>
                                <Text style={styles.subtitleText}>Your Motorista Card.</Text>
                            </View>
                        </View>

                        {/* Middle Section - Card Image */}
                        <View style={styles.cardSection}>
                            <View style={styles.cardImageContainer}>
                                <Image
                                    source={require('../../assets/card_hand.png')}
                                    style={styles.cardImage}
                                    resizeMode='contain'
                                />
                            </View>
                        </View>

                        {/* Bottom Section - Buttons */}
                        <View style={styles.bottomSection}>
                            <TouchableOpacity
                                style={styles.signInButton}
                                onPress={() => navigateUser('signin')}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#FFFFFF', '#F8F8F8']}
                                    style={styles.buttonGradient}
                                >
                                    <Text style={styles.signInText}>SIGN IN</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.registerButton}
                                onPress={() => navigateUser('register')}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.registerText}>REGISTER</Text>
                            </TouchableOpacity>

                            {/* Terms and Privacy */}
                            <View style={styles.termsContainer}>
                                <Text style={styles.termsText}>
                                    By continuing, you agree to our{" "}
                                </Text>
                                <View style={styles.termsLinksRow}>
                                    <TouchableOpacity onPress={handleTermsPress} activeOpacity={0.7}>
                                        <Text style={styles.termsLink}>Terms & Conditions</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.termsText}> and </Text>
                                    <TouchableOpacity onPress={handlePrivacyPress} activeOpacity={0.7}>
                                        <Text style={styles.termsLink}>Privacy Policy</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </SafeAreaView>
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
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: isSmallDevice ? 20 : 28,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
        paddingBottom: Platform.OS === 'android' ? 30 : 20,
    },
    topSection: {
        alignItems: 'flex-start',
        paddingTop: isSmallDevice ? 10 : 20,
        zIndex: 2
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: isSmallDevice ? 24 : 36,
    },
    logoWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        padding: 8,
        marginRight: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    logo: {
        width: isSmallDevice ? 42 : 48,
        height: isSmallDevice ? 42 : 48,
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
        lineHeight: isSmallDevice ? 12 : 14,
        opacity: 0.95,
    },
    titleContainer: {
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: isSmallDevice ? 32 : isLargeDevice ? 42 : 38,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
        lineHeight: isSmallDevice ? 38 : isLargeDevice ? 48 : 44,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    motoristaText: {
        fontSize: isSmallDevice ? 32 : isLargeDevice ? 42 : 38,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
        lineHeight: isSmallDevice ? 38 : isLargeDevice ? 48 : 44,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    underline: {
        width: 80,
        height: 4,
        backgroundColor: '#FFFFFF',
        marginTop: 8,
        borderRadius: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    subtitleContainer: {
        marginTop: 12,
    },
    subtitleText: {
        fontSize: isSmallDevice ? 14 : 16,
        fontWeight: '500',
        color: '#FFFFFF',
        lineHeight: isSmallDevice ? 20 : 24,
        letterSpacing: 0.3,
        opacity: 0.95,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    cardSection: {
        position: 'absolute',
        top: isSmallDevice ? 200 : isLargeDevice ? 280 : 300,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        zIndex: 1,
    },
    cardImageContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    cardImage: {
        width: width * (isSmallDevice ? 0.85 : 0.92),
        height: '100%',
    },
    bottomSection: {
        gap: isSmallDevice ? 12 : 14,
        paddingBottom: isSmallDevice ? 10 : 20,
        paddingTop: 10,
        zIndex: 2,
    },
    signInButton: {
        borderRadius: 16,
        shadowColor: '#8B2C2E',
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
        borderRadius: 16,
    },
    signInText: {
        fontSize: isSmallDevice ? 16 : 18,
        fontWeight: '900',
        color: '#8B2C2E',
        letterSpacing: 2.5,
    },
    registerButton: {
        backgroundColor: '#8B2C2E',
        borderRadius: 16,
        paddingVertical: isSmallDevice ? 17 : 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    registerText: {
        fontSize: isSmallDevice ? 16 : 18,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2.5,
    },
    termsContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
    },
    termsText: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.8,
        textAlign: 'center',
        lineHeight: 18,
    },
    termsLinksRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
    termsLink: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: '600',
        textDecorationLine: 'underline',
        opacity: 0.9,
    },
})