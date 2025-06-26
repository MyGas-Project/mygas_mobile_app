import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import ProgressIndicator from "./ProgressIndicator";

const RegisterLayout = ({
  children,
  step,
  navigation,
  onBack,
  onNext,
  backText = "Back",
  nextText = "Next",
  showBackButton = true,
}) => {
  const { styles } = useTheme();

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
      </ImageBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ProgressIndicator step={step} />
        <ScrollView style={styles.auth_content}>{children}</ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <View style={styles.footer_button_container}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.stepSecondaryButton}
              onPress={onBack}
            >
              <Text style={styles.stepSecondaryButtonText}>{backText}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.footer_button_container}>
          <TouchableOpacity style={styles.primaryButton} onPress={onNext}>
            <Text style={styles.primaryButtonText}>{nextText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegisterLayout;
