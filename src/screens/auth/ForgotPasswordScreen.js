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
    Dimensions
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: phone, 2: code, 3: success
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

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

        // Replace with your actual API call
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
            setCountdown(60);
        }, 1500);
    };

    const handleVerifyCode = async () => {
        setError('');

        if (!verificationCode.trim()) {
            setError('Please enter the verification code');
            return;
        }

        if (verificationCode.length < 4) {
            setError('Please enter a valid verification code');
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

        // Replace with your actual API call
        setTimeout(() => {
            setIsLoading(false);
            setStep(3);
        }, 1500);
    };

    const handleResendCode = () => {
        if (countdown === 0) {
            setCountdown(60);
            // Add your resend API call here
        }
    };

    // Step 3: Success Screen
    if (step === 3) {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
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
                        <View style={styles.successIcon}>
                            <View style={styles.checkmarkCircle}>
                                <Text style={styles.checkmark}>✓</Text>
                            </View>
                        </View>

                        {/* Success Message */}
                        <Text style={styles.title}>Password Reset Successful!</Text>
                        <Text style={styles.description}>
                            Your password has been successfully reset. You can now log in with your new password.
                        </Text>

                        {/* Back to Login */}
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.resetButtonText}>Back to Login</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    // Step 2: Verification Code & New Password
    if (step === 2) {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
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
                        {/* Back Button */}
                        <TouchableOpacity
                            style={styles.backIconButton}
                            onPress={() => setStep(1)}
                        >
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>

                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.lockIcon}>🔐</Text>
                            </View>
                            <Text style={styles.title}>Enter Verification Code</Text>
                            <Text style={styles.description}>
                                We've sent a verification code to{'\n'}
                                <Text style={styles.phoneTextInline}>{phoneNumber}</Text>
                            </Text>
                        </View>

                        {/* Verification Code Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Verification Code</Text>
                            <View style={[styles.inputWrapper, error && !newPassword && styles.inputWrapperError]}>
                                <Text style={styles.inputIcon}>🔢</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter 6-digit code"
                                    placeholderTextColor="#A0A0A0"
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
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>New Password</Text>
                            <View style={[styles.inputWrapper, error && newPassword.length > 0 && styles.inputWrapperError]}>
                                <Text style={styles.inputIcon}>🔒</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter new password"
                                    placeholderTextColor="#A0A0A0"
                                    value={newPassword}
                                    onChangeText={(text) => {
                                        setNewPassword(text);
                                        setError('');
                                    }}
                                    secureTextEntry
                                    editable={!isLoading}
                                />
                            </View>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={[styles.inputWrapper, error && confirmPassword.length > 0 && styles.inputWrapperError]}>
                                <Text style={styles.inputIcon}>🔒</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm new password"
                                    placeholderTextColor="#A0A0A0"
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        setError('');
                                    }}
                                    secureTextEntry
                                    editable={!isLoading}
                                />
                            </View>
                            {error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : null}
                        </View>

                        {/* Verify Button */}
                        <TouchableOpacity
                            style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
                            onPress={handleVerifyCode}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.resetButtonText}>Reset Password</Text>
                            )}
                        </TouchableOpacity>

                        {/* Resend Code */}
                        <TouchableOpacity
                            style={styles.loginLink}
                            onPress={handleResendCode}
                            disabled={countdown > 0}
                        >
                            <Text style={[
                                styles.loginLinkText,
                                countdown === 0 && styles.loginLinkBold
                            ]}>
                                {countdown > 0
                                    ? `Resend code in ${countdown}s`
                                    : 'Resend verification code'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    // Step 1: Phone Number Input
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
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
                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backIconButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.lockIcon}>🔐</Text>
                        </View>
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.description}>
                            No worries! Enter your phone number and we'll send you a verification code to reset your password.
                        </Text>
                    </View>

                    {/* Phone Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
                            <Text style={styles.inputIcon}>📱</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your phone number"
                                placeholderTextColor="#A0A0A0"
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
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}
                    </View>

                    {/* Send Code Button */}
                    <TouchableOpacity
                        style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
                        onPress={handleSendCode}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.resetButtonText}>Send Verification Code</Text>
                        )}
                    </TouchableOpacity>

                    {/* Back to Login Link */}
                    <TouchableOpacity
                        style={styles.loginLink}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.loginLinkText}>
                            Remember your password?{' '}
                            <Text style={styles.loginLinkBold}>Log In</Text>
                        </Text>
                    </TouchableOpacity>

                    {/* Security Note */}
                    <View style={styles.securityNote}>
                        <Text style={styles.securityIcon}>🛡️</Text>
                        <Text style={styles.securityText}>
                            Your security is our priority. The verification code will expire in 10 minutes.
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 40,
    },
    content: {
        flex: 1,
        maxWidth: 500,
        width: '100%',
        alignSelf: 'center',
    },
    backIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
    },
    backIcon: {
        fontSize: 24,
        color: '#1A1A1A',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
    },
    lockIcon: {
        fontSize: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    description: {
        fontSize: 15,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    phoneTextInline: {
        color: '#fe0002',
        fontWeight: '600',
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 10,
        letterSpacing: 0.2,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        paddingHorizontal: 16,
        height: 56,
    },
    inputWrapperError: {
        borderColor: '#fe0002',
        borderWidth: 2,
        backgroundColor: '#FFF5F5',
    },
    inputIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '400',
    },
    errorText: {
        color: '#fe0002',
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
        fontWeight: '500',
    },
    resetButton: {
        backgroundColor: '#fe0002',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#fe0002',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    resetButtonDisabled: {
        backgroundColor: '#FFA5A6',
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    loginLink: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    loginLinkText: {
        fontSize: 15,
        color: '#666666',
        fontWeight: '400',
    },
    loginLinkBold: {
        color: '#fe0002',
        fontWeight: '700',
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F9FF',
        borderRadius: 12,
        padding: 16,
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#E0F2FE',
    },
    securityIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    securityText: {
        flex: 1,
        fontSize: 13,
        color: '#0369A1',
        lineHeight: 18,
    },
    // Success Screen Styles
    successIcon: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 32,
    },
    checkmarkCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    checkmark: {
        fontSize: 50,
        color: '#fff',
        fontWeight: '700',
    },
});