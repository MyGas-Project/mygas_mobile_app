import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ImageBackground,
    Alert,
    Keyboard,
    Dimensions,
    StyleSheet,
    StatusBar,
    TouchableWithoutFeedback,
} from "react-native";
import React, { useContext, useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';
import { AUTH_URL, processResponse } from "../../config";

const { width, height } = Dimensions.get('window');

// Responsive sizing helper
const isSmallDevice = width < 375;
const isLargeDevice = width >= 414;

export default function OTPverification({ navigation, route }) {
    const { verifyCode, login } = useContext(AuthContext);

    // Get phone/email from route params
    const { data } = route.params;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Refs for each input
    const inputRefs = useRef([]);

    useEffect(() => {
        // Start countdown timer
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleOtpChange = (value, index) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // Handle backspace
        if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = async () => {
        const otpCode = otp.join("");

        if (otpCode.length !== 6) {
            setError("Please enter the complete 6-digit code");
            return;
        }

        Keyboard.dismiss();

        try {
            setIsLoading(true);

            const res = await verifyCode(data, otpCode);
            if (res.statusCode !== 200 && res.statusCode !== 201) {
                setError(res.data.message);
                return;
            } else {
                setError("");
                const card_login = true;
                Alert.alert(
                    "Success",
                    "OTP verified successfully!",
                    [
                        {
                            text: "OK",
                            style: "default",
                            onPress: async () => {
                                await login(data.phone_number, "12345678", card_login);
                            }
                        }
                    ]
                );
            }

        } catch (error) {
            setError(error.message || "Invalid OTP. Please try again.");
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        try {
            setIsLoading(true);

            const card_login = true;
            fetch(`${AUTH_URL}resent-otp-code`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    phone_number: data.phone_number,
                    card_login: card_login
                })
            })
                .then(processResponse)
                .then((res) => {
                    const { statusCode, data } = res;
                    if (statusCode == 201 || statusCode == 200) {
                        Alert.alert(
                            "OTP Sent",
                            "A new verification code has been sent to your phone number",
                            [{ text: "OK", style: "default" }]
                        );
                    }
                })
                .catch((err) => {
                    Alert("Error", "Failed to resend OTP. Please try again.");
                    console.log("resent-otp-code error: ", err);
                });
            setTimer(60);
            setCanResend(false);
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();

            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (error) {
            Alert.alert(
                "Error",
                error.message || "Failed to resend OTP. Please try again.",
                [{ text: "OK", style: "default" }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const maskContact = (contact) => {
        if (!contact) return "";

        const cleanNumber = contact.replace(/\D/g, "");
        const visible = cleanNumber.slice(-4);

        if (cleanNumber.startsWith("63") && cleanNumber.length >= 12) {
            return `+63 *** *** ${visible}`;
        } else if (cleanNumber.length >= 10) {
            return `*** *** ${visible}`;
        }
        return `*** *** ${visible}`;
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <ImageBackground
                source={require('../../../assets/office.jpg')}
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
                        <KeyboardAvoidingView
                            style={styles.keyboardView}
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            keyboardVerticalOffset={0}
                        >
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <ScrollView
                                    contentContainerStyle={styles.scrollContent}
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                    bounces={false}
                                >
                                    <View style={styles.content}>
                                        {/* Header Section */}
                                        <View style={styles.headerSection}>
                                            {/* Back Button */}
                                            <View style={styles.logoRow}>
                                                <View style={styles.logoWrapper}>
                                                    <Image
                                                        source={require('../../../assets/heart_logo.png')}
                                                        style={styles.logo}
                                                        resizeMode='contain'
                                                    />
                                                </View>
                                                <View style={styles.logoTextContainer}>
                                                    <Text style={styles.logoMainText}>MY GAS</Text>
                                                    <Text style={styles.logoSubText}>MOTORISTA APP</Text>
                                                </View>
                                            </View>

                                            <View style={styles.titleContainer}>
                                                <Text style={styles.welcomeText}>VERIFY OTP</Text>
                                                <View style={styles.underline} />
                                            </View>

                                            <Text style={styles.subtitleText}>
                                                Enter the 6-digit code sent to
                                            </Text>
                                            <Text style={styles.contactText}>
                                                {maskContact(data.phone_number)}
                                            </Text>
                                        </View>

                                        {/* OTP Visual Section */}
                                        <View style={styles.otpVisualSection}>
                                            <View style={styles.otpVisual}>
                                                <LinearGradient
                                                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    style={styles.otpGradient}
                                                >
                                                    <View style={styles.otpVisualContent}>
                                                        <View style={styles.otpIconContainer}>
                                                            <View style={styles.otpIconCircle}>
                                                                <Icon name="shield-checkmark" size={48} color="#8B2C2E" />
                                                            </View>
                                                        </View>

                                                        <Text style={styles.otpVisualTitle}>Verification Code</Text>
                                                        <Text style={styles.otpVisualSubtitle}>
                                                            Please check your messages
                                                        </Text>

                                                        {!canResend ? (
                                                            <View style={styles.timerVisual}>
                                                                <Icon name="time-outline" size={20} color="#8B2C2E" />
                                                                <Text style={styles.timerVisualText}>
                                                                    {formatTime(timer)}
                                                                </Text>
                                                            </View>
                                                        ) : (
                                                            <View style={styles.timerVisual}>
                                                                <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                                                                <Text style={[styles.timerVisualText, { color: '#4CAF50' }]}>
                                                                    Ready to resend
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                </LinearGradient>
                                            </View>
                                        </View>

                                        {/* Form Section */}
                                        <View style={styles.formSection}>
                                            {/* OTP Input Boxes */}
                                            <View style={styles.otpInputGroup}>
                                                <Text style={styles.inputLabel}>Enter OTP Code</Text>
                                                <View style={styles.otpContainer}>
                                                    {otp.map((digit, index) => (
                                                        <View
                                                            key={index}
                                                            style={[
                                                                styles.otpBox,
                                                                digit && styles.otpBoxFilled,
                                                                error && styles.otpBoxError,
                                                            ]}
                                                        >
                                                            <TextInput
                                                                ref={(ref) => (inputRefs.current[index] = ref)}
                                                                style={styles.otpInput}
                                                                value={digit}
                                                                onChangeText={(value) => handleOtpChange(value, index)}
                                                                onKeyPress={(e) => handleKeyPress(e, index)}
                                                                keyboardType="number-pad"
                                                                maxLength={1}
                                                                selectTextOnFocus
                                                                editable={!isLoading}
                                                                autoFocus={index === 0}
                                                            />
                                                        </View>
                                                    ))}
                                                </View>

                                                {error && (
                                                    <Text style={styles.errorText}>{error}</Text>
                                                )}
                                            </View>

                                            {/* Resend Section */}
                                            <View style={styles.resendContainer}>
                                                {!canResend ? (
                                                    <Text style={styles.resendTimerText}>
                                                        Resend code in{" "}
                                                        <Text style={styles.resendTimerHighlight}>
                                                            {formatTime(timer)}
                                                        </Text>
                                                    </Text>
                                                ) : (
                                                    <TouchableOpacity
                                                        onPress={handleResendOTP}
                                                        disabled={isLoading}
                                                        activeOpacity={0.7}
                                                        style={styles.resendButton}
                                                    >
                                                        <Icon name="reload" size={18} color="#FFFFFF" />
                                                        <Text style={styles.resendButtonText}>
                                                            Resend OTP
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>

                                            {/* Verify Button */}
                                            <TouchableOpacity
                                                style={[
                                                    styles.verifyButton,
                                                    (isLoading || otp.join("").length !== 6) &&
                                                    styles.verifyButtonDisabled,
                                                ]}
                                                onPress={handleVerifyOTP}
                                                disabled={isLoading || otp.join("").length !== 6}
                                                activeOpacity={0.8}
                                            >
                                                <LinearGradient
                                                    colors={['#FFFFFF', '#F8F8F8']}
                                                    style={styles.buttonGradient}
                                                >
                                                    <Text style={styles.verifyButtonText}>
                                                        {isLoading ? "VERIFYING..." : "VERIFY & CONTINUE"}
                                                    </Text>
                                                </LinearGradient>
                                            </TouchableOpacity>

                                            {/* Info Section */}
                                            <View style={styles.infoSection}>
                                                <View style={styles.infoHeader}>
                                                    <Icon name="information-circle" size={20} color="#FFFFFF" />
                                                    <Text style={styles.infoTitle}>Didn't receive code?</Text>
                                                </View>
                                                <Text style={styles.infoText}>
                                                    • Check your spam/junk folder{"\n"}
                                                    • Make sure your phone number is correct{"\n"}
                                                    • Wait for the timer to resend
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

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
        paddingTop: 0,
        paddingBottom: 0,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 0,
    },
    content: {
        flex: 1,
        paddingHorizontal: isSmallDevice ? 20 : 28,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
        paddingBottom: 0,
    },
    headerSection: {
        marginBottom: isSmallDevice ? 20 : 28,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: isSmallDevice ? 20 : 28,
    },
    logoWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        padding: 8,
        marginRight: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    logo: {
        width: isSmallDevice ? 42 : 48,
        height: isSmallDevice ? 42 : 48,
    },
    logoTextContainer: {
        justifyContent: 'center',
    },
    logoMainText: {
        fontSize: isSmallDevice ? 22 : 26,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
        lineHeight: isSmallDevice ? 26 : 30,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    logoSubText: {
        fontSize: isSmallDevice ? 9 : 10,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 2,
        lineHeight: isSmallDevice ? 12 : 14,
        opacity: 0.95,
    },
    titleContainer: {
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: isSmallDevice ? 32 : isLargeDevice ? 42 : 38,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
        lineHeight: isSmallDevice ? 38 : isLargeDevice ? 48 : 44,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    underline: {
        width: 80,
        height: 4,
        backgroundColor: '#FFFFFF',
        marginTop: 8,
        borderRadius: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    subtitleText: {
        fontSize: isSmallDevice ? 14 : 16,
        fontWeight: '500',
        color: '#FFFFFF',
        lineHeight: isSmallDevice ? 20 : 24,
        letterSpacing: 0.3,
        opacity: 0.95,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        marginTop: 8,
    },
    contactText: {
        fontSize: isSmallDevice ? 16 : 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 1,
        marginTop: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    otpVisualSection: {
        marginVertical: isSmallDevice ? 10 : 0,
    },
    otpVisual: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    otpGradient: {
        padding: 24,
        minHeight: isSmallDevice ? 180 : 200,
    },
    otpVisualContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    otpIconContainer: {
        marginBottom: 16,
    },
    otpIconCircle: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(139, 44, 46, 0.1)',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    otpVisualTitle: {
        fontSize: isSmallDevice ? 20 : 24,
        fontWeight: '700',
        color: '#8B2C2E',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    otpVisualSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#8B2C2E',
        opacity: 0.7,
        marginBottom: 16,
    },
    timerVisual: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(139, 44, 46, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    timerVisualText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8B2C2E',
        marginLeft: 8,
        letterSpacing: 1,
    },
    formSection: {
        flex: 1,
    },
    otpInputGroup: {
        marginBottom: isSmallDevice ? 18 : 24,
    },
    inputLabel: {
        fontSize: isSmallDevice ? 13 : 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    otpBox: {
        width: (width - 56 - 40) / 6,
        height: isSmallDevice ? 52 : 58,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpBoxFilled: {
        borderColor: 'rgba(255, 255, 255, 0.5)',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    otpBoxError: {
        borderColor: '#FFE5E5',
        backgroundColor: 'rgba(255, 229, 229, 0.1)',
    },
    otpInput: {
        fontSize: isSmallDevice ? 22 : 26,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        width: '100%',
        height: '100%',
    },
    errorText: {
        color: '#FFE5E5',
        fontSize: 12,
        marginTop: 8,
        marginLeft: 4,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    resendContainer: {
        alignItems: 'center',
        marginBottom: 20,
        minHeight: 36,
        justifyContent: 'center',
    },
    resendTimerText: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        fontWeight: '500',
    },
    resendTimerHighlight: {
        fontWeight: '700',
        color: '#FFFFFF',
    },
    resendButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    resendButtonText: {
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '700',
        marginLeft: 8,
        letterSpacing: 0.5,
    },
    verifyButton: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
        overflow: 'hidden',
        marginTop: 8,
    },
    verifyButtonDisabled: {
        opacity: 0.5,
    },
    buttonGradient: {
        paddingVertical: isSmallDevice ? 17 : 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
    },
    verifyButtonText: {
        fontSize: isSmallDevice ? 16 : 18,
        fontWeight: '900',
        color: '#8B2C2E',
        letterSpacing: 2.5,
    },
    infoSection: {
        marginTop: 24,
        backgroundColor: '#8B2C2E',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FFFFFF',
        marginBottom: 0,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        marginLeft: 8,
        letterSpacing: 0.5,
    },
    infoText: {
        fontSize: 13,
        color: '#FFFFFF',
        opacity: 0.9,
        lineHeight: 20,
        letterSpacing: 0.2,
    },
});