import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const GuestBanner = ({ onActivatePress }) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    {/* Icon and Text */}
                    <View style={styles.leftSection}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="warning-outline" size={20} color="#FF6B6B" />
                        </View>
                        <View style={styles.textSection}>
                            <Text style={styles.title}>Your access is limited</Text>
                            <Text style={styles.description}>
                                Activate your card to unlock full access
                            </Text>
                        </View>
                    </View>

                    {/* Activate Button */}
                    <TouchableOpacity
                        style={styles.activateButton}
                        activeOpacity={0.8}
                        onPress={onActivatePress}
                    >
                        <Text style={styles.buttonText}>Activate</Text>
                        <Ionicons name="arrow-forward" size={14} color="#FF6B6B" />
                    </TouchableOpacity>
                </View>

                {/* Decorative Elements */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },
    gradient: {
        position: 'relative',
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textSection: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 2,
    },
    description: {
        fontSize: 11,
        color: '#FFF',
        opacity: 0.9,
        lineHeight: 14,
    },
    activateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FF6B6B',
        marginRight: 4,
    },
    decorativeCircle1: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: -15,
        left: -15,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
});

export default GuestBanner;