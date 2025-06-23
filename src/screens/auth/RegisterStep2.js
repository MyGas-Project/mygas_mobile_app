import React, { useContext, useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import RegisterLayout from "./components/RegisterLayout";
import { AuthContext } from "../../context/AuthContext";

const Step2 = ({ navigation, route }) => {
  const { styles } = useTheme();
  const { registerStep1 } = useContext(AuthContext);

  const { firstName, lastName, birthDate } = route.params;
  const [phoneNumber, setPhoneNumber] = useState("");

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
        Alert.alert("Success", res.data.message || "Step 1 Completed");
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
            placeholder="Enter mobile number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
            maxLength={11}
          />
          <Text style={styles.form_input_info}>
            Please enter 10-digit number, excluding 0 at the beginning.
          </Text>
        </View>
      </View>
    </RegisterLayout>
  );
};

export default Step2;
