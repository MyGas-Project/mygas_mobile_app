import React, { useContext } from "react";
import { View, Text, Alert } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import RegisterLayout from "../components/RegisterLayout";
import OTPInput from "../components/OTPInput";
import { AuthContext } from "../../../context/AuthContext";

const Step3 = ({ navigation, route }) => {
  const { styles } = useTheme();
  const { verifyCode } = useContext(AuthContext);

  const { user_id, code_id } = route.params;

  const handleOTPComplete = async (code) => {
    console.log("Phone OTP:", code);
    try {
      const res = await verifyCode({ user_id, code_id, code });

      if (res.success) {
        console.log("verified: ", res.data);
        navigation.navigate("Step4", { user_id });
      } else {
        console.log("verification failed: ", res.error);
        Alert.alert("Invalid Code", res.error || "Verification failed");
      }
    } catch (error) {
      console.error("Network Error: ", error);
      Alert.alert("Network Error", "Please try again");
    }
  };

  return (
    <RegisterLayout
      step={3}
      navigation={navigation}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate("Step4")}
      backText="Back"
      nextText="Verify Mobile Number"
    >
      <View style={{ padding: 20 }}>
        <Text style={[styles.text, styles.text_md]}>Create Your Account</Text>
        <Text style={[styles.text, styles.text_lg]}>
          Enter 6-digit Verification Code
        </Text>
        <Text style={styles.text}>
          A one-time passcode has been sent to (+63) 9123456789. Please enter
          the passcode to verify your phone number.
        </Text>
      </View>
      <OTPInput onComplete={handleOTPComplete} />
    </RegisterLayout>
  );
};

export default Step3;
