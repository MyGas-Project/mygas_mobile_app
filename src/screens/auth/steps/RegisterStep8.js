import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import RegisterLayout from "../components/RegisterLayout";
import { Ionicons } from "@expo/vector-icons";

export default function Step8({ navigation }) {
  const { styles } = useTheme();

  return (
    <RegisterLayout
      step={8}
      navigation={navigation}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate("Login")}
      backText="No, thank you."
      nextText="Yes, please."
    >
      <View style={{ padding: 20 }}>
        <View
          style={{
            shadowColor: "#000",
            alignItems: "center",
            marginTop: 150,
          }}
        >
          <Ionicons
            name="notifications"
            size={100}
            color="#FFCC00"
            style={{ marginBottom: 15 }}
          />
          <Text
            style={[
              styles.text,
              styles.text_lg,
              { textAlign: "center", fontSize: 25 },
            ]}
          >
            Allow push notifications and never miss the latest offers?
          </Text>
          <Text
            style={[
              styles.text,
              styles.text_md,
              { textAlign: "center", fontSize: 14, marginTop: 10 },
            ]}
          >
            Turn on push notifications so we can keep you updated.
          </Text>
        </View>
      </View>
    </RegisterLayout>
  );
}
