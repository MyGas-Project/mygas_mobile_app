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
import React, { useContext, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CardLogin({ navigation }) {
    const { styles } = useTheme();
    const { cardLoginVerification } = useContext(AuthContext);
    const [cardNumber, setCardNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cardFocused, setCardFocused] = useState(false);
    const [error, setError] = useState("");

    const formatCardNumber = (text) => {
        // Remove all non-digits
        const cleaned = text.replace(/\D/g, "");

        // Limit to 16 digits
        const limited = cleaned.slice(0, 10);

        // Add spaces every 4 digits
        const formatted = limited.match(/.{1,4}/g)?.join(" ") || limited;

        return formatted;
    };

    const validateCardNumber = () => {
        const cleaned = cardNumber.replace(/\s/g, "");

        if (!cleaned) {
            setError("Card number is required");
            return false;
        }

        if (cleaned.length < 10) {
            setError("Please enter a valid card number (minimum 10 digits)");
            return false;
        }

        // Basic Luhn algorithm check (optional - you can remove if not needed)
        // let sum = 0;
        // let isEven = false;

        // for (let i = cleaned.length - 1; i >= 0; i--) {
        //     let digit = parseInt(cleaned[i]);

        //     if (isEven) {
        //         digit *= 2;
        //         if (digit > 9) {
        //             digit -= 9;
        //         }
        //     }

        //     sum += digit;
        //     isEven = !isEven;
        // }

        // if (sum % 10 !== 0) {
        //     setError("Invalid card number");
        //     return false;
        // }

        setError("");
        return true;
    };

    const handleCardLogin = async () => {
        if (!validateCardNumber()) {
            return;
        }

        Keyboard.dismiss();

        try {
            setIsLoading(true);

            // Replace this with your actual card login API call
            const cleanedCard = cardNumber.replace(/\s/g, "");
            const { statusCode, data } = await cardLoginVerification(cleanedCard);
            console.log(data);

            if (statusCode !== 201 && statusCode !== 200) {
                Alert.alert(
                    "Login Failed",
                    data.message || "Login failed",
                    [{ text: "OK", style: "default" }]
                );
                return;
            }
            navigation.navigate("OTPverification", { data: data.data });

            // await login(cleanedCard, "card"); // Modify based on your API
            // 

            // If successful, navigation will be handled by AuthContext
        } catch (error) {
            Alert.alert(
                "Login Failed",
                error.message || "Invalid card number. Please try again.",
                [{ text: "OK", style: "default" }]
            );
        } finally {
            setIsLoading(false);
        }
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
                    <Text style={professionalStyles.welcomeText}>Card Login</Text>
                    <Text style={professionalStyles.subtitleText}>
                        Enter your card number to continue
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
                        {/* Card Visual */}
                        <View style={professionalStyles.cardVisual}>
                            <LinearGradient
                                colors={["#fe0002", "#c40002"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={professionalStyles.cardGradient}
                            >
                                <View style={professionalStyles.cardContent}>
                                    <Text style={professionalStyles.cardChip}>💳</Text>
                                    <Text style={professionalStyles.cardNumberDisplay}>
                                        {cardNumber || "•••• •••• •••• ••••"}
                                    </Text>
                                    <Text style={professionalStyles.cardLabel}>CARD NUMBER</Text>
                                </View>
                            </LinearGradient>
                        </View>

                        <View style={professionalStyles.inputGroup}>
                            <Text style={professionalStyles.inputLabel}>Card Number</Text>
                            <View
                                style={[
                                    professionalStyles.inputWrapper,
                                    cardFocused && professionalStyles.inputWrapperFocused,
                                    error && professionalStyles.inputWrapperError,
                                ]}
                            >
                                <TextInput
                                    style={professionalStyles.input}
                                    value={cardNumber}
                                    placeholder="0000 0000 0000 0000"
                                    placeholderTextColor="#A0A0A0"
                                    onChangeText={(text) => {
                                        const formatted = formatCardNumber(text);
                                        setCardNumber(formatted);
                                        // Clear error when user starts typing
                                        if (error) {
                                            setError("");
                                        }
                                    }}
                                    keyboardType="number-pad"
                                    editable={!isLoading}
                                    returnKeyType="done"
                                    // onSubmitEditing={handleCardLogin}
                                    onFocus={() => setCardFocused(true)}
                                    onBlur={() => setCardFocused(false)}
                                    maxLength={19} // 16 digits + 3 spaces
                                />
                            </View>
                            {error && (
                                <Text style={professionalStyles.errorText}>{error}</Text>
                            )}

                            <Text style={professionalStyles.helperText}>
                                Enter your 10 digit card number
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                professionalStyles.loginButton,
                                isLoading && professionalStyles.loginButtonDisabled,
                            ]}
                            onPress={handleCardLogin}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            <Text style={professionalStyles.loginButtonText}>
                                {isLoading ? "Verifying..." : "Login with Card"}
                            </Text>
                        </TouchableOpacity>

                        {/* Back to Login */}
                        <View style={professionalStyles.backContainer}>
                            <Text style={professionalStyles.backText}>
                                Prefer password login?{" "}
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
                            <Text style={professionalStyles.infoTitle}>🔒 Secure Login</Text>
                            <Text style={professionalStyles.infoText}>
                                Your card information is encrypted and securely processed. We
                                never store your complete card details.
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
    cardVisual: {
        marginBottom: 32,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    cardGradient: {
        padding: 24,
        minHeight: 200,
    },
    cardContent: {
        flex: 1,
        justifyContent: "space-between",
    },
    cardChip: {
        fontSize: 40,
        marginBottom: 20,
    },
    cardNumberDisplay: {
        fontSize: 22,
        fontWeight: "600",
        color: "#FFFFFF",
        letterSpacing: 2,
        marginBottom: 8,
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    },
    cardLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: "rgba(255,255,255,0.8)",
        letterSpacing: 1,
    },
    inputGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 10,
        letterSpacing: 0.2,
    },
    inputWrapper: {
        backgroundColor: "#F8F9FA",
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#E8E8E8",
        overflow: "hidden",
    },
    inputWrapperFocused: {
        borderColor: "#007AFF",
        backgroundColor: "#FFFFFF",
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputWrapperError: {
        borderColor: "#fe0002",
        borderWidth: 2,
        backgroundColor: "#FFF5F5",
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 18,
        color: "#1A1A1A",
        fontWeight: "600",
        letterSpacing: 1,
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    },
    errorText: {
        color: "#fe0002",
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
        fontWeight: "500",
    },
    helperText: {
        fontSize: 13,
        color: "#999999",
        marginTop: 8,
        marginLeft: 4,
    },
    loginButton: {
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
    loginButtonDisabled: {
        backgroundColor: "#B0B0B0",
        shadowOpacity: 0.1,
    },
    loginButtonText: {
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
        lineHeight: 20,
    },
});