import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
    ActivityIndicator,
    Dimensions,
    StatusBar
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;
const isLargeDevice = width >= 414;

export default function ForgotPasswordScreen({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: phone, 2: code, 3: success
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            })
        ]).start();
    }, [step]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^\d{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    const handleSendCode = async () => {
        setError('');

        if (!phoneNumber.trim()) {
            setError('Please enter your phone number');
            return;
        }

        if (!validatePhoneNumber(phoneNumber)) {
            setError('Please enter a valid phone number (at least 10 digits)');
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
            setCountdown(60);
            fadeAnim.setValue(0);
            slideAnim.setValue(30);
        }, 1500);
    };

    const handleVerifyCode = async () => {
        setError('');

        if (!verificationCode.trim()) {
            setError('Please enter the verification code');
            return;
        }

        if (verificationCode.length < 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        if (!newPassword.trim()) {
            setError('Please enter a new password');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setStep(3);
            fadeAnim.setValue(0);
            slideAnim.setValue(30);
        }, 1500);
    };

    const handleResendCode = () => {
        if (countdown === 0) {
            setCountdown(60);
            // Add your resend API call here
        }
    };

    const handleBackPress = () => {
        if (step === 1) {
            navigation.goBack();
        } else {
            setStep(step - 1);
            fadeAnim.setValue(0);
            slideAnim.setValue(30);
        }
    };

    // Step 3: Success Screen
    if (step === 3) {
        return (
            <SafeAreaView style={styles.container} edges={[]}>
                <StatusBar barStyle="light-content" />
                <LinearGradient
                    colors={[
                        'rgba(139, 44, 46, 0.95)',
                        'rgba(200, 75, 58, 0.90)',
                        'rgba(232, 137, 94, 0.85)',
                    ]}
                    style={styles.gradient}
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.navigate('Login')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Animated.View
                            style={[
                                styles.content,
                                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                            ]}
                        >
                            {/* Success Icon */}
                            <View style={styles.successIconContainer}>
                                <View style={styles.successCircle}>
                                    <Ionicons name="checkmark-circle" size={120} color="#FFFFFF" />
                                </View>
                            </View>

                            {/* Success Message */}
                            <View style={styles.successContent}>
                                <Text style={styles.successTitle}>Password Reset{'\n'}Successful!</Text>
                                <View style={styles.successUnderline} />
                                <Text style={styles.successDescription}>
                                    Your password has been successfully reset. You can now sign in with your new password.
                                </Text>
                            </View>

                            {/* Back to Login Button */}
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={() => navigation.navigate('Login')}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#FFFFFF', '#F8F8F8']}
                                    style={styles.buttonGradient}
                                >
                                    <Text style={styles.primaryButtonText}>BACK TO SIGN IN</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </ScrollView>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    // Step 2: Verification Code & New Password
    if (step === 2) {
        return (
            <SafeAreaView style={styles.container} edges={[]}>
                <StatusBar barStyle="light-content" />
                <LinearGradient
                    colors={[
                        'rgba(139, 44, 46, 0.95)',
                        'rgba(200, 75, 58, 0.90)',
                        'rgba(232, 137, 94, 0.85)',
                    ]}
                    style={styles.gradient}
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBackPress}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Animated.View
                                style={[
                                    styles.content,
                                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                                ]}
                            >
                                {/* Header Section */}
                                <View style={styles.titleSection}>
                                    <View style={styles.iconWrapper}>
                                        <Ionicons name="shield-checkmark" size={48} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.mainTitle}>VERIFY & RESET</Text>
                                    <View style={styles.underline} />
                                    <Text style={styles.subtitle}>
                                        Enter the code sent to{'\n'}
                                        <Text style={styles.phoneHighlight}>{phoneNumber}</Text>
                                    </Text>
                                </View>

                                {/* Form Card */}
                                <View style={styles.formCard}>
                                    {/* Verification Code Input */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Verification Code</Text>
                                        <View style={[styles.inputWrapper, error && !newPassword && styles.inputWrapperError]}>
                                            <Ionicons name="keypad-outline" size={20} color="#8B2C2E" style={styles.inputIconLeft} />
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder="Enter 6-digit code"
                                                placeholderTextColor="#999"
                                                value={verificationCode}
                                                onChangeText={(text) => {
                                                    setVerificationCode(text);
                                                    setError('');
                                                }}
                                                keyboardType="number-pad"
                                                maxLength={6}
                                                editable={!isLoading}
                                            />
                                        </View>
                                    </View>

                                    {/* New Password Input */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>New Password</Text>
                                        <View style={[styles.inputWrapper, error && newPassword.length > 0 && styles.inputWrapperError]}>
                                            <Ionicons name="lock-closed-outline" size={20} color="#8B2C2E" style={styles.inputIconLeft} />
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder="Enter new password"
                                                placeholderTextColor="#999"
                                                value={newPassword}
                                                onChangeText={(text) => {
                                                    setNewPassword(text);
                                                    setError('');
                                                }}
                                                secureTextEntry={!showPassword}
                                                editable={!isLoading}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowPassword(!showPassword)}
                                                style={styles.eyeIcon}
                                            >
                                                <Ionicons
                                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                                    size={20}
                                                    color="#8B2C2E"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Confirm Password Input */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Confirm Password</Text>
                                        <View style={[styles.inputWrapper, error && confirmPassword.length > 0 && styles.inputWrapperError]}>
                                            <Ionicons name="lock-closed-outline" size={20} color="#8B2C2E" style={styles.inputIconLeft} />
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder="Confirm new password"
                                                placeholderTextColor="#999"
                                                value={confirmPassword}
                                                onChangeText={(text) => {
                                                    setConfirmPassword(text);
                                                    setError('');
                                                }}
                                                secureTextEntry={!showConfirmPassword}
                                                editable={!isLoading}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={styles.eyeIcon}
                                            >
                                                <Ionicons
                                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                                    size={20}
                                                    color="#8B2C2E"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        {error ? (
                                            <View style={styles.errorContainer}>
                                                <Ionicons name="alert-circle" size={16} color="#8B2C2E" />
                                                <Text style={styles.errorText}>{error}</Text>
                                            </View>
                                        ) : null}
                                    </View>

                                    {/* Reset Password Button */}
                                    <TouchableOpacity
                                        style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                                        onPress={handleVerifyCode}
                                        disabled={isLoading}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#FFFFFF', '#F8F8F8']}
                                            style={styles.buttonGradient}
                                        >
                                            {isLoading ? (
                                                <ActivityIndicator color="#8B2C2E" />
                                            ) : (
                                                <Text style={styles.primaryButtonText}>RESET PASSWORD</Text>
                                            )}
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    {/* Resend Code */}
                                    <TouchableOpacity
                                        style={styles.resendContainer}
                                        onPress={handleResendCode}
                                        disabled={countdown > 0}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name="refresh-outline"
                                            size={18}
                                            color={countdown > 0 ? '#FFFFFF80' : '#FFFFFF'}
                                        />
                                        <Text style={[
                                            styles.resendText,
                                            countdown > 0 && styles.resendTextDisabled
                                        ]}>
                                            {countdown > 0
                                                ? `Resend code in ${countdown}s`
                                                : 'Resend verification code'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </LinearGradient>
            </SafeAreaView>
        );
    }

    // Step 1: Phone Number Input
    return (
        <SafeAreaView style={styles.container} edges={[]}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[
                    'rgba(139, 44, 46, 0.95)',
                    'rgba(200, 75, 58, 0.90)',
                    'rgba(232, 137, 94, 0.85)',
                ]}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBackPress}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Animated.View
                            style={[
                                styles.content,
                                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                            ]}
                        >
                            {/* Header Section */}
                            <View style={styles.titleSection}>
                                <View style={styles.iconWrapper}>
                                    <Ionicons name="lock-closed" size={48} color="#FFFFFF" />
                                </View>
                                <Text style={styles.mainTitle}>FORGOT{'\n'}PASSWORD?</Text>
                                <View style={styles.underline} />
                                <Text style={styles.subtitle}>
                                    Don't worry! Enter your phone number and we'll send you a verification code.
                                </Text>
                            </View>

                            {/* Form Card */}
                            <View style={styles.formCard}>
                                {/* Phone Input */}
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Phone Number</Text>
                                    <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
                                        <Ionicons name="call-outline" size={20} color="#8B2C2E" style={styles.inputIconLeft} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="Enter your phone number"
                                            placeholderTextColor="#999"
                                            value={phoneNumber}
                                            onChangeText={(text) => {
                                                setPhoneNumber(text);
                                                setError('');
                                            }}
                                            keyboardType="phone-pad"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            editable={!isLoading}
                                        />
                                    </View>
                                    {error ? (
                                        <View style={styles.errorContainer}>
                                            <Ionicons name="alert-circle" size={16} color="#8B2C2E" />
                                            <Text style={styles.errorText}>{error}</Text>
                                        </View>
                                    ) : null}
                                </View>

                                {/* Send Code Button */}
                                <TouchableOpacity
                                    style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                                    onPress={handleSendCode}
                                    disabled={isLoading}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#FFFFFF', '#F8F8F8']}
                                        style={styles.buttonGradient}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#8B2C2E" />
                                        ) : (
                                            <Text style={styles.primaryButtonText}>SEND VERIFICATION CODE</Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/* Back to Login Link */}
                                <TouchableOpacity
                                    style={styles.linkContainer}
                                    onPress={() => navigation.goBack()}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.linkText}>
                                        Remember your password?{' '}
                                        <Text style={styles.linkBold}>Sign In</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Security Note */}
                            <View style={styles.securityNote}>
                                <Ionicons name="shield-checkmark-outline" size={24} color="#FFFFFF" />
                                <Text style={styles.securityText}>
                                    Your security is our priority. The verification code will expire in 10 minutes.
                                </Text>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8B2C2E',
    },
    gradient: {
        flex: 1,
    },
    header: {
        paddingHorizontal: isSmallDevice ? 20 : 28,
        paddingTop: Platform.OS === 'android' ? 20 : 10,
        // paddingBottom: 10,
        paddingTop: 50
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: isSmallDevice ? 20 : 28,
        paddingBottom: 30,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: isSmallDevice ? 30 : 40,
    },
    iconWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 30,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    mainTitle: {
        fontSize: isSmallDevice ? 32 : isLargeDevice ? 38 : 36,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
        textAlign: 'center',
        lineHeight: isSmallDevice ? 38 : isLargeDevice ? 44 : 42,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        marginBottom: 12,
    },
    underline: {
        width: 80,
        height: 4,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
        borderRadius: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    subtitle: {
        fontSize: isSmallDevice ? 14 : 16,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: isSmallDevice ? 20 : 24,
        letterSpacing: 0.3,
        opacity: 0.95,
        paddingHorizontal: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    phoneHighlight: {
        fontWeight: '700',
        color: '#FFFFFF',
    },
    formCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: 24,
        padding: isSmallDevice ? 20 : 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        paddingHorizontal: 14,
        height: 54,
    },
    inputWrapperError: {
        borderColor: '#8B2C2E',
        backgroundColor: '#FFF5F5',
    },
    inputIconLeft: {
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '400',
    },
    eyeIcon: {
        padding: 4,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        paddingLeft: 4,
    },
    errorText: {
        color: '#8B2C2E',
        fontSize: 12,
        marginLeft: 6,
        fontWeight: '600',
        flex: 1,
    },
    primaryButton: {
        borderRadius: 12,
        shadowColor: '#8B2C2E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        overflow: 'hidden',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonGradient: {
        paddingVertical: isSmallDevice ? 16 : 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    primaryButtonText: {
        fontSize: isSmallDevice ? 15 : 16,
        fontWeight: '900',
        color: '#8B2C2E',
        letterSpacing: 1.5,
    },
    linkContainer: {
        alignItems: 'center',
        paddingVertical: 16,
        marginTop: 8,
    },
    linkText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '400',
    },
    linkBold: {
        color: '#8B2C2E',
        fontWeight: '700',
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginTop: 8,
    },
    resendText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 8,
    },
    resendTextDisabled: {
        opacity: 0.5,
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 16,
        padding: 16,
        marginTop: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    securityText: {
        flex: 1,
        fontSize: 13,
        color: '#FFFFFF',
        lineHeight: 19,
        marginLeft: 12,
        fontWeight: '400',
        opacity: 0.95,
    },
    // Success Screen Styles
    successIconContainer: {
        alignItems: 'center',
        marginTop: isSmallDevice ? 40 : 60,
        marginBottom: 40,
    },
    successCircle: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    successContent: {
        alignItems: 'center',
        marginBottom: 50,
    },
    successTitle: {
        fontSize: isSmallDevice ? 28 : isLargeDevice ? 34 : 32,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
        textAlign: 'center',
        lineHeight: isSmallDevice ? 34 : isLargeDevice ? 40 : 38,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        marginBottom: 16,
    },
    successUnderline: {
        width: 100,
        height: 4,
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
        borderRadius: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    successDescription: {
        fontSize: isSmallDevice ? 15 : 17,
        fontWeight: '400',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: isSmallDevice ? 22 : 26,
        letterSpacing: 0.3,
        opacity: 0.95,
        paddingHorizontal: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});