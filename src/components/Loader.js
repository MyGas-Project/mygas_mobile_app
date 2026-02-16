import { StyleSheet, Text, View, ActivityIndicator, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'


export default function Loader({
    visible = true,
    text = "Loading...",
    type = "spinner", // "spinner", "dots", "pulse", "bars"
    size = "large",
    color = "#007AFF",
    textColor = "#666",
    backgroundColor = "rgba(255, 255, 255, 0.9)",
    overlay = true,
    textStyle = {},
    containerStyle = {}
}) {
    const animatedValue = useRef(new Animated.Value(0)).current
    const pulseValue = useRef(new Animated.Value(1)).current
    const dotsAnimation = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0)
    ]).current

    useEffect(() => {
        if (visible) {
            if (type === 'pulse') {
                startPulseAnimation()
            } else if (type === 'dots') {
                startDotsAnimation()
            } else if (type === 'bars') {
                startBarsAnimation()
            }
        }
    }, [visible, type])

    const startPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseValue, {
                    toValue: 1.3,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseValue, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start()
    }

    const startDotsAnimation = () => {
        const animateDot = (dot, delay) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0,
                        duration: 400,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            )
        }

        Animated.parallel([
            animateDot(dotsAnimation[0], 0),
            animateDot(dotsAnimation[1], 200),
            animateDot(dotsAnimation[2], 400),
        ]).start()
    }

    const startBarsAnimation = () => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start()
    }

    const renderLoader = () => {
        switch (type) {
            case 'spinner':
                return <ActivityIndicator size={size} color={color} />

            case 'pulse':
                return (
                    <Animated.View
                        style={[
                            styles.pulseLoader,
                            {
                                backgroundColor: color,
                                transform: [{ scale: pulseValue }],
                            },
                        ]}
                    />
                )

            case 'dots':
                return (
                    <View style={styles.dotsContainer}>
                        {dotsAnimation.map((dot, index) => (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.dot,
                                    {
                                        backgroundColor: color,
                                        opacity: dot,
                                    },
                                ]}
                            />
                        ))}
                    </View>
                )

            case 'bars':
                return (
                    <View style={styles.barsContainer}>
                        {[...Array(4)].map((_, index) => (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.bar,
                                    {
                                        backgroundColor: color,
                                        transform: [
                                            {
                                                scaleY: animatedValue.interpolate({
                                                    inputRange: [0, 0.25, 0.5, 0.75, 1],
                                                    outputRange: [
                                                        index === 0 ? 1 : 0.3,
                                                        index === 1 ? 1 : 0.3,
                                                        index === 2 ? 1 : 0.3,
                                                        index === 3 ? 1 : 0.3,
                                                        index === 0 ? 1 : 0.3,
                                                    ],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            />
                        ))}
                    </View>
                )

            default:
                return <ActivityIndicator size={size} color={color} />
        }
    }

    if (!visible) return null

    const containerStyles = [
        overlay ? styles.overlay : styles.inline,
        { backgroundColor: overlay ? backgroundColor : 'transparent' },
        containerStyle
    ]

    return (
        <View style={containerStyles}>
            <View style={styles.loaderContent}>
                {renderLoader()}
                {text ? (
                    <Text style={[styles.loadingText, { color: textColor }, textStyle]}>
                        {text}
                    </Text>
                ) : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    inline: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loaderContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 10,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    pulseLoader: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 3,
    },
    barsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
    },
    bar: {
        width: 4,
        height: 20,
        marginHorizontal: 2,
        borderRadius: 2,
    },
})