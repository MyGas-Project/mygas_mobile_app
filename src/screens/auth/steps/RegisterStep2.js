import React, { useContext, useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import RegisterLayout from "../components/RegisterLayout";
import { AuthContext } from "../../../context/AuthContext";

const Step2 = ({ navigation, route }) => {
  const { styles } = useTheme();
  const { registerStep1 } = useContext(AuthContext);

  const { firstName, lastName, birthDate } = route.params;
  const [phoneNumber, setPhoneNumber] = useState("+63");

  const handleNext = async () => {
    try {
      const res = await registerStep1({
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        phone_number: phoneNumber,
      });
      console.log({
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        phone_number: phoneNumber,
      });

      if (res.success) {
        console.log("Step 1: ", res.data);
        Alert.alert(
          "OTP",
          res.data.message ||
            "Please check your phone for the verification code."
        );
        navigation.navigate("Step3", {
          user_id: res.data.user_id,
          code_id: res.data.code_id,
        });
      } else {
        console.log("Step 1 Error: ", res.error);
        Alert.alert("Error", res.error || "Step 1 Failed");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Network Error", "Please try again.");
    }
  };

  return (
    <RegisterLayout
      step={2}
      navigation={navigation}
      onBack={() => navigation.goBack()}
      onNext={handleNext}
      backText="Back"
      nextText="Agree and Continue"
    >
      <View style={{ padding: 20 }}>
        <Text style={[styles.text, styles.text_md]}>Create Your Account</Text>
        <Text style={[styles.text, styles.text_lg]}>
          Enter Your Mobile Number
        </Text>
      </View>
      <View style={styles.form_container}>
        <View style={styles.form_section}>
          <TextInput
            style={styles.form_input}
            value={phoneNumber}
            maxLength={13}
            keyboardType="phone-pad"
            onChangeText={(text) => {
              // Always keep +63 at the start
              if (!text.startsWith("+63")) {
                setPhoneNumber("+63");
              } else {
                setPhoneNumber(text);
              }
            }}
          />
          <Text style={styles.form_input_info}>
            Please enter a 10-digit number, excluding 0 at the beginning.
          </Text>
          <View style={styles.termsContainer}>
            <TouchableOpacity style={styles.termsRadio} activeOpacity={0.7}>
              <View style={styles.termsInnerRadio} />
            </TouchableOpacity>
            <Text style={{ flex: 1, textAlign: "justify" }}>
              I agree to MyGas'{" "}
              <Text
                style={{ fontWeight: "bold", textDecorationLine: "underline" }}
              >
                Terms of Use
              </Text>{" "}
              and{" "}
              <Text
                style={{ fontWeight: "bold", textDecorationLine: "underline" }}
              >
                Privacy Statement
              </Text>
              , and I consent to receiving text messages from MyGas to complete
              the registration process, including mobile number verification.
              Standard message and data rates may apply.
            </Text>
          </View>
        </View>
      </View>
    </RegisterLayout>
  );
};

export default Step2;
