import React from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    StyleSheet,
    Dimensions,
    Platform,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '../components/Navbar';

const { width } = Dimensions.get('window');

const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768;

const getResponsiveValue = (small, medium, tablet) => {
    if (isSmallDevice) return small;
    if (isMediumDevice) return medium;
    return tablet;
};

export default function CommingSoonScreen({ navigation, route }) {
    const title = route?.params?.title || "Coming Soon";
    const message = route?.params?.message || "This feature is currently under development and will be available soon.";

    return (
        <View style={styles.container}>
            {/* Header */}
            <ImageBackground
                resizeMode="stretch"
                source={require('../../assets/mygas-header.jpeg')}
                style={styles.header}
            >
                <LinearGradient
                    colors={['rgba(249, 250, 141, 0.95)', 'rgba(249, 250, 141, 0.7)', 'transparent']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.headerGradient}
                />

                <Image
                    source={require('../../assets/mygas_logo.png')}
                    style={styles.logo}
                />

                <View style={styles.navbarContainer}>
                    <Navbar hideBack={true} />
                </View>
            </ImageBackground>

            {/* Content */}
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="time-outline" size={getResponsiveValue(48, 56, 64)} color="#F59E0B" />
                        </View>
                    </View>

                    {/* Title & Message */}
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
                        <Text style={styles.infoText}>
                            We'll notify you when this feature becomes available
                        </Text>
                    </View>

                    {/* Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        height: getResponsiveValue(120, 140, 160),
        width: '100%',
    },
    headerGradient: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    logo: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [
            { translateX: getResponsiveValue(-30, -35, -40) },
            { translateY: getResponsiveValue(-30, -35, -40) }
        ],
        width: getResponsiveValue(60, 70, 80),
        height: getResponsiveValue(60, 70, 80),
        resizeMode: 'contain',
        zIndex: 2,
    },
    navbarContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 3,
    },
    scrollContainer: {
        flex: 1,
        marginTop: -20,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: getResponsiveValue(20, 24, 28),
        borderTopRightRadius: getResponsiveValue(20, 24, 28),
        paddingHorizontal: getResponsiveValue(24, 32, 40),
        paddingTop: getResponsiveValue(40, 48, 56),
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: getResponsiveValue(24, 28, 32),
    },
    iconCircle: {
        width: getResponsiveValue(96, 112, 128),
        height: getResponsiveValue(96, 112, 128),
        borderRadius: getResponsiveValue(48, 56, 64),
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#F59E0B',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    title: {
        fontSize: getResponsiveValue(24, 28, 32),
        fontWeight: '700',
        color: '#111827',
        marginBottom: getResponsiveValue(12, 14, 16),
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    message: {
        fontSize: getResponsiveValue(14, 15, 16),
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: getResponsiveValue(32, 36, 40),
        lineHeight: getResponsiveValue(20, 22, 24),
        paddingHorizontal: getResponsiveValue(0, 16, 32),
    },
    infoCard: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: getResponsiveValue(12, 14, 16),
        padding: getResponsiveValue(16, 18, 20),
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveValue(12, 14, 16),
        marginBottom: getResponsiveValue(32, 36, 40),
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    infoText: {
        flex: 1,
        fontSize: getResponsiveValue(13, 14, 15),
        color: '#6B7280',
        lineHeight: getResponsiveValue(18, 20, 22),
    },
    button: {
        width: '100%',
        backgroundColor: '#EF4444',
        borderRadius: getResponsiveValue(10, 12, 14),
        paddingVertical: getResponsiveValue(14, 16, 18),
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#EF4444',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    buttonText: {
        fontSize: getResponsiveValue(15, 16, 17),
        fontWeight: '600',
        color: '#FFFFFF',
    },
});