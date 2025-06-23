import React, { useState, useRef } from "react";
import { View, TextInput } from "react-native";
import { useTheme } from "../../../context/ThemeContext";

const OTPInput = ({ onComplete, length = 6 }) => {
  const { styles } = useTheme();
  const [code, setCode] = useState(Array(length).fill(""));
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) text = text.charAt(0); // Allow only one digit
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < length - 1) {
      inputs.current[index + 1].focus(); // Move to next input
    }

    if (newCode.every((digit) => digit !== "")) {
      onComplete(newCode.join("")); // Call verification function
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && index > 0) {
      const newIndex = index === 0 ? 0 : index - 1;
      inputs.current[newIndex].focus();
    }
  };

  return (
    <View style={styles.codeContainer}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          style={[
            styles.code_input,
            code[index] !== "" ? { borderColor: "#ffff01" } : {},
          ]}
          keyboardType="numeric"
          maxLength={1}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
};

export default OTPInput;
