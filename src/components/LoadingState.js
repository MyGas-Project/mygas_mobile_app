import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

const LoadingPage = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const dotsAnim = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0)
    ]).current;

    const { width, height } = Dimensions.get('window');

    useEffect(() => {
        // Initial fade in animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous rotation animation
        const rotateAnimation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        );

        // Pulse animation
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
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

        // Dots animation
        const dotsAnimation = Animated.loop(
            Animated.stagger(200, dotsAnim.map(dot =>
                Animated.sequence([
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            ))
        );

        rotateAnimation.start();
        pulseAnimation.start();
        dotsAnimation.start();

        return () => {
            rotateAnimation.stop();
            pulseAnimation.stop();
            dotsAnimation.stop();
        };
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {/* Background gradient effect */}
            <View style={styles.backgroundOverlay} />

            <Animated.View
                style={[
                    styles.contentContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* Main loading spinner */}
                <Animated.View
                    style={[
                        styles.spinnerContainer,
                        {
                            transform: [
                                { rotate: spin },
                                { scale: pulseAnim },
                            ],
                        },
                    ]}
                >
                    <View style={styles.spinner}>
                        <View style={styles.spinnerInner} />
                    </View>
                </Animated.View>

                {/* Loading text */}
                <Text style={styles.loadingText}>Loading</Text>

                {/* Animated dots */}
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
                                            outputRange: [0, -10],
                                        }),
                                    }],
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Subtitle */}
                <Text style={styles.subtitle}>Please wait while we prepare everything for you</Text>
            </Animated.View>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    backgroundOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at center, rgba(236, 29, 36, 0.1) 0%, rgba(255, 241, 0, 0.05) 50%, transparent 100%)',
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    spinnerContainer: {
        marginBottom: 40,
    },
    spinner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: 'rgba(255, 241, 0, 0.3)',
        borderTopColor: '#ec1d24',
        borderRightColor: '#fff100',
        backgroundColor: 'transparent',
        position: 'relative',
    },
    spinnerInner: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: 8,
        bottom: 8,
        borderRadius: 32,
        backgroundColor: 'rgba(236, 29, 36, 0.1)',
    },
    loadingText: {
        fontSize: 28,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 10,
        letterSpacing: 1,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff100',
        marginHorizontal: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
    },
};

export default LoadingPage;