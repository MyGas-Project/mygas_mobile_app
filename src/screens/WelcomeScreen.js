import { View, Text, TouchableOpacity, ImageBackground, Alert, Dimensions, Platform, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeableComponent from '../components/SwipeableComponent';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isLargeDevice = width >= 768;

export default function WelcomeScreen({ navigation }) {
    const { theme, styles } = useTheme();
    const [locationGranted, setLocationGranted] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    Alert.alert(
                        "Location Permission Required",
                        "Please enable location services to find nearby gas stations."
                    );
                    setLocationGranted(false);
                    return;
                }
                setLocationGranted(true);
            } catch (error) {
                console.error("Location error:", error);
                Alert.alert(
                    "Location Error",
                    "Unable to get your current location. Using default location instead."
                );
            }
        })();
    }, []);

    const getResponsivePadding = () => {
        if (isSmallDevice) return 20;
        if (isMediumDevice) return 24;
        return 32;
    };

    const getResponsiveFontSize = (base) => {
        if (isSmallDevice) return base * 0.9;
        if (isLargeDevice) return base * 1.2;
        return base;
    };

    const slides = [
        <View style={responsiveStyles.slideContent}>
            <View style={responsiveStyles.textContainer}>
                {/* <Text style={[responsiveStyles.slideNumber, { fontSize: getResponsiveFontSize(14) }]}>
                    01
                </Text> */}
                <Text style={[responsiveStyles.slideTitle, { fontSize: getResponsiveFontSize(36) }]}>
                    Welcome to MyGas
                </Text>
                <Text style={[responsiveStyles.slideSubtitle, { fontSize: getResponsiveFontSize(18) }]}>
                    Motorista Card
                </Text>
                <View style={responsiveStyles.decorativeLine} />
                <Text style={[responsiveStyles.slideDescription, { fontSize: getResponsiveFontSize(15) }]}>
                    Your ultimate companion for smart fueling. Track expenses, find stations, and earn rewards with every visit.
                </Text>
            </View>
        </View>,
        <View style={responsiveStyles.slideContent}>
            <View style={responsiveStyles.textContainer}>
                {/* <Text style={[responsiveStyles.slideNumber, { fontSize: getResponsiveFontSize(14) }]}>
                    02
                </Text> */}
                <Text style={[responsiveStyles.slideTitle, { fontSize: getResponsiveFontSize(36) }]}>
                    Earn Rewards
                </Text>
                <Text style={[responsiveStyles.slideSubtitle, { fontSize: getResponsiveFontSize(18) }]}>
                    Every Fill-Up Counts
                </Text>
                <View style={responsiveStyles.decorativeLine} />
                <Text style={[responsiveStyles.slideDescription, { fontSize: getResponsiveFontSize(15) }]}>
                    Accumulate points with every fuel purchase and redeem them for exclusive discounts and special offers.
                </Text>
            </View>
        </View>,
        <View style={responsiveStyles.slideContent}>
            <View style={responsiveStyles.textContainer}>
                {/* <Text style={[responsiveStyles.slideNumber, { fontSize: getResponsiveFontSize(14) }]}>
                    03
                </Text> */}
                <Text style={[responsiveStyles.slideTitle, { fontSize: getResponsiveFontSize(36) }]}>
                    Exclusive Benefits
                </Text>
                <Text style={[responsiveStyles.slideSubtitle, { fontSize: getResponsiveFontSize(18) }]}>
                    Premium Member Perks
                </Text>
                <View style={responsiveStyles.decorativeLine} />
                <Text style={[responsiveStyles.slideDescription, { fontSize: getResponsiveFontSize(15) }]}>
                    Access limited-time promotions, priority service, and personalized fuel recommendations.
                </Text>
            </View>
        </View>,
    ];

    return (
        <SafeAreaView style={responsiveStyles.container} edges={['left', 'right', 'bottom']}>
            <ImageBackground
                source={require('../../assets/welcome.jpeg')}
                resizeMode='cover'
                style={responsiveStyles.backgroundImage}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.4)', 'rgba(254,0,2,0.03)', 'rgba(255,255,255,0.97)']}
                    locations={[0, 0.35, 0.75]}
                    style={responsiveStyles.gradient}
                />

                <View style={responsiveStyles.content}>
                    {/* Logo Section with improved styling */}
                    {/* <View style={responsiveStyles.logoSection}>
                        <View style={responsiveStyles.logoWrapper}>
                            <Text style={[responsiveStyles.logoText, { fontSize: getResponsiveFontSize(28) }]}>
                                MyGas
                            </Text>
                            <View style={responsiveStyles.logoDivider} />
                            <Text style={[responsiveStyles.logoSubtext, { fontSize: getResponsiveFontSize(11) }]}>
                                MOTORISTA CARD
                            </Text>
                        </View>
                    </View> */}

                    {/* Swipeable Slides with better spacing */}
                    <GestureHandlerRootView style={responsiveStyles.swiperContainer}>
                        <SwipeableComponent slides={slides} />
                    </GestureHandlerRootView>

                    {/* Action Buttons - Redesigned layout */}
                    <View style={[responsiveStyles.footer, { paddingHorizontal: getResponsivePadding() }]}>
                        <TouchableOpacity
                            style={[responsiveStyles.primaryButton, {
                                height: isSmallDevice ? 54 : 58,
                            }]}
                            onPress={() => navigation.navigate('Register')}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={['#FE0002', '#D90002']}
                                style={responsiveStyles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={[responsiveStyles.primaryButtonText, {
                                    fontSize: getResponsiveFontSize(17)
                                }]}>
                                    Create Account
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={responsiveStyles.dividerContainer}>
                            <View style={responsiveStyles.dividerLine} />
                            <Text style={[responsiveStyles.dividerText, {
                                fontSize: getResponsiveFontSize(13)
                            }]}>
                                or
                            </Text>
                            <View style={responsiveStyles.dividerLine} />
                        </View>

                        <TouchableOpacity
                            style={[responsiveStyles.secondaryButton, {
                                height: isSmallDevice ? 54 : 58,
                            }]}
                            onPress={() => navigation.navigate('Login')}
                            activeOpacity={0.85}
                        >
                            <Text style={[responsiveStyles.secondaryButtonText, {
                                fontSize: getResponsiveFontSize(17)
                            }]}>
                                Sign In
                            </Text>
                        </TouchableOpacity>

                        <View style={responsiveStyles.linksContainer}>
                            <Text style={[responsiveStyles.footerNote, {
                                fontSize: getResponsiveFontSize(12)
                            }]}>
                                By continuing, you agree to our{' '}
                            </Text>
                            <View style={responsiveStyles.linksRow}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('TermsCondition')}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[responsiveStyles.linkText, {
                                        fontSize: getResponsiveFontSize(12)
                                    }]}>
                                        Terms & Conditions
                                    </Text>
                                </TouchableOpacity>
                                <Text style={[responsiveStyles.footerNote, {
                                    fontSize: getResponsiveFontSize(12)
                                }]}>
                                    {' '}and{' '}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('PrivacyPolicy')}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[responsiveStyles.linkText, {
                                        fontSize: getResponsiveFontSize(12)
                                    }]}>
                                        Privacy Policy
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </ImageBackground>
            <StatusBar style='light' />
        </SafeAreaView>
    );
}

