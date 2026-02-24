import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Animated,
    Dimensions,
    StyleSheet,
    StatusBar,
    ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width >= 414;

const LoadingScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const dotsAnim = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;

    useEffect(() => {
        // Fade + scale in
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 900,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Spinner rotation
        const rotateAnimation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1800,
                useNativeDriver: true,
            })
        );

        // Pulse on logo glow
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.12,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );

        // Shimmer on the bar
        const shimmerAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: false,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: false,
                }),
            ])
        );

        // Bouncing dots
        const dotsAnimation = Animated.loop(
            Animated.stagger(180,
                dotsAnim.map(dot =>
                    Animated.sequence([
                        Animated.timing(dot, {
                            toValue: 1,
                            duration: 380,
                            useNativeDriver: true,
                        }),
                        Animated.timing(dot, {
                            toValue: 0,
                            duration: 380,
                            useNativeDriver: true,
                        }),
                    ])
                )
            )
        );

        rotateAnimation.start();
        pulseAnimation.start();
        shimmerAnimation.start();
        dotsAnimation.start();

        return () => {
            rotateAnimation.stop();
            pulseAnimation.stop();
            shimmerAnimation.stop();
            dotsAnimation.stop();
        };
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const shimmerWidth = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

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
                        <Animated.View
                            style={[
                                styles.content,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ scale: scaleAnim }],
                                },
                            ]}
                        >
                            {/* Logo Section */}
                            <View style={styles.logoSection}>
                                <Animated.View
                                    style={[
                                        styles.logoWrapper,
                                        { transform: [{ scale: pulseAnim }] },
                                    ]}
                                >
                                    {/* Outer spinner ring */}
                                    <Animated.View
                                        style={[
                                            styles.spinnerRing,
                                            { transform: [{ rotate: spin }] },
                                        ]}
                                    />
                                    {/* Inner glow circle */}
                                    <View style={styles.logoCircle}>
                                        <Text style={styles.logoEmoji}>⛽</Text>
                                    </View>
                                </Animated.View>

                                <View style={styles.logoTextContainer}>
                                    <Text style={styles.logoMainText}>MY GAS</Text>
                                    <Text style={styles.logoSubText}>MOTORISTA APP</Text>
                                </View>
                            </View>

                            {/* Center Content */}
                            <View style={styles.centerSection}>
                                <Text style={styles.loadingTitle}>Loading</Text>
                                <View style={styles.underline} />

                                {/* Dots */}
                                <View style={styles.dotsContainer}>
                                    {dotsAnim.map((dot, index) => (
                                        <Animated.View
                                            key={index}
                                            style={[
                                                styles.dot,
                                                {
                                                    opacity: dot,
                                                    transform: [{
                                                        translateY: dot.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [0, -8],
                                                        }),
                                                    }],
                                                },
                                            ]}
                                        />
                                    ))}
                                </View>

                                <Text style={styles.subtitle}>
                                    Please wait while we prepare everything for you
                                </Text>
                            </View>

                            {/* Progress Bar */}
                            <View style={styles.progressSection}>
                                <View style={styles.progressBarTrack}>
                                    <Animated.View
                                        style={[
                                            styles.progressBarFill,
                                            { width: shimmerWidth },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.progressLabel}>Fueling up...</Text>
                            </View>

                        </Animated.View>
                    </SafeAreaView>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

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
    },
    content: {
        flex: 1,
        paddingHorizontal: isSmallDevice ? 20 : 28,
        paddingTop: 60,
        paddingBottom: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // Logo
    logoSection: {
        alignItems: 'center',
        gap: 16,
    },
    logoWrapper: {
        width: isSmallDevice ? 110 : 130,
        height: isSmallDevice ? 110 : 130,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    spinnerRing: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: isSmallDevice ? 55 : 65,
        borderWidth: 3,
        borderColor: 'transparent',
        borderTopColor: '#FFFFFF',
        borderRightColor: 'rgba(255,255,255,0.4)',
    },
    logoCircle: {
        width: isSmallDevice ? 86 : 100,
        height: isSmallDevice ? 86 : 100,
        borderRadius: isSmallDevice ? 43 : 50,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    logoEmoji: {
        fontSize: isSmallDevice ? 36 : 42,
    },
    logoTextContainer: {
        alignItems: 'center',
    },
    logoMainText: {
        fontSize: isSmallDevice ? 28 : 34,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    logoSubText: {
        fontSize: isSmallDevice ? 10 : 11,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 3,
        opacity: 0.9,
        marginTop: 2,
    },

    // Center
    centerSection: {
        alignItems: 'center',
    },
    loadingTitle: {
        fontSize: isSmallDevice ? 32 : isLargeDevice ? 42 : 38,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    underline: {
        width: 60,
        height: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        marginTop: 8,
        marginBottom: 20,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    subtitle: {
        fontSize: isSmallDevice ? 14 : 15,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
        opacity: 0.9,
        maxWidth: 280,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    // Progress
    progressSection: {
        width: '100%',
        alignItems: 'center',
        gap: 10,
    },
    progressBarTrack: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },
    progressLabel: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '600',
        letterSpacing: 1,
        opacity: 0.8,
    },
});

export default LoadingScreen;