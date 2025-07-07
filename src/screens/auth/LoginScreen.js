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
} from "react-native";
import React, { useContext, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { styles } = useTheme();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Email and password required");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        // Navigation will be handled automatically by the Navigation component
        // based on userInfo state change
      } else {
        Alert.alert("Login Failed", "Invalid credentials");
        setPassword("");
      }
    } catch (error) {
      Alert.alert(error.message || "Login failed", "Please try again");
      // Alert.alert("Error", "An unexpected error occurred. Please try again.");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 25}}>
                    <Image source={require('../../../assets/arrow-circle-left.png')} style={styles.top_bar_button}/>
                </TouchableOpacity> */}
      </ImageBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.auth_content}>
          <View style={styles.logo_container}>
            <Image
              source={require("../../../assets/mygas.jpg")}
              style={styles.logo}
            />
          </View>
          <View style={styles.form_container}>
            <View style={styles.form_section}>
              <Text style={styles.form_label}>
                Mobile Number / Email Address
              </Text>
              <TextInput
                style={styles.form_input}
                value={email}
                placeholder="Enter Mobile Number or Email Address"
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            <View style={styles.form_section}>
              <Text style={styles.form_label}>Password</Text>
              <TextInput
                style={styles.form_input}
                value={password}
                placeholder="Enter Password"
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
              <Text style={styles.helpText}>Forgot Password?</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <View style={styles.footer_button_container}>
          <Text
            style={[
              styles.text,
              { textAlign: "center", marginTop: -100, marginBottom: 10 },
            ]}
          >
            No account yet?{" "}
            <Text
              style={styles.text_bold}
              onPress={() => navigation.navigate("Step1")}
            >
              Register
            </Text>
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
