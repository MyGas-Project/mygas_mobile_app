import React from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import RegisterLayout from "./components/RegisterLayout";

const Step6 = ({ navigation }) => {
  const { styles } = useTheme();

  return (
    <RegisterLayout
      step={6}
      navigation={navigation}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate("Welcome")}
      backText="Back"
      nextText="Confirm Password"
    >
      <View style={{ padding: 20 }}>
        <Text style={[styles.text, styles.text_md]}>Create Your Account</Text>
        <Text style={[styles.text, styles.text_lg]}>
          Create Your Account Password
        </Text>
        <Text style={styles.text}>
          Your password protects your account and keeps your information safe.
        </Text>
      </View>
      <View style={styles.form_container}>
        <View style={styles.form_section}>
          <Text style={styles.form_label}>Enter your password</Text>
          <TextInput
            style={styles.form_input}
            placeholder="Enter password"
            secureTextEntry={true}
          />
        </View>
        <View style={styles.form_section}>
          <Text style={styles.form_label}>Re-enter your password</Text>
          <TextInput
            style={styles.form_input}
            placeholder="Confirm password"
            secureTextEntry={true}
          />
        </View>
      </View>
    </RegisterLayout>
  );
};

export default Step6;
