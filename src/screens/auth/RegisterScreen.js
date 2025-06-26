import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Step1 from "./steps/RegisterStep1";
import Step2 from "./steps/RegisterStep2";
import Step3 from "./steps/RegisterStep3";
import Step4 from "./steps/RegisterStep4";
import Step5 from "./steps/RegisterStep5";
import Step6 from "./steps/RegisterStep6";
import Step7 from "./steps/RegisterStep7";
import Step8 from "./steps/RegisterStep8";

const Stack = createNativeStackNavigator();

export default function RegisterScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Step1" component={Step1} />
      <Stack.Screen name="Step2" component={Step2} />
      <Stack.Screen name="Step3" component={Step3} />
      <Stack.Screen name="Step4" component={Step4} />
      <Stack.Screen name="Step5" component={Step5} />
      <Stack.Screen name="Step6" component={Step6} />
      <Stack.Screen name="Step7" component={Step7} />
      <Stack.Screen name="Step8" component={Step8} />
    </Stack.Navigator>
  );
}
