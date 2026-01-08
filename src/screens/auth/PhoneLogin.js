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
import React, { useContext, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

// Responsive sizing helper
const isSmallDevice = width < 375;
const isLargeDevice = width >= 414;

export default function PhoneLogin({ navigation }) {
    const { phoneLoginVerification } = useContext(AuthContext);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [phoneFocused, setPhoneFocused] = useState(false);
    const [error, setError] = useState("");

    const phoneInputRef = useRef(null);

    const formatPhoneNumber = (text) => {
        // Remove all non-digits
        let cleaned = text.replace(/\D/g, "");

        // Handle +63 country code - convert to 0
        if (cleaned.startsWith("63") && cleaned.length >= 2) {
            cleaned = "0" + cleaned.slice(2);
        }

        // Limit to 11 digits
        const limited = cleaned.slice(0, 11);

        // Format as (XXXX) XXX-XXXX
        if (limited.length <= 4) {
            return limited;
        } else if (limited.length <= 7) {
            return `(${limited.slice(0, 4)}) ${limited.slice(4)}`;
        } else {
            return `(${limited.slice(0, 4)}) ${limited.slice(4, 7)}-${limited.slice(7)}`;
        }
    };

    const validatePhoneNumber = () => {
        const cleaned = phoneNumber.replace(/\D/g, "");

        if (!cleaned) {
            setError("Phone number is required");
            return false;
        }

        if (cleaned.length < 11) {
            setError("Please enter a valid 11-digit phone number");
            return false;
        }

        setError("");
        return true;
    };

    const handlePhoneLogin = async () => {
        if (!validatePhoneNumber()) {
            return;
        }

        Keyboard.dismiss();

        try {
            setIsLoading(true);

            const cleanedPhone = phoneNumber.replace(/\D/g, "");
            console.log(cleanedPhone);
            const { statusCode, data } = await phoneLoginVerification(cleanedPhone);
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

        } catch (error) {
            Alert.alert(
                "Login Failed",
                error.message || "Invalid phone number. Please try again.",
                [{ text: "OK", style: "default" }]
            );
        } finally {
            setIsLoading(false);
        }
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
                                            <View style={styles.logoRow}>
                                                <TouchableOpacity
                                                    style={styles.backButton}
                                                    onPress={() => navigation.goBack()}
                                                    activeOpacity={0.7}
                                                >
                                                    <Icon name="arrow-back" size={24} color="#FFFFFF" />
                                                </TouchableOpacity>
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
                                                <Text style={styles.welcomeText}>PHONE LOGIN</Text>
                                                <View style={styles.underline} />
                                            </View>

                                            <Text style={styles.subtitleText}>
                                                Enter your phone number to continue
                                            </Text>
                                        </View>

                                        {/* Phone Visual Section */}
                                        <View style={styles.phoneSection}>
                                            <View style={styles.phoneVisual}>
                                                <LinearGradient
                                                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    style={styles.phoneGradient}
                                                >
                                                    <View style={styles.phoneContent}>
                                                        <View style={styles.phoneIconContainer}>
                                                            <View style={styles.phoneIconCircle}>
                                                                <Icon name="call" size={36} color="#8B2C2E" />
                                                            </View>
                                                        </View>

                                                        <View style={styles.phoneMiddle}>
                                                            <Text style={styles.phoneNumberDisplay}>
                                                                {phoneNumber || "(••••) •••-••••"}
                                                            </Text>
                                                        </View>

                                                        <View style={styles.phoneBottom}>
                                                            <View>
                                                                <Text style={styles.phoneLabel}>REGISTERED TO</Text>
                                                                <Text style={styles.phoneValue}>MOTORISTA</Text>
                                                            </View>
                                                            <View style={styles.phoneLogoSmall}>
                                                                <Image
                                                                    source={require('../../../assets/heart_logo.png')}
                                                                    style={styles.phoneLogoImage}
                                                                    resizeMode='contain'
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                </LinearGradient>
                                            </View>
                                        </View>

                                        {/* Form Section */}
                                        <View style={styles.formSection}>
                                            <View style={styles.inputGroup}>
                                                <Text style={styles.inputLabel}>Phone Number</Text>
                                                <TouchableWithoutFeedback onPress={() => phoneInputRef.current?.focus()}>
                                                    <View style={[
                                                        styles.inputWrapper,
                                                        phoneFocused && styles.inputWrapperFocused,
                                                        error && styles.inputWrapperError
                                                    ]}>
                                                        <Icon
                                                            name="call-outline"
                                                            size={20}
                                                            color={phoneFocused ? "#FFFFFF" : "rgba(255,255,255,0.6)"}
                                                            style={styles.inputIcon}
                                                        />
                                                        <TextInput
                                                            ref={phoneInputRef}
                                                            style={styles.input}
                                                            value={phoneNumber}
                                                            placeholder="(0000) 000-0000"
                                                            placeholderTextColor="rgba(255,255,255,0.5)"
                                                            onChangeText={(text) => {
                                                                const formatted = formatPhoneNumber(text);
                                                                setPhoneNumber(formatted);
                                                                if (error) {
                                                                    setError("");
                                                                }
                                                            }}
                                                            keyboardType="phone-pad"
                                                            editable={!isLoading}
                                                            returnKeyType="done"
                                                            onSubmitEditing={handlePhoneLogin}
                                                            onFocus={() => setPhoneFocused(true)}
                                                            onBlur={() => setPhoneFocused(false)}
                                                            maxLength={16} // (XXXX) XXX-XXXX format
                                                        />
                                                    </View>
                                                </TouchableWithoutFeedback>
                                                {error && (
                                                    <Text style={styles.errorText}>{error}</Text>
                                                )}
                                                <Text style={styles.helperText}>
                                                    Enter your 11-digit phone number
                                                </Text>
                                            </View>

                                            {/* Login Button */}
                                            <TouchableOpacity
                                                style={[
                                                    styles.loginButton,
                                                    isLoading && styles.loginButtonDisabled
                                                ]}
                                                onPress={handlePhoneLogin}
                                                disabled={isLoading}
                                                activeOpacity={0.8}
                                            >
                                                <LinearGradient
                                                    colors={['#FFFFFF', '#F8F8F8']}
                                                    style={styles.buttonGradient}
                                                >
                                                    <Text style={styles.loginText}>
                                                        {isLoading ? "VERIFYING..." : "LOGIN WITH PHONE"}
                                                    </Text>
                                                </LinearGradient>
                                            </TouchableOpacity>

                                            {/* Info Section */}
                                            <View style={styles.infoSection}>
                                                <View style={styles.infoHeader}>
                                                    <Icon name="shield-checkmark" size={20} color="#FFFFFF" />
                                                    <Text style={styles.infoTitle}>Secure Login</Text>
                                                </View>
                                                <Text style={styles.infoText}>
                                                    Your phone number is encrypted and securely processed. We'll send you a verification code to confirm your identity.
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
        paddingTop: Platform.OS === 'android' ? 0 : 20,
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
        marginRight: 14,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: isSmallDevice ? 20 : 28,
        paddingTop: Platform.OS === 'android' ? 40 : 35,
    },
    headerSection: {
        marginBottom: isSmallDevice ? 20 : 28,
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
    phoneSection: {
        marginVertical: isSmallDevice ? 12 : 16,
    },
    phoneVisual: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    phoneGradient: {
        padding: isSmallDevice ? 16 : 18,
        minHeight: isSmallDevice ? 140 : 160,
    },
    phoneContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    phoneIconContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    phoneIconCircle: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(139, 44, 46, 0.1)',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    phoneMiddle: {
        alignItems: 'center',
        marginVertical: 10,
    },
    phoneNumberDisplay: {
        fontSize: isSmallDevice ? 20 : 24,
        fontWeight: '700',
        color: '#8B2C2E',
        letterSpacing: 1.5,
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    },
    phoneBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    phoneLabel: {
        fontSize: 9,
        fontWeight: '600',
        color: '#8B2C2E',
        letterSpacing: 1,
        opacity: 0.7,
        marginBottom: 2,
    },
    phoneValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#8B2C2E',
        letterSpacing: 0.5,
    },
    phoneLogoSmall: {
        width: 32,
        height: 32,
        backgroundColor: '#8B2C2E',
        borderRadius: 16,
        padding: 6,
    },
    phoneLogoImage: {
        width: '100%',
        height: '100%',
    },
    formSection: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: isSmallDevice ? 18 : 20,
    },
    inputLabel: {
        fontSize: isSmallDevice ? 13 : 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 10,
        letterSpacing: 0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 14,
        minHeight: 56,
    },
    inputWrapperFocused: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    inputWrapperError: {
        borderColor: '#FFE5E5',
        borderWidth: 2,
        backgroundColor: 'rgba(255, 229, 229, 0.1)',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: isSmallDevice ? 14 : 16,
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '600',
        letterSpacing: 1,
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    },
    errorText: {
        color: '#FFE5E5',
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    helperText: {
        fontSize: 13,
        color: '#FFFFFF',
        opacity: 0.7,
        marginTop: 6,
        marginLeft: 4,
    },
    loginButton: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
        overflow: 'hidden',
        marginTop: 12,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    buttonGradient: {
        paddingVertical: isSmallDevice ? 17 : 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
    },
    loginText: {
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
        marginBottom: 20,
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