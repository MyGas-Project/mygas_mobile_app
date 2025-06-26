import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const width = Dimensions.get("window").width;

const ProgressIndicator = ({ step }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressBar}>
      <View
        style={[
          styles.progressFill,
          { width: `${(step / 8) * (width * 0.9)}` },
        ]}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  progressContainer: {
    width: width,
    alignItems: "center",
    marginVertical: 20,
  },
  progressBar: {
    width: width * 0.9,
    height: 10,
    backgroundColor: "#DDD",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ffff01",
  },
});

export default ProgressIndicator;
