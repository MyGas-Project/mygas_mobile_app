import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import RegisterLayout from "../components/RegisterLayout";

const Step4 = ({ navigation }) => {
  const { styles } = useTheme();

  return (
    <RegisterLayout
      step={4}
      navigation={navigation}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate("Step5")}
      backText="Back"
      nextText="Confirm Email"
    >
      <View style={{ padding: 20 }}>
        <Text style={[styles.text, styles.text_md]}>Create Your Account</Text>
        <Text style={[styles.text, styles.text_lg]}>
          Enter Your Email Address
        </Text>
        <Text style={styles.text}>
          Updates will be sent on your email address.
        </Text>
      </View>
      <View style={styles.form_container}>
        <View style={styles.form_section}>
          <TextInput
            style={styles.form_input}
            placeholder="Enter your email address"
          />
        </View>
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
    </RegisterLayout>
  );
};

export default Step4;
