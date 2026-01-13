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

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email or Mobile Number is required";
    } else {
      const isEmail = email.includes('@');
      const isMobile = /^\d+$/.test(email.trim());

      if (isEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          newErrors.email = "Please enter a valid email address";
        }
      } else if (isMobile) {
        if (email.trim().length < 10) {
          newErrors.email = "Please enter a valid mobile number";
        }
      } else {
        newErrors.email = "Please enter a valid email or mobile number";
      }
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    Keyboard.dismiss();

    try {
      setIsLoading(true);
      await login(email, password);
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.message || "Please check your credentials and try again",
        [{ text: "OK", style: "default" }]
      );
    } finally {
      setIsLoading(false);
      setPassword("");
    }
  };

  const handleCardLogin = () => {
    navigation.navigate('PhoneLogin');
  };

  const handleTermsPress = () => {
    navigation.navigate('TermsCondition');
  };

  const handlePrivacyPress = () => {
    navigation.navigate('PrivacyPolicy');
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
                        <Text style={styles.welcomeText}>SIGN IN</Text>
                        <View style={styles.underline} />
                      </View>

                      <Text style={styles.subtitleText}>
                        Welcome back! Please enter your details.
                      </Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email or Mobile Number</Text>
                        <TouchableWithoutFeedback onPress={() => emailInputRef.current?.focus()}>
                          <View style={[
                            styles.inputWrapper,
                            emailFocused && styles.inputWrapperFocused,
                            errors.email && styles.inputWrapperError
                          ]}>
                            <Icon name="mail-outline" size={20} color={emailFocused ? "#FFFFFF" : "rgba(255,255,255,0.6)"} style={styles.inputIcon} />
                            <TextInput
                              ref={emailInputRef}
                              style={styles.input}
                              value={email}
                              placeholder="Enter your email or mobile number"
                              placeholderTextColor="rgba(255,255,255,0.5)"
                              onChangeText={(text) => {
                                setEmail(text);
                                if (errors.email) {
                                  setErrors({ ...errors, email: null });
                                }
                              }}
                              keyboardType="email-address"
                              autoCapitalize="none"
                              editable={!isLoading}
                              returnKeyType="next"
                              onFocus={() => setEmailFocused(true)}
                              onBlur={() => setEmailFocused(false)}
                              onSubmitEditing={() => passwordInputRef.current?.focus()}
                              blurOnSubmit={false}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                        {errors.email && (
                          <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TouchableWithoutFeedback onPress={() => passwordInputRef.current?.focus()}>
                          <View style={[
                            styles.inputWrapper,
                            passwordFocused && styles.inputWrapperFocused,
                            errors.password && styles.inputWrapperError
                          ]}>
                            <Icon name="lock-closed-outline" size={20} color={passwordFocused ? "#FFFFFF" : "rgba(255,255,255,0.6)"} style={styles.inputIcon} />
                            <TextInput
                              ref={passwordInputRef}
                              style={[styles.input, styles.passwordInput]}
                              value={password}
                              placeholder="Enter your password"
                              placeholderTextColor="rgba(255,255,255,0.5)"
                              onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) {
                                  setErrors({ ...errors, password: null });
                                }
                              }}
                              secureTextEntry={!showPassword}
                              editable={!isLoading}
                              returnKeyType="done"
                              onSubmitEditing={handleLogin}
                              onFocus={() => setPasswordFocused(true)}
                              onBlur={() => setPasswordFocused(false)}
                            />
                            <TouchableOpacity
                              onPress={() => setShowPassword(!showPassword)}
                              style={styles.eyeIcon}
                              activeOpacity={0.7}
                            >
                              <Icon
                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color="rgba(255,255,255,0.6)"
                              />
                            </TouchableOpacity>
                          </View>
                        </TouchableWithoutFeedback>
                        {errors.password && (
                          <Text style={styles.errorText}>{errors.password}</Text>
                        )}
                      </View>

                      <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => navigation.navigate('ForgotPassword')}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.forgotPasswordText}>
                          Forgot Password?
                        </Text>
                      </TouchableOpacity>

                      {/* Sign In Button */}
                      <TouchableOpacity
                        style={[
                          styles.signInButton,
                          isLoading && styles.signInButtonDisabled
                        ]}
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#FFFFFF', '#F8F8F8']}
                          style={styles.buttonGradient}
                        >
                          <Text style={styles.signInText}>
                            {isLoading ? "SIGNING IN..." : "SIGN IN"}
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      {/* Divider */}
                      <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                      </View>

                      {/* Card Login Button */}
                      <View style={styles.cardLoginContainer}>
                        <Text style={styles.cardLoginLabel}>For existing card holder</Text>
                        <TouchableOpacity
                          style={styles.cardLoginButton}
                          onPress={handleCardLogin}
                          activeOpacity={0.8}
                        >
                          <Icon name="card-outline" size={20} color="#FFFFFF" style={styles.cardIcon} />
                          <Text style={styles.cardLoginText}>
                            LOGIN USING MOBILE NUMBER
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Sign Up Link */}
                      <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Register')}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Terms and Privacy */}
                      <View style={styles.termsContainer}>
                        <Text style={styles.termsText}>
                          By continuing, you agree to our{" "}
                        </Text>
                        <View style={styles.termsLinksRow}>
                          <TouchableOpacity onPress={handleTermsPress} activeOpacity={0.7}>
                            <Text style={styles.termsLink}>Terms & Conditions</Text>
                          </TouchableOpacity>
                          <Text style={styles.termsText}> and </Text>
                          <TouchableOpacity onPress={handlePrivacyPress} activeOpacity={0.7}>
                            <Text style={styles.termsLink}>Privacy Policy</Text>
                          </TouchableOpacity>
                        </View>
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
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  headerSection: {
    marginBottom: isSmallDevice ? 24 : 32,
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
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    padding: 8,
    position: 'absolute',
    right: 8,
  },
  errorText: {
    color: '#FAB12F',
    fontSize: 18,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
    opacity: 0.9,
  },
  signInButton: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
    marginTop: 12,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: isSmallDevice ? 17 : 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  signInText: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '900',
    color: '#8B2C2E',
    letterSpacing: 2.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: isSmallDevice ? 20 : 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.8,
  },
  cardLoginContainer: {
    marginBottom: 8,
  },
  cardLoginLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.85,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  cardLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B2C2E',
    borderRadius: 16,
    paddingVertical: isSmallDevice ? 17 : 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardIcon: {
    marginRight: 10,
  },
  cardLoginText: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '400',
    opacity: 0.9,
  },
  signupLink: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  termsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLinksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  termsLink: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
    opacity: 0.9,
  },
});