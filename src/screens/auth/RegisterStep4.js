import React from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import RegisterLayout from "./components/RegisterLayout";

const Step4 = ({ navigation }) => {
  const { styles } = useTheme();

  return (
    <RegisterLayout
      step={4}
      navigation={navigation}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate("Step5")}
      backText="Back"
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
          <TextInput style={styles.form_input} placeholder="Enter your email" />
        </View>
      </View>
    </RegisterLayout>
  );
};

export default Step4;