const responsiveStyles = {
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    backgroundImage: {
        flex: 1,
        paddingTop: 50,
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    logoSection: {
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 24 : 16,
        paddingBottom: 16,
    },
    logoWrapper: {
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        backdropFilter: 'blur(10px)',
    },
    logoText: {
        fontWeight: '900',
        color: '#FE0002',
        letterSpacing: 1.5,
        textShadowColor: 'rgba(254, 0, 2, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    logoDivider: {
        width: 40,
        height: 2,
        backgroundColor: '#FE0002',
        marginVertical: 6,
        borderRadius: 1,
    },
    logoSubtext: {
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 3,
        opacity: 0.8,
    },
    swiperContainer: {
        flex: 1,
        justifyContent: 'center',
        maxHeight: height * 0.48,
        marginVertical: 20,
    },
    slideContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: isLargeDevice ? 48 : 28,
        paddingVertical: 24,
    },
    textContainer: {
        alignItems: 'center',
        width: '100%',
    },
    slideNumber: {
        fontWeight: '800',
        color: '#FE0002',
        letterSpacing: 2,
        marginBottom: 16,
        opacity: 0.7,
    },
    decorativeLine: {
        width: 60,
        height: 3,
        backgroundColor: '#FE0002',
        marginVertical: 16,
        borderRadius: 2,
    },
    slideTitle: {
        fontWeight: '800',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 8,
        paddingHorizontal: 16,
        letterSpacing: 0.5,
    },
    slideSubtitle: {
        fontWeight: '600',
        color: '#DEDEDE',
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    slideDescription: {
        fontWeight: '400',
        color: '#4D4D4D',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 12,
        maxWidth: isLargeDevice ? 500 : 340,
    },
    footer: {
        paddingBottom: Platform.OS === 'ios' ? 24 : 28,
        paddingTop: 12,
        gap: 14,
    },
    primaryButton: {
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#FE0002',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    dividerText: {
        color: '#999',
        paddingHorizontal: 16,
        fontWeight: '500',
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2.5,
        borderColor: '#FE0002',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    secondaryButtonText: {
        color: '#FE0002',
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    linksContainer: {
        alignItems: 'center',
        marginTop: 8,
        paddingHorizontal: 24,
    },
    linksRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    footerNote: {
        color: '#999',
        textAlign: 'center',
        lineHeight: 18,
    },
    linkText: {
        color: '#FE0002',
        fontWeight: '600',
        textDecorationLine: 'underline',
        lineHeight: 18,
    },
};