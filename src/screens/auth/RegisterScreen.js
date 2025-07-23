import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ImageBackground,
  Alert,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";
import { AUTH_URL, BASE_URL, processResponse } from "../../config";
import { SelectList } from "react-native-dropdown-select-list";

const Stack = createNativeStackNavigator();
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

// 

const Step1 = ({ navigation }) => {
  const { styles } = useTheme();
  const [Batch1Form, setBatch1Form] = useState({});

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 25}}>
                    <Image source={require('../../../assets/arrow-circle-left.png')} style={styles.top_bar_button}/>
                </TouchableOpacity> */}
      </ImageBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ProgressIndicator step={1} />
        <ScrollView style={styles.auth_content}>
          <View style={{ padding: 20 }}>
            <Text style={[styles.text]}>Create Your Account</Text>
            <Text style={[styles.text, styles.text_lg]}>
              Complete Your Profile Details
            </Text>
            <Text style={styles.text}>
              Finish your profile to get personalized offers, rewards, and a
              better fueling experience. Update now and start enjoying the
              perks!
            </Text>
          </View>

          <View style={styles.form_container}>
            <View style={styles.form_section}>
              <TextInput
                style={styles.form_input}
                value={Batch1Form?.firstName || ""}
                onChangeText={() => {
                  setBatch1Form({
                    ...Batch1Form,
                    firstName: firstName
                  })
                }}
                placeholder="First Name"
              />
            </View>
            <View style={styles.form_section}>
              <TextInput
                style={styles.form_input}
                value={Batch1Form?.lastName || ""}
                onChangeText={() => {
                  setBatch1Form({
                    ...Batch1Form,
                    lastName: lastName
                  })
                }}
                placeholder="Last Name"
              />
            </View>
            <View style={styles.form_section}>
              <TextInput
                style={styles.form_input}
                value={Batch1Form?.birthDate || ""}
                onChangeText={() => {
                  setBatch1Form({
                    ...Batch1Form,
                    birthDate: birthDate
                  })
                }}
                placeholder="Birth Date"
              />
            </View>
          </View>

          <View style={{ padding: 20 }}>
            <Text style={styles.text}>
              Get ready for exclusive promos in your birthmonth! By adding your
              birthdate, youl'll unlock soecial offeres and rewaards to make
              your celebration even sweeter.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer_button_container}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => {
            navigation.navigate("Step2");
          }}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Step2 = ({ navigation, route }) => {
  const { styles } = useTheme();


  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 25}}>
                    <Image source={require('../../../assets/arrow-circle-left.png')} style={styles.top_bar_button}/>
                </TouchableOpacity> */}
      </ImageBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ProgressIndicator step={2} />
        <ScrollView style={styles.auth_content}>
          <View style={{ padding: 20 }} onChange>
            <Text style={[styles.text, styles.text_md]}>
              Create Your Account
            </Text>
            <Text style={[styles.text, styles.text_lg]}>
              Enter Your Mobile Number
            </Text>
          </View>
          <View style={styles.form_container}>
            <View style={styles.form_section}>
              <TextInput
                style={styles.form_input}
                // value={mobileNumber}
                // onChangeText={setMobileNumber}
                placeholder="Mobile Number"
                keyboardType="numeric"
                maxLength={10}
              />
              <Text style={styles.form_input_info}>
                Please enter 10-digit number, excluding 0 at the beginning.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              navigation.navigate("Step4");
            }}
          >
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Step3 = ({ navigation, route }) => {
  const { styles } = useTheme();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) text = text.charAt(0);
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1].focus(); // Move to next input
    }

    if (newCode.every((digit) => digit !== "")) {
      console.log(newCode.join("")); // Call verification function
    }
  };

  const handleKeyPress = (e, index) => {
    console.log(e.nativeEvent.key);
    if (e.nativeEvent.key === "Backspace" && index > 0) {
      const newIndex = index === 0 ? 0 : index - 1;
      inputs.current[newIndex].focus();
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 25}}>
                    <Image source={require('../../../assets/arrow-circle-left.png')} style={styles.top_bar_button}/>
                </TouchableOpacity> */}
      </ImageBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ProgressIndicator step={3} />
        <ScrollView style={styles.auth_content}>
          <View style={{ padding: 20 }}>
            <Text style={[styles.text, styles.text_md]}>
              Create Your Account
            </Text>
            <Text style={[styles.text, styles.text_lg]}>
              Enter 6-digit Verification Code
            </Text>
            <Text style={styles.text}>
              A one-time passcode has been seent to (+63) 9123456789. Please
              enter the passcode to verify your phone number.
            </Text>
          </View>
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
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.primaryButton}
            // onPress={handleVerify}
            onPress={() => navigation.navigate("Step4")}
          >
            <Text style={styles.primaryButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Step4 = ({ navigation, route }) => {
  const { styles } = useTheme();

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 25}}>
                    <Image source={require('../../../assets/arrow-circle-left.png')} style={styles.top_bar_button}/>
                </TouchableOpacity> */}
      </ImageBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ProgressIndicator step={4} />
        <ScrollView style={styles.auth_content}>
          <View style={{ padding: 20 }}>
            <Text style={[styles.text, styles.text_md]}>
              Create Your Account
            </Text>
            <Text style={[styles.text, styles.text_lg]}>
              Enter Your Email Addess
            </Text>
            <Text style={styles.text}>
              Updates will be sent on your email address.
            </Text>
          </View>
          <View style={styles.form_container}>
            <View style={styles.form_section}>
              <TextInput style={styles.form_input} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Step6")}
          >
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Step5 = ({ navigation, route }) => {
  const { styles } = useTheme();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) text = text.charAt(0); // Allow only one digit
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1].focus(); // Move to next input
    }

    if (newCode.every((digit) => digit !== "")) {
      console.log(newCode.join("")); // Call verification function
    }
  };

  const handleKeyPress = (e, index) => {
    console.log(e.nativeEvent.key);
    if (e.nativeEvent.key === "Backspace" && index > 0) {
      const newIndex = index === 0 ? 0 : index - 1;
      inputs.current[newIndex].focus();
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 25}}>
                    <Image source={require('../../../assets/arrow-circle-left.png')} style={styles.top_bar_button}/>
                </TouchableOpacity> */}
      </ImageBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ProgressIndicator step={5} />
        <ScrollView style={styles.auth_content}>
          <View style={{ padding: 20 }}>
            <Text style={[styles.text, styles.text_md]}>
              Create Your Account
            </Text>
            <Text style={[styles.text, styles.text_lg]}>
              Enter 6-digit Verification Code
            </Text>
            <Text style={styles.text}>
              A one-time passcode has been seent to example@email.com. Please
              enter the passcode to verify your phone number.
            </Text>
          </View>
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
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Step6")}
          >
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Step6 = ({ navigation, route }) => {
  const { styles } = useTheme();

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 25}}>
                    <Image source={require('../../../assets/arrow-circle-left.png')} style={styles.top_bar_button}/>
                </TouchableOpacity> */}
      </ImageBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ProgressIndicator step={6} />
        <ScrollView style={styles.auth_content}>
          <View style={{ padding: 20 }}>
            <Text style={[styles.text, styles.text_md]}>
              Create Your Account
            </Text>
            <Text style={[styles.text, styles.text_lg]}>
              Create Your Account Password
            </Text>
            <Text style={styles.text}>
              Your password protects your account and keeps your information
              safe.
            </Text>
          </View>
          <View style={styles.form_container}>
            <View style={styles.form_section}>
              <Text style={styles.form_label}>Enter your password</Text>
              <TextInput style={styles.form_input} />
            </View>
            <View style={styles.form_section}>
              <Text style={styles.form_label}>Re-enter your password</Text>
              <TextInput style={styles.form_input} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Step7")}
          >
            <Text style={styles.primaryButtonText}>Confirm Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Step7 = ({ navigation, route }) => {
  const { styles } = useTheme();
  const [wheelTypes, setWheelTypes] = useState({});

  const getWheelTypes = () => {
    try {
      fetch(`${AUTH_URL}wheel-type-selection`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then(processResponse).then((res) => {
        const { statusCode, data } = res;
        if (statusCode !== 200) return;
        console.info(data.result);
        // setWheelTypes(data.result);
        setWheelTypes(
          data.result.map((item) => ({
            id: item.id,
            value: item.name,
            label: item.name
          }))
        );
        // data.map((item) => ({
        //   id: item.id,
        //   value: item.id,
        //   label: item.name
        // }))
      });
    } catch (error) {
      console.error("getWheelTypes error:", error);
    }
  };

  useEffect(() => {
    getWheelTypes();
  }, [])


  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 25}}>
                    <Image source={require('../../../assets/arrow-circle-left.png')} style={styles.top_bar_button}/>
                </TouchableOpacity> */}
      </ImageBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ProgressIndicator step={7} />
        <ScrollView style={styles.auth_content}>
          <View style={{ padding: 20 }}>
            <Text style={[styles.text, styles.text_md]}>
              Create Your Account
            </Text>
            <Text style={[styles.text, styles.text_lg]}>
              What vehicle type do you have?
            </Text>
          </View>
          <View style={styles.form_container}>
            <SelectList
              data={wheelTypes}
              setSelected={(val) => console.log(val)}
              save="value"
            />
            {/* <View style={styles.form_section}>
              <Text style={styles.form_label}>Enter your password</Text>
              <TextInput style={styles.form_input} />
            </View>
            <View style={styles.form_section}>
              <Text style={styles.form_label}>Re-enter your password</Text>
              <TextInput style={styles.form_input} />
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Step8")}
          >
            <Text style={styles.primaryButtonText}>Confirm Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Step8 = ({ navigation, route }) => {
  const { styles } = useTheme();

  const [showNotification, setShowNotification] = useState(false);

  const handleConfirm = () => {
    // Show the notification when user confirms
    setShowNotification(true);
  };

  const handleNotificationResponse = (response) => {
    setShowNotification(false);
    if (response === 'yes') {
      // Handle "Yes" action
      navigation.navigate("Welcome"); // Or wherever you want to navigate
    } else {
      // Handle "No" action
      // Maybe stay on this screen or go back
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={styles.top_bar}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}
        />
      </ImageBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ProgressIndicator step={8} />
        <ScrollView style={styles.auth_content} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
          {/* Bell Icon (optional placeholder) */}
          <Image
            source={require("../../../assets/bell.png")} // Replace with your bell icon or remove if not needed
            style={{ width: 80, height: 80, marginBottom: 30 }}
            resizeMode="contain"
          />

          {/* Heading Text */}
          <Text style={[styles.text, styles.text_lg, { textAlign: "center", fontWeight: "bold", marginBottom: 10 }]}>
            Allow push notifications and{"\n"}never miss the latest offers?
          </Text>

          {/* Subtext */}
          <Text style={[styles.text, styles.text_md, { color: "#666", textAlign: "center", marginBottom: 40 }]}>
            Turn on push notifications so we can keep you updated.
          </Text>
        </ScrollView>

      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => { handleConfirm(); navigation.navigate("Welcome") }}
          >
            <Text style={styles.primaryButtonText}>Complete Registration</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const ProgressIndicator = ({ step }) => (
  <View style={custom_styles.progressContainer}>
    <View style={custom_styles.progressBar}>
      <View
        style={[
          custom_styles.progressFill,
          { width: `${(step / 8) * (width * 0.9)}` },
        ]}
      />
    </View>
  </View>
);

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

const custom_styles = StyleSheet.create({
  progressContainer: { width: width, alignItems: "center", marginVertical: 20 },
  progressBar: {
    width: width * 0.9,
    height: 10,
    backgroundColor: "#DDD",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#ffff01" },
});
