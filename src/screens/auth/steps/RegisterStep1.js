import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import RegisterLayout from "../components/RegisterLayout";
import Ionicons from "react-native-vector-icons/Ionicons";

const Step1 = ({ navigation }) => {
  const { styles } = useTheme();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  return (
    <RegisterLayout
      step={1}
      navigation={navigation}
      onBack={() => navigation.goBack()}
      onNext={() =>
        navigation.navigate("Step2", {
          firstName: firstName,
          lastName: lastName,
          birthDate: birthDate,
        })
      }
      backText="Cancel"
      showBackButton={true}
    >
      <View style={{ padding: 20 }}>
        <Text style={[styles.text, styles.text_md]}>Create Your Account</Text>
        <Text style={[styles.text, styles.text_lg]}>
          Complete Your Profile Details
        </Text>
        <Text style={styles.text}>
          Finish your profile to get personalized offers, rewards, and a better
          fueling experience. Update now and start enjoying the perks!
        </Text>
      </View>
      <View style={styles.form_container}>
        <View style={styles.form_section}>
          <TextInput
            style={styles.form_input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.form_section}>
          <TextInput
            style={styles.form_input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.form_section}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: styles.form_input.borderColor,
              borderRadius: 5,
              paddingRight: 10,
              backgroundColor: "white",
            }}
          >
            <TextInput
              style={[
                styles.form_input,
                {
                  flex: 1,
                  borderWidth: 0,
                  paddingRight: 0,
                  backgroundColor: "transparent",
                },
              ]}
              placeholder="Birth Date (YYYY-MM-DD)"
              value={birthDate}
              onChangeText={setBirthDate}
            />
            <Ionicons
              name="calendar-outline"
              size={24}
              color="#888"
              style={{ marginLeft: 5 }}
            />
          </View>
        </View>
      </View>
      <View style={{ padding: 20 }}>
        <Text style={styles.text}>
          Get ready for exclusive promos in your birthmonth! By adding your
          birthdate, youl'll unlock soecial offeres and rewaards to make your
          celebration even sweeter.
        </Text>
      </View>
    </RegisterLayout>
  );
};

export default Step1;
