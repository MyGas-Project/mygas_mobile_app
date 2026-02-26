import {
    View,
    Text,
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
import React, { useContext, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';
import { AUTH_URL, processResponse } from "../../config";
import { OtpInput } from "react-native-otp-entry";

const { width } = Dimensions.get('window');

const isSmallDevice = width < 375;
const isLargeDevice = width >= 414;

export default function OTPverification({ navigation, route }) {
    const { verifyCode, login } = useContext(AuthContext);
    const { data } = route?.params || {};

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
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

    const handleVerifyOTP = async () => {
        const otpCode = otp;
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
                    [{
                        text: "OK",
                        style: "default",
                        onPress: async () => {
                            await login(data.phone_number, "12345678", card_login);
                        }
                    }]
                );
            }
        } catch (err) {
            setError(err.message || "Invalid OTP. Please try again.");
            setOtp("");
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
                    const { statusCode } = res;
                    if (statusCode == 201 || statusCode == 200) {
                        Alert.alert(
                            "OTP Sent",
                            "A new verification code has been sent to your phone number",
                            [{ text: "OK", style: "default" }]
                        );
                    }
                })
                .catch((err) => {
                    Alert.alert("Error", "Failed to resend OTP. Please try again.");
                    console.log("resent-otp-code error: ", err);
                });

            setTimer(60);
            setCanResend(false);
            setOtp("");

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

        } catch (err) {
            Alert.alert(
                "Error",
                err.message || "Failed to resend OTP. Please try again.",
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

                                        {/* ── Logo Row ── */}
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

                                        {/* ── Title ── */}
                                        <View style={styles.titleContainer}>
                                            <Text style={styles.welcomeText}>VERIFY OTP</Text>
                                            <View style={styles.underline} />
                                        </View>

                                        {/* ── Slim Status Banner (replaces the big card) ── */}
                                        <View style={styles.statusBanner}>
                                            <View style={styles.bannerLeft}>
                                                <View style={styles.bannerIconCircle}>
                                                    <Icon name="shield-checkmark" size={22} color="#8B2C2E" />
                                                </View>
                                                <View>
                                                    <Text style={styles.bannerTitle}>Verification Code</Text>
                                                    <Text style={styles.bannerSub}>
                                                        Sent to{" "}
                                                        <Text style={styles.bannerContact}>
                                                            {maskContact(data?.phone_number)}
                                                        </Text>
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Timer pill */}
                                            <View style={[
                                                styles.timerPill,
                                                canResend && styles.timerPillReady
                                            ]}>
                                                <Icon
                                                    name={canResend ? "checkmark-circle" : "time-outline"}
                                                    size={14}
                                                    color={canResend ? "#4CAF50" : "#8B2C2E"}
                                                />
                                                <Text style={[
                                                    styles.timerPillText,
                                                    canResend && styles.timerPillTextReady
                                                ]}>
                                                    {canResend ? "Resend" : formatTime(timer)}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* ── OTP Input ── */}
                                        <View style={styles.otpSection}>
                                            <Text style={styles.inputLabel}>Enter 6-digit code</Text>
                                            <OtpInput
                                                numberOfDigits={6}
                                                onFilled={(text) => {
                                                    setOtp(text);
                                                    setError("");
                                                }}
                                                focusColor="rgba(255,255,255,0.9)"
                                                autoFocus={false}
                                                textInputProps={{
                                                    accessibilityLabel: "One-Time Password",
                                                }}
                                                textProps={{
                                                    accessibilityRole: "text",
                                                    accessibilityLabel: "OTP digit",
                                                    allowFontScaling: false,
                                                }}
                                                theme={{
                                                    containerStyle: styles.otpInputContainer,
                                                    pinCodeContainerStyle: styles.otpBox,
                                                    pinCodeTextStyle: styles.otpText,
                                                    focusedPinCodeContainerStyle: styles.otpBoxFocused,
                                                }}
                                            />
                                            {error ? (
                                                <Text style={styles.errorText}>{error}</Text>
                                            ) : null}
                                        </View>

                                        {/* ── Resend ── */}
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
                                                    <Icon name="reload" size={16} color="#FFFFFF" />
                                                    <Text style={styles.resendButtonText}>Resend OTP</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                        {/* ── Verify Button ── */}
                                        <TouchableOpacity
                                            style={[
                                                styles.verifyButton,
                                                (isLoading || otp.length !== 6) && styles.verifyButtonDisabled,
                                            ]}
                                            onPress={handleVerifyOTP}
                                            disabled={isLoading || otp.length !== 6}
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

                                        {/* ── Info ── */}
                                        <View style={styles.infoSection}>
                                            <View style={styles.infoHeader}>
                                                <Icon name="information-circle" size={17} color="#FFFFFF" />
                                                <Text style={styles.infoTitle}>Didn't receive code?</Text>
                                            </View>
                                            <Text style={styles.infoText}>
                                                Check spam/junk • Verify phone number • Wait for timer
                                            </Text>
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
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: isSmallDevice ? 18 : 24,
        paddingTop: Platform.OS === 'android' ? 36 : 16,
        paddingBottom: 16,
    },

    // ── Logo ──
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: isSmallDevice ? 16 : 22,
    },
    logoWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 14,
        padding: 7,
        marginRight: 12,
        elevation: 3,
    },
    logo: {
        width: isSmallDevice ? 38 : 44,
        height: isSmallDevice ? 38 : 44,
    },
    logoTextContainer: {
        justifyContent: 'center',
    },
    logoMainText: {
        fontSize: isSmallDevice ? 20 : 24,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    logoSubText: {
        fontSize: isSmallDevice ? 8 : 9,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 2,
        opacity: 0.95,
    },

    // ── Title ──
    titleContainer: {
        marginBottom: isSmallDevice ? 14 : 18,
    },
    welcomeText: {
        fontSize: isSmallDevice ? 30 : isLargeDevice ? 38 : 34,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    underline: {
        width: 70,
        height: 3,
        backgroundColor: '#FFFFFF',
        marginTop: 6,
        borderRadius: 2,
    },

    // ── Slim Banner ──
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: isSmallDevice ? 16 : 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    bannerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bannerIconCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(139, 44, 46, 0.1)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    bannerTitle: {
        fontSize: isSmallDevice ? 13 : 14,
        fontWeight: '700',
        color: '#8B2C2E',
        letterSpacing: 0.3,
    },
    bannerSub: {
        fontSize: isSmallDevice ? 11 : 12,
        fontWeight: '500',
        color: '#555',
        marginTop: 1,
    },
    bannerContact: {
        fontWeight: '700',
        color: '#8B2C2E',
    },
    timerPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(139, 44, 46, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 8,
    },
    timerPillReady: {
        backgroundColor: 'rgba(76, 175, 80, 0.12)',
    },
    timerPillText: {
        fontSize: isSmallDevice ? 12 : 13,
        fontWeight: '700',
        color: '#8B2C2E',
        marginLeft: 4,
        letterSpacing: 0.5,
    },
    timerPillTextReady: {
        color: '#4CAF50',
    },

    // ── OTP Input ──
    otpSection: {
        marginBottom: isSmallDevice ? 14 : 20,
    },
    inputLabel: {
        fontSize: isSmallDevice ? 12 : 13,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 10,
        letterSpacing: 0.5,
        opacity: 0.95,
    },
    otpInputContainer: {
        width: '100%',
    },
    otpBox: {
        width: (width - (isSmallDevice ? 36 : 48) - 40) / 6,
        height: isSmallDevice ? 48 : 54,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    otpBoxFocused: {
        borderColor: 'rgba(255,255,255,0.9)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    otpText: {
        fontSize: isSmallDevice ? 20 : 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    errorText: {
        color: '#FFE5E5',
        fontSize: 12,
        marginTop: 8,
        fontWeight: '500',
    },

    // ── Resend ──
    resendContainer: {
        alignItems: 'center',
        marginBottom: isSmallDevice ? 14 : 18,
        minHeight: 34,
        justifyContent: 'center',
    },
    resendTimerText: {
        fontSize: 13,
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
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    resendButtonText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '700',
        marginLeft: 7,
        letterSpacing: 0.5,
    },

    // ── Verify Button ──
    verifyButton: {
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
        overflow: 'hidden',
    },
    verifyButtonDisabled: {
        opacity: 0.45,
    },
    buttonGradient: {
        paddingVertical: isSmallDevice ? 15 : 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
    },
    verifyButtonText: {
        fontSize: isSmallDevice ? 15 : 17,
        fontWeight: '900',
        color: '#8B2C2E',
        letterSpacing: 2,
    },

    // ── Info ──
    infoSection: {
        marginTop: isSmallDevice ? 14 : 18,
        backgroundColor: 'rgba(139, 44, 46, 0.6)',
        borderRadius: 10,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#FFFFFF',
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
        marginLeft: 6,
        letterSpacing: 0.3,
    },
    infoText: {
        fontSize: 12,
        color: '#FFFFFF',
        opacity: 0.85,
        lineHeight: 18,
    },
});