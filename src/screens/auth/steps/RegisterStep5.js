import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import RegisterLayout from "../components/RegisterLayout";
import OTPInput from "../components/OTPInput";

const Step5 = ({ navigation }) => {
  const { styles } = useTheme();

  const handleOTPComplete = (code) => {
    console.log("Email OTP:", code);
    // Handle email verification here
  };

  return (
    <RegisterLayout
      step={5}
      navigation={navigation}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate("Step6")}
      backText="Back"
      nextText="Verify Email"
    >
      <View style={{ padding: 20 }}>
        <Text style={[styles.text, styles.text_md]}>Create Your Account</Text>
        <Text style={[styles.text, styles.text_lg]}>
          Enter 6-digit Verification Code
        </Text>
        <Text style={styles.text}>
          A one-time passcode has been sent to example@email.com. Please enter
          the passcode to verify your email address.
        </Text>
      </View>
      <OTPInput onComplete={handleOTPComplete} />
    </RegisterLayout>
  );
};

export default Step5;
