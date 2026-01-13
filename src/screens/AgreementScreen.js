import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Platform, Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width } = Dimensions.get('window')
const isSmallDevice = width < 375

export default function AgreementScreen({ navigation, route }) {
    const [isOver18, setIsOver18] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
    const { label } = route.params || {};

    const scaleAnim = useRef(new Animated.Value(1)).current

    const allChecked = isOver18 && acceptedTerms && acceptedPrivacy

    useEffect(() => {
        if (allChecked) {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start()
        }
    }, [allChecked])

    const handleAccept = () => {
        if (allChecked) {
            AsyncStorage.setItem('agreementAccepted', 'true');
            switch (label) {
                case 'signin':
                    navigation.navigate('Login');
                    break;
                case 'register':
                    navigation.navigate('Register');
                    break;
                case 'register_2':
                    navigation.navigate("Step7");
                    break;
                default:
                    break;
            }
        }
    }

    const handleTermsPress = () => {
        navigation?.navigate('TermsCondition')
    }

    const handlePrivacyPress = () => {
        navigation?.navigate('PrivacyPolicy')
    }

    return (
        <SafeAreaView style={styles.container} edges={[]}>
            {/* Gradient Header */}
            <LinearGradient
                colors={['#8B2C2E', '#C84B3A']}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation?.goBack()}
                        activeOpacity={0.7}
                    >
                        <View style={styles.backButtonCircle}>
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Agreement</Text>
                        <Text style={styles.headerSubtitle}>Please review and accept</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Title Card */}
                <View style={styles.titleCard}>
                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={['#8B2C2E', '#C84B3A']}
                            style={styles.iconGradient}
                        >
                            <Text style={styles.iconEmoji}>📄</Text>
                        </LinearGradient>
                    </View>
                    <Text style={styles.title}>Terms and Conditions</Text>
                    <View style={styles.titleUnderline} />
                </View>

                {/* Description Card */}
                <View style={styles.descriptionCard}>
                    <LinearGradient
                        colors={['#FFFFFF', '#F8F9FC']}
                        style={styles.descriptionGradient}
                    >
                        <View style={styles.descriptionHeader}>
                            <View style={styles.infoDot} />
                            <Text style={styles.descriptionTitle}>Important Information</Text>
                        </View>
                        <Text style={styles.description}>
                            By clicking Accept, I agree to the My Gas Motorista{' '}
                            <Text
                                style={styles.link}
                                onPress={handleTermsPress}
                            >
                                Terms and Conditions
                            </Text>
                            {' '}and to the processing of my personal data in accordance with the My Gas Petroleum Motorista Data{' '}
                            <Text
                                style={styles.link}
                                onPress={handlePrivacyPress}
                            >
                                Privacy Policy
                            </Text>
                            .
                        </Text>
                    </LinearGradient>
                </View>

                {/* Requirements Section */}
                <View style={styles.requirementsSection}>
                    <Text style={styles.requirementsTitle}>Please confirm the following:</Text>

                    {/* Checkboxes */}
                    <View style={styles.checkboxContainer}>
                        {/* Age Confirmation */}
                        <TouchableOpacity
                            style={styles.checkboxCard}
                            onPress={() => setIsOver18(!isOver18)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.checkboxRow}>
                                <View style={[styles.checkbox, isOver18 && styles.checkboxChecked]}>
                                    {isOver18 && (
                                        <LinearGradient
                                            colors={['#8B2C2E', '#C84B3A']}
                                            style={styles.checkboxGradient}
                                        >
                                            <Text style={styles.checkmark}>✓</Text>
                                        </LinearGradient>
                                    )}
                                </View>
                                <View style={styles.checkboxContent}>
                                    <Text style={styles.checkboxLabel}>Age Verification</Text>
                                    <Text style={styles.checkboxDescription}>
                                        I confirm that I am above 18 years old.
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Terms Acceptance */}
                        <TouchableOpacity
                            style={styles.checkboxCard}
                            onPress={() => setAcceptedTerms(!acceptedTerms)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.checkboxRow}>
                                <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                                    {acceptedTerms && (
                                        <LinearGradient
                                            colors={['#8B2C2E', '#C84B3A']}
                                            style={styles.checkboxGradient}
                                        >
                                            <Text style={styles.checkmark}>✓</Text>
                                        </LinearGradient>
                                    )}
                                </View>
                                <View style={styles.checkboxContent}>
                                    <Text style={styles.checkboxLabel}>Terms & Conditions</Text>
                                    <Text style={styles.checkboxDescription}>
                                        I have read and accept the My Gas Motorista{' '}
                                        <Text
                                            style={styles.inlineLink}
                                            onPress={(e) => {
                                                e.stopPropagation()
                                                handleTermsPress()
                                            }}
                                        >
                                            Terms and Conditions
                                        </Text>
                                        .
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Privacy Acceptance */}
                        <TouchableOpacity
                            style={styles.checkboxCard}
                            onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.checkboxRow}>
                                <View style={[styles.checkbox, acceptedPrivacy && styles.checkboxChecked]}>
                                    {acceptedPrivacy && (
                                        <LinearGradient
                                            colors={['#8B2C2E', '#C84B3A']}
                                            style={styles.checkboxGradient}
                                        >
                                            <Text style={styles.checkmark}>✓</Text>
                                        </LinearGradient>
                                    )}
                                </View>
                                <View style={styles.checkboxContent}>
                                    <Text style={styles.checkboxLabel}>Privacy Policy</Text>
                                    <Text style={styles.checkboxDescription}>
                                        I have read and accept the My Gas Motorista Data{' '}
                                        <Text
                                            style={styles.inlineLink}
                                            onPress={(e) => {
                                                e.stopPropagation()
                                                handlePrivacyPress()
                                            }}
                                        >
                                            Privacy Policy
                                        </Text>
                                        .
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, {
                            width: `${((isOver18 ? 1 : 0) + (acceptedTerms ? 1 : 0) + (acceptedPrivacy ? 1 : 0)) / 3 * 100}%`
                        }]}>
                            <LinearGradient
                                colors={['#8B2C2E', '#C84B3A']}
                                style={styles.progressGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                        </View>
                    </View>
                    <Text style={styles.progressText}>
                        {((isOver18 ? 1 : 0) + (acceptedTerms ? 1 : 0) + (acceptedPrivacy ? 1 : 0))} of 3 requirements completed
                    </Text>
                </View>
            </ScrollView>

            {/* Accept Button */}
            <View style={styles.buttonContainer}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        style={[styles.acceptButton]}
                        onPress={handleAccept}
                        disabled={!allChecked}
                        activeOpacity={0.8}
                    >
                        {allChecked ? (
                            <LinearGradient
                                colors={['#8B2C2E', '#C84B3A', '#E8895E']}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.acceptButtonText}>Accept & Continue</Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.acceptButtonIcon} />
                            </LinearGradient>
                        ) : (
                            <View style={styles.disabledButton}>
                                <Text style={styles.acceptButtonTextDisabled}>Accept & Continue</Text>
                                <Ionicons name="arrow-forward" size={20} color="#A0AEC0" style={styles.acceptButtonIcon} />
                            </View>
                        )}
                    </TouchableOpacity>
                </Animated.View>

                {!allChecked && (
                    <Text style={styles.helperText}>
                        Please complete all requirements to continue
                    </Text>
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        shadowColor: '#8B2C2E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    backButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#FFFFFF',
        opacity: 0.9,
        marginTop: 2,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    titleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainer: {
        marginBottom: 16,
    },
    iconGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#8B2C2E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    iconEmoji: {
        fontSize: 32,
    },
    title: {
        fontSize: isSmallDevice ? 22 : 24,
        fontWeight: '700',
        color: '#1A1D29',
        textAlign: 'center',
        marginBottom: 8,
    },
    titleUnderline: {
        width: 60,
        height: 3,
        backgroundColor: '#8B2C2E',
        borderRadius: 2,
    },
    descriptionCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    descriptionGradient: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    descriptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#8B2C2E',
        marginRight: 8,
    },
    descriptionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1D29',
    },
    description: {
        fontSize: 14,
        color: '#4A5568',
        lineHeight: 22,
    },
    link: {
        color: '#8B2C2E',
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    requirementsSection: {
        marginBottom: 24,
    },
    requirementsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1D29',
        marginBottom: 16,
        paddingLeft: 4,
    },
    checkboxContainer: {
        gap: 12,
    },
    checkboxCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 28,
        height: 28,
        borderWidth: 2,
        borderColor: '#CBD5E0',
        borderRadius: 8,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    checkboxChecked: {
        borderColor: '#8B2C2E',
    },
    checkboxGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '900',
    },
    checkboxContent: {
        flex: 1,
    },
    checkboxLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1D29',
        marginBottom: 4,
    },
    checkboxDescription: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 20,
    },
    inlineLink: {
        color: '#8B2C2E',
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    progressContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E9ECEF',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
    },
    progressGradient: {
        height: '100%',
        width: '100%',
    },
    progressText: {
        fontSize: 12,
        color: '#64748B',
        textAlign: 'center',
        fontWeight: '600',
    },
    buttonContainer: {
        padding: 20,
        paddingTop: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    acceptButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#8B2C2E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonGradient: {
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    acceptButtonText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    acceptButtonIcon: {
        marginLeft: 8,
    },
    disabledButton: {
        backgroundColor: '#E9ECEF',
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
    },
    acceptButtonTextDisabled: {
        fontSize: 17,
        fontWeight: '800',
        color: '#A0AEC0',
        letterSpacing: 0.5,
    },
    helperText: {
        fontSize: 12,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 12,
        fontWeight: '500',
    },
})