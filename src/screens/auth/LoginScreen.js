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
import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const { styles } = useTheme();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email or Mobile Number is required";
    } else {
      // Basic email or mobile validation
      const isEmail = email.includes('@');
      const isMobile = /^\d+$/.test(email.trim());

      if (isEmail) {
        // Basic email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          newErrors.email = "Please enter a valid email address";
        }
      } else if (isMobile) {
        // Mobile number validation
        if (email.trim().length < 10) {
          newErrors.email = "Please enter a valid mobile number";
        }
      } else {
        newErrors.email = "Please enter a valid email or mobile number";
      }
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
          <Text style={professionalStyles.welcomeText}>Welcome Back</Text>
          <Text style={professionalStyles.subtitleText}>Sign in to continue</Text>
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
            <View style={professionalStyles.inputGroup}>
              <Text style={professionalStyles.inputLabel}>
                Email or Mobile Number
              </Text>
              <View style={[
                professionalStyles.inputWrapper,
                emailFocused && professionalStyles.inputWrapperFocused,
                errors.email && professionalStyles.inputWrapperError
              ]}>
                <TextInput
                  style={professionalStyles.input}
                  value={email}
                  placeholder="Enter your email or mobile number"
                  placeholderTextColor="#A0A0A0"
                  onChangeText={(text) => {
                    setEmail(text);
                    // Clear error when user starts typing
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
                />
              </View>
              {errors.email && (
                <Text style={professionalStyles.errorText}>
                  {errors.email}
                </Text>
              )}
            </View>

            <View style={professionalStyles.inputGroup}>
              <Text style={professionalStyles.inputLabel}>Password</Text>
              <View style={[
                professionalStyles.inputWrapper,
                passwordFocused && professionalStyles.inputWrapperFocused,
                errors.password && professionalStyles.inputWrapperError
              ]}>
                <TextInput
                  style={professionalStyles.input}
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor="#A0A0A0"
                  onChangeText={(text) => {
                    setPassword(text);
                    // Clear error when user starts typing
                    if (errors.password) {
                      setErrors({ ...errors, password: null });
                    }
                  }}
                  secureTextEntry
                  editable={!isLoading}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
              </View>
              {errors.password && (
                <Text style={professionalStyles.errorText}>
                  {errors.password}
                </Text>
              )}

              <TouchableOpacity
                style={professionalStyles.forgotPassword}
                onPress={() => {/* Add forgot password logic */ }}
                activeOpacity={0.7}
              >
                <Text style={professionalStyles.forgotPasswordText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                professionalStyles.loginButton,
                isLoading && professionalStyles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={professionalStyles.loginButtonText}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <View style={professionalStyles.signupContainer}>
              <Text style={professionalStyles.signupText}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.7}
              >
                <Text style={professionalStyles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
  },
  headerBackground: {
    height: SCREEN_HEIGHT * 0.38,
    width: '100%',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  logo: {
    width: SCREEN_WIDTH * 0.28,
    height: SCREEN_WIDTH * 0.28,
    marginBottom: 16,
    borderRadius: SCREEN_WIDTH * 0.14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  subtitleText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '400',
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
    backgroundColor: 'transparent',
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 24,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: -3 },
    // shadowOpacity: 0.08,
    // shadowRadius: 12,
    // elevation: 8,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: '#fe0002',
    borderWidth: 2,
    backgroundColor: '#FFF5F5',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#fe0002',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#fe0002',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#B0B0B0',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '400',
  },
  signupLink: {
    fontSize: 15,
    color: '#fe0002',
    fontWeight: '700',
  },
});