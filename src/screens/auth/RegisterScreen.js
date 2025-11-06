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
  Modal,
} from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";
import { AUTH_URL, BASE_URL, processResponse } from "../../config";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from '@react-native-community/datetimepicker';

const Stack = createNativeStackNavigator();
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Step1 = ({ navigation }) => {
  const { styles } = useTheme();
  const [Batch1Form, setBatch1Form] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showTooltip, setShowTooltip] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!Batch1Form?.firstName || Batch1Form.firstName.trim() === "") {
      newErrors.firstName = "First Name is required";
    }

    if (!Batch1Form?.lastName || Batch1Form.lastName.trim() === "") {
      newErrors.lastName = "Last Name is required";
    }

    // Birth Date is now optional - removed validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      navigation.navigate("Step2", { Batch1Form });
    }
  };

  return (
    <>
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
          <ProgressIndicator step={1} />
          <ScrollView style={styles.auth_content}>
            <View style={{ padding: 20 }}>
              <Text style={[styles.text]}>Create Your Account</Text>
              <Text style={[styles.text, styles.text_lg]}>
                Complete Your Profile Details
              </Text>
            </View>

            <View style={styles.form_container}>
              <View style={styles.form_section}>
                <Text style={styles.text}>First Name</Text>
                <TextInput
                  style={[
                    styles.form_input,
                    errors.firstName && { borderColor: '#fe0002', borderWidth: 1.5 }
                  ]}
                  value={Batch1Form?.firstName || ""}
                  onChangeText={(firstName) => {
                    setBatch1Form({
                      ...Batch1Form,
                      firstName: firstName
                    });
                    // Clear error when user starts typing
                    if (errors.firstName) {
                      setErrors({ ...errors, firstName: null });
                    }
                  }}
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <Text style={{ color: '#fe0002', fontSize: 12, marginTop: 4 }}>
                    {errors.firstName}
                  </Text>
                )}
              </View>

              <View style={styles.form_section}>
                <Text style={styles.text}>Last Name</Text>
                <TextInput
                  style={[
                    styles.form_input,
                    errors.lastName && { borderColor: '#fe0002', borderWidth: 1.5 }
                  ]}
                  value={Batch1Form?.lastName || ""}
                  onChangeText={(lastName) => {
                    setBatch1Form({
                      ...Batch1Form,
                      lastName: lastName
                    });
                    // Clear error when user starts typing
                    if (errors.lastName) {
                      setErrors({ ...errors, lastName: null });
                    }
                  }}
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <Text style={{ color: '#fe0002', fontSize: 12, marginTop: 4 }}>
                    {errors.lastName}
                  </Text>
                )}
              </View>

              <View style={styles.form_section}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={styles.text}>Birth Date <Text style={{ color: '#999' }}>(Optional)</Text></Text>
                  <TouchableOpacity
                    onPress={() => setShowTooltip(!showTooltip)}
                    style={{ marginLeft: 6 }}
                  >
                    <View style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      borderWidth: 1.5,
                      borderColor: '#666',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Text style={{ fontSize: 12, color: '#666', fontWeight: 'bold' }}>i</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {showTooltip && (
                  <View style={{
                    backgroundColor: '#f0f0f0',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 12,
                    borderLeftWidth: 3,
                    borderLeftColor: '#fe0002'
                  }}>
                    <Text style={[styles.text, { fontSize: 13 }]}>
                      Get ready for exclusive promos in your birth month! By adding your
                      birthdate, you'll unlock special offers and rewards to make
                      your celebration even sweeter.
                    </Text>
                  </View>
                )}

                {showDatePicker && (
                  Platform.OS === "ios" ? (
                    <Modal transparent={true} animationType="slide">
                      <View style={{ flex: 1, justifyContent: "flex-end" }}>
                        <View style={{ backgroundColor: "#fff", padding: 16 }}>
                          <DateTimePicker
                            value={new Date(Batch1Form?.birthDate || Date.now())}
                            mode="date"
                            display="spinner"
                            onChange={(event, selectedDate) => {
                              if (event.type === "set") {
                                setBatch1Form({
                                  ...Batch1Form,
                                  birthDate: selectedDate.toISOString().split("T")[0],
                                });
                              }
                            }}
                          />
                          <Button title="Done" onPress={() => setShowDatePicker(false)} />
                        </View>
                      </View>
                    </Modal>
                  ) : (
                    <DateTimePicker
                      value={new Date(Batch1Form?.birthDate || Date.now())}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setBatch1Form({
                            ...Batch1Form,
                            birthDate: selectedDate.toISOString().split("T")[0],
                          });
                        }
                      }}
                    />
                  )
                )}
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <View style={styles.form_input}>
                    <Text style={styles.text}>{Batch1Form?.birthDate || "Birth Date"}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[styles.form_section, { flexDirection: "column", gap: 15 }]}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                  <Text style={styles.primaryButtonText}>Next</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

