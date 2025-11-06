import { StyleSheet, Text, View, Dimensions, StatusBar, Image } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ServerBusy() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#F54927" />

            {/* Background Gradient */}
            <LinearGradient
                colors={['#F54927', '#FF6B4A', '#F54927']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <View style={styles.content}>
                {/* Icon Container */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <View style={styles.toolIcon}>
                            <View style={styles.wrench} />
                            <View style={styles.wrenchHandle} />
                        </View>
                    </View>
                    {/* Animated dots */}
                    <View style={styles.dotsContainer}>
                        <View style={[styles.dot, styles.dot1]} />
                        <View style={[styles.dot, styles.dot2]} />
                        <View style={[styles.dot, styles.dot3]} />
                    </View>
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>We'll Be Right Back</Text>
                    <Text style={styles.subtitle}>Server is Busy</Text>

                    <View style={styles.divider} />

                    <Text style={styles.description}>
                        We're currently performing scheduled maintenance to improve your experience.
                        Our team is working hard to get everything back online as soon as possible.
                    </Text>

                    <View style={styles.infoBox}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoDot} />
                            <Text style={styles.infoText}>Expected Duration: 2-4 hours</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={styles.infoDot} />
                            <Text style={styles.infoText}>Started: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </View>
                    </View>

                    <Text style={styles.footerText}>
                        Thank you for your patience and understanding
                    </Text>
                </View>
            </View>

            {/* Bottom Wave */}
            <View style={styles.waveContainer}>
                <View style={styles.wave} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F54927',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width > 768 ? 60 : 24,
        paddingVertical: 40,
    },
    iconContainer: {
        marginBottom: height > 700 ? 50 : 30,
        alignItems: 'center',
    },
    iconCircle: {
        width: width > 768 ? 160 : 120,
        height: width > 768 ? 160 : 120,
        borderRadius: width > 768 ? 80 : 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    toolIcon: {
        width: width > 768 ? 70 : 50,
        height: width > 768 ? 70 : 50,
        position: 'relative',
    },
    wrench: {
        width: width > 768 ? 40 : 30,
        height: width > 768 ? 40 : 30,
        borderWidth: 5,
        borderColor: '#FFFFFF',
        borderRadius: 8,
        transform: [{ rotate: '45deg' }],
        position: 'absolute',
        top: 0,
        left: width > 768 ? 15 : 10,
    },
    wrenchHandle: {
        width: width > 768 ? 12 : 8,
        height: width > 768 ? 50 : 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        position: 'absolute',
        bottom: -10,
        left: width > 768 ? 29 : 21,
        transform: [{ rotate: '45deg' }],
    },
    dotsContainer: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    textContainer: {
        alignItems: 'center',
        maxWidth: width > 768 ? 600 : width - 48,
    },
    title: {
        fontSize: width > 768 ? 42 : 32,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: width > 768 ? 20 : 16,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        marginBottom: 24,
    },
    divider: {
        width: 60,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 2,
        marginBottom: 24,
    },
    description: {
        fontSize: width > 768 ? 16 : 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: width > 768 ? 26 : 22,
        marginBottom: 32,
        paddingHorizontal: width > 768 ? 0 : 12,
    },
    infoBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        padding: width > 768 ? 24 : 20,
        marginBottom: 32,
        width: '100%',
        maxWidth: width > 768 ? 400 : '100%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        marginRight: 12,
    },
    infoText: {
        fontSize: width > 768 ? 15 : 14,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    footerText: {
        fontSize: width > 768 ? 14 : 12,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    waveContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        overflow: 'hidden',
    },
    wave: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
    },
});