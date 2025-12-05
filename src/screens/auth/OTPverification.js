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
} from "react-native";
import React, { useContext, useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export default function OTPverification({ navigation, route }) {
    const { styles } = useTheme();
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

            // Replace with your actual OTP verification API call
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

            // If successful, navigation will be handled by AuthContext

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

            Alert.alert(
                "OTP Sent",
                "A new verification code has been sent to your phone number",
                [{ text: "OK", style: "default" }]
            );

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

        // Phone number - improved masking format
        const cleanNumber = contact.replace(/\D/g, ""); // Remove non-digits
        const visible = cleanNumber.slice(-4);

        if (cleanNumber.startsWith("63") && cleanNumber.length >= 12) {
            return `+63 *** *** ${visible}`;
        } else if (cleanNumber.length >= 10) {
            return `*** *** ${visible}`;
        }
        // Fallback for shorter numbers
        return `*** *** ${visible}`;
    };

    return (
        <View style={professionalStyles.container}>
            <StatusBar barStyle="light-content" />

            <ImageBackground
                resizeMode="cover"
                source={require("../../../assets/mygas-header.jpeg")}
                style={professionalStyles.headerBackground}
            >
                <LinearGradient
                    colors={["rgba(0,0,0,0.3)", "rgba(255,255,255,0.95)"]}
                    locations={[0, 0.85]}
                    style={professionalStyles.headerGradient}
                />

                <View style={professionalStyles.headerContent}>
                    <Image
                        source={require("../../../assets/mygas.jpg")}
                        style={professionalStyles.logo}
                        resizeMode="contain"
                    />
                    <Text style={professionalStyles.welcomeText}>Verify OTP</Text>
                    <Text style={professionalStyles.subtitleText}>
                        Enter the 6-digit code sent to
                    </Text>
                    <Text style={professionalStyles.contactText}>
                        {maskContact(data.phone_number)}
                    </Text>
                </View>
            </ImageBackground>

            <KeyboardAvoidingView
                style={professionalStyles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    style={professionalStyles.scrollView}
                    contentContainerStyle={professionalStyles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={professionalStyles.formCard}>
                        {/* OTP Input Boxes */}
                        <View style={professionalStyles.otpContainer}>
                            {otp.map((digit, index) => (
                                <View
                                    key={index}
                                    style={[
                                        professionalStyles.otpBox,
                                        digit && professionalStyles.otpBoxFilled,
                                        error && professionalStyles.otpBoxError,
                                    ]}
                                >
                                    <TextInput
                                        ref={(ref) => (inputRefs.current[index] = ref)}
                                        style={professionalStyles.otpInput}
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
                            <Text style={professionalStyles.errorText}>{error}</Text>
                        )}

                        {/* Timer and Resend */}
                        <View style={professionalStyles.timerContainer}>
                            {!canResend ? (
                                <Text style={professionalStyles.timerText}>
                                    Resend code in{" "}
                                    <Text style={professionalStyles.timerHighlight}>
                                        {formatTime(timer)}
                                    </Text>
                                </Text>
                            ) : (
                                <TouchableOpacity
                                    onPress={handleResendOTP}
                                    disabled={isLoading}
                                    activeOpacity={0.7}
                                >
                                    <Text style={professionalStyles.resendText}>
                                        Resend OTP
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Verify Button */}
                        <TouchableOpacity
                            style={[
                                professionalStyles.verifyButton,
                                (isLoading || otp.join("").length !== 6) &&
                                professionalStyles.verifyButtonDisabled,
                            ]}
                            onPress={handleVerifyOTP}
                            disabled={isLoading || otp.join("").length !== 6}
                            activeOpacity={0.8}
                        >
                            <Text style={professionalStyles.verifyButtonText}>
                                {isLoading ? "Verifying..." : "Verify & Continue"}
                            </Text>
                        </TouchableOpacity>

                        {/* Back to Login */}
                        <View style={professionalStyles.backContainer}>
                            <Text style={professionalStyles.backText}>
                                Wrong contact info?{" "}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.7}
                            >
                                <Text style={professionalStyles.backLink}>Go Back</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Info Section */}
                        <View style={professionalStyles.infoSection}>
                            <Text style={professionalStyles.infoTitle}>
                                📱 Didn't receive code?
                            </Text>
                            <Text style={professionalStyles.infoText}>
                                • Check your spam/junk folder{"\n"}
                                • Make sure your phone number is correct{"\n"}
                                • Wait for the timer to resend
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const professionalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    headerBackground: {
        height: SCREEN_HEIGHT * 0.35,
        width: "100%",
    },
    headerGradient: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    headerContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
    },
    logo: {
        width: SCREEN_WIDTH * 0.25,
        height: SCREEN_WIDTH * 0.25,
        marginBottom: 16,
        borderRadius: SCREEN_WIDTH * 0.125,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1A1A1A",
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    subtitleText: {
        fontSize: 15,
        color: "#666666",
        fontWeight: "400",
        marginBottom: 4,
    },
    contactText: {
        fontSize: 16,
        color: "black",
        fontWeight: "600",
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    formCard: {
        backgroundColor: "transparent",
        marginTop: -30,
        paddingHorizontal: 24,
        paddingTop: 36,
        paddingBottom: 24,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    otpBox: {
        width: (SCREEN_WIDTH - 80) / 6,
        height: 56,
        borderRadius: 12,
        backgroundColor: "#F8F9FA",
        borderWidth: 2,
        borderColor: "#E8E8E8",
        justifyContent: "center",
        alignItems: "center",
    },
    otpBoxFilled: {
        borderColor: "#007AFF",
        backgroundColor: "#FFFFFF",
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    otpBoxError: {
        borderColor: "#fe0002",
        backgroundColor: "#FFF5F5",
    },
    otpInput: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1A1A1A",
        textAlign: "center",
        width: "100%",
        height: "100%",
    },
    errorText: {
        color: "#fe0002",
        fontSize: 13,
        textAlign: "center",
        marginBottom: 16,
        fontWeight: "500",
    },
    timerContainer: {
        alignItems: "center",
        marginBottom: 32,
        minHeight: 30,
    },
    timerText: {
        fontSize: 15,
        color: "#666666",
        fontWeight: "400",
    },
    timerHighlight: {
        color: "#fe0002",
        fontWeight: "700",
    },
    resendText: {
        fontSize: 16,
        color: "#fe0002",
        fontWeight: "700",
        textDecorationLine: "underline",
    },
    verifyButton: {
        backgroundColor: "#fe0002",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        shadowColor: "#fe0002",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    verifyButtonDisabled: {
        backgroundColor: "#B0B0B0",
        shadowOpacity: 0.1,
    },
    verifyButtonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    backContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
    },
    backText: {
        fontSize: 15,
        color: "#666666",
        fontWeight: "400",
    },
    backLink: {
        fontSize: 15,
        color: "#fe0002",
        fontWeight: "700",
    },
    infoSection: {
        marginTop: 32,
        backgroundColor: "#F8F9FA",
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#fe0002",
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1A1A1A",
        marginBottom: 8,
    },
    infoText: {
        fontSize: 13,
        color: "#666666",
        lineHeight: 22,
    },
});