const Step2 = ({ navigation, route }) => {
  const { styles } = useTheme();
  const { Batch1Form } = route.params;
  const [batch1Final, setBatch1Final] = useState(Batch1Form);
  const { registerStep1 } = useContext(AuthContext);
  const [loadingState, setLoadingState] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!batch1Final?.mobileNumber || batch1Final.mobileNumber.trim() === "") {
      newErrors.mobileNumber = "Mobile Number is required";
    } else if (batch1Final.mobileNumber.length !== 10) {
      newErrors.mobileNumber = "Mobile Number must be exactly 10 digits";
    } else if (!/^\d{10}$/.test(batch1Final.mobileNumber)) {
      newErrors.mobileNumber = "Mobile Number must contain only digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    setLoadingState(true);
    const { statusCode, data } = await registerStep1(batch1Final);

    if (statusCode == 201) {
      navigation.navigate("Step3", { data: data, batch1form: batch1Final });
    } else {
      setLoadingState(false);
      Alert.alert("Error", data.message);
    }
    console.info(data);
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
        <ProgressIndicator step={2} />
        <ScrollView style={styles.auth_content}>
          <View style={{ padding: 20 }}>
            <Text style={[styles.text, styles.text_md]}>
              Create Your Account
            </Text>
            <Text style={[styles.text, styles.text_lg]}>
              Enter Your Mobile Number
            </Text>
          </View>
          <View style={styles.form_container}>
            <View style={styles.form_section}>
              <Text style={styles.country_code}>+63</Text>
              <TextInput
                style={[
                  styles.form_input,
                  styles.form_input_with_prefix,
                  errors.mobileNumber && { borderColor: '#fe0002', borderWidth: 1.5 }
                ]}
                value={batch1Final?.mobileNumber || ""}
                onChangeText={(mobileNumber) => {
                  const cleanedNumber = mobileNumber.replace(/^0+/, "");
                  setBatch1Final({
                    ...batch1Final,
                    mobileNumber: cleanedNumber,
                  });
                  // Clear error when user starts typing
                  if (errors.mobileNumber) {
                    setErrors({ ...errors, mobileNumber: null });
                  }
                }}
                placeholder="Mobile Number"
                keyboardType="numeric"
                maxLength={10}
              />
              {!errors.mobileNumber && (
                <Text style={styles.form_input_info}>
                  Please enter 10-digit number, excluding 0 at the beginning.
                </Text>
              )}
              {errors.mobileNumber && (
                <Text style={{ color: '#fe0002', fontSize: 12, marginTop: 4 }}>
                  {errors.mobileNumber}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.form_container}>
            <View style={[styles.form_section, { flexDirection: "column-reverse", gap: 15 }]}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                disabled={loadingState}
                onPress={handleNext}
              >
                <Text style={styles.primaryButtonText}>
                  {loadingState ? "Loading..." : "Next"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const Step3 = ({ navigation, route }) => {
  const { styles } = useTheme();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const { data, batch1form } = route.params;
  const { verifyCode } = useContext(AuthContext);
  const [loadingState, setLoadingState] = useState(false);

  const handleChange = (text, index) => {
    if (text.length > 1) text = text.charAt(0);
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1].focus(); // Move to next input
    }

    if (newCode.every((digit) => digit !== "")) {
      // console.log(newCode.join("")); // Call verification function
      // console.info(data.data.code);
      // if (newCode.join("") != data.data.code) {
      //   console.info(data);
      //   Alert.alert("Validation Error", "Invalid OTP");
      // }
    }
  };

  const handleKeyPress = (e, index) => {
    // console.log(e.nativeEvent.key);
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
              A one-time passcode has been seent to (+63) {batch1form?.mobileNumber || 0}. Please
              enter the passcode to verify your phone number.

              {data?.data.code || "empty"}
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
          <View style={[styles.codeContainer, { flexDirection: "column-reverse", gap: 15, marginHorizontal: 10, marginTop: 20 }]}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={loadingState}
              style={styles.primaryButton}
              // onPress={handleVerify}
              onPress={async () => {
                console.info(batch1form);
                const res = await verifyCode(data.data, code.join(""));
                setLoadingState(true);
                if (res.statusCode == 200) {
                  navigation.navigate("Step4", { res });
                } else {
                  setLoadingState(false);
                  Alert.alert("Invalid Code", "Verification failed");
                }
              }}
            >
              <Text style={styles.primaryButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        
      </View>
    </View>
  );
};

const Step4 = ({ navigation, route }) => {
  const { res } = route.params;
  const { styles } = useTheme();
  const [Batch2Form, setBatch2Form] = useState(res);

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
              <TextInput style={styles.form_input}
                onChangeText={(e) => { setBatch2Form({ ...Batch2Form, email: e }); }}
                value={Batch2Form.email} />
            </View>
          </View>
          <View style={styles.form_container}>
            <View style={styles.form_section}>
              <View >
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => navigation.navigate("Step6", { Batch2Form })}
                >
                  <Text style={styles.primaryButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  const { Batch2Form } = route.params;
  const { styles } = useTheme();
  const [finalForm, setFinalForm] = useState(Batch2Form);
  const [reconfirmPassword, setReconfirmPassword] = useState("");
  const { registerStep2 } = useContext(AuthContext);
  const [loadingState, setLoadingState] = useState(false);

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
              <TextInput style={styles.form_input}
                onChangeText={(password) => {
                  setFinalForm({
                    ...finalForm,
                    password: password,
                  })
                }} secureTextEntry={true} />
            </View>
            <View style={styles.form_section}>
              <Text style={styles.form_label}>Re-enter your password</Text>
              <TextInput style={styles.form_input} secureTextEntry={true}
                onChangeText={(e) => {
                  setReconfirmPassword(e);
                }} />
            </View>
            <View style={[styles.form_section, { flexDirection: "column-reverse", gap: 15}]}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                disabled={loadingState}
                onPress={async () => {
                  // console.log(finalForm);
                  setLoadingState(true);

                  if (reconfirmPassword !== finalForm.password) {
                    Alert.alert("Password Mismatch", "Passwords do not match");
                    setLoadingState(false);
                    return;
                  }

                  const res = await registerStep2(finalForm);
                  console.info(res);

                  if (res.statusCode == 201) {
                    navigation.navigate("Step7", { user_id: res.data.user_id });
                  } else {
                    setLoadingState(false);
                    Alert.alert("Error", res.data.message);
                  }
                  // navigation.navigate("Step7");
                }}
              >
                <Text style={styles.primaryButtonText}>Confirm Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const Step7 = ({ navigation, route }) => {
  const { user_id } = route.params;
  const { styles } = useTheme();
  const [wheelTypes, setWheelTypes] = useState({});
  const [selectedWheelType, setSelectedWheelType] = useState(null);
  const { registerStep3 } = useContext(AuthContext);
  const [loadingState, setLoadingState] = useState(false);

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
        setWheelTypes(
          data.result.map((item) => ({
            id: item.id,
            value: item.name,
            label: item.name
          }))
        );
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
              setSelected={(val) => {
                setSelectedWheelType(
                  wheelTypes.find((item) => item.value === val)
                );
              }}
              save="value"
            />
          </View>
          <View style={[styles.form_container, { flexDirection: "column-reverse", gap: 15, marginTop: 15 }]}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              disabled={loadingState}
              onPress={async () => {
                setLoadingState(true);
                const data = {
                  user_id: user_id,
                  wheel_type_id: selectedWheelType.id
                }
                // console.info(data);
                const res = await registerStep3(data);
                // console.log(res);
                if (res.statusCode == 201) {
                  navigation.navigate("Step8", { user_id: user_id });
                } else {
                  setLoadingState(false);
                  Alert.alert("Error", res.data.message);
                }
              }}
            >
              <Text style={styles.primaryButtonText}>Confirm Vehicle</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
          {/* Success/Checkmark Icon */}
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#4CAF50",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 30
          }}>
            <Text style={{ fontSize: 48, color: "white", fontWeight: "bold" }}>✓</Text>
          </View>

          {/* Heading Text */}
          <Text style={[styles.text, styles.text_lg, { textAlign: "center", fontWeight: "bold", marginBottom: 10 }]}>
            Thank You for Registering!
          </Text>

          {/* Subtext */}
          <Text style={[styles.text, styles.text_md, { color: "#666", textAlign: "center", marginBottom: 20, lineHeight: 24 }]}>
            You can now proceed to the nearest station for your barcode number and verification processing.
          </Text>
        </ScrollView>

      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <View style={styles.footer_button_container}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              handleConfirm();
              navigation.navigate("Login");
            }}
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
          { width: `${(step / 7) * (width * 0.9)}` },
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
