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
const { width, height } = Dimensions.get("window");

// Responsive sizing helper
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

const Step1 = ({ navigation }) => {
  const { styles, currentTheme, mainTheme } = useTheme();
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      navigation.navigate("Step2", { Batch1Form });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={responsiveStyles.header}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={StyleSheet.absoluteFillObject}
        />
      </ImageBackground>

      <KeyboardAvoidingView
        style={responsiveStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          style={responsiveStyles.scrollView}
          contentContainerStyle={responsiveStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProgressIndicator step={1} />

          <View style={responsiveStyles.contentContainer}>
            <View style={responsiveStyles.headerSection}>
              <Text style={[styles.text, responsiveStyles.subtitle]}>
                Create Your Account
              </Text>
              <Text style={[styles.text, responsiveStyles.title]}>
                Complete Your Profile Details
              </Text>
            </View>

            <View style={responsiveStyles.formWrapper}>
              <View style={responsiveStyles.inputGroup}>
                <Text style={[styles.text, responsiveStyles.label]}>First Name</Text>
                <TextInput
                  style={[
                    styles.form_input,
                    responsiveStyles.input,
                    errors.firstName && responsiveStyles.inputError
                  ]}
                  value={Batch1Form?.firstName || ""}
                  onChangeText={(firstName) => {
                    setBatch1Form({ ...Batch1Form, firstName });
                    if (errors.firstName) {
                      setErrors({ ...errors, firstName: null });
                    }
                  }}
                  placeholder="First Name"
                  placeholderTextColor={currentTheme.infoColor}
                />
                {errors.firstName && (
                  <Text style={responsiveStyles.errorText}>
                    {errors.firstName}
                  </Text>
                )}
              </View>

              <View style={responsiveStyles.inputGroup}>
                <Text style={[styles.text, responsiveStyles.label]}>Last Name</Text>
                <TextInput
                  style={[
                    styles.form_input,
                    responsiveStyles.input,
                    errors.lastName && responsiveStyles.inputError
                  ]}
                  value={Batch1Form?.lastName || ""}
                  onChangeText={(lastName) => {
                    setBatch1Form({ ...Batch1Form, lastName });
                    if (errors.lastName) {
                      setErrors({ ...errors, lastName: null });
                    }
                  }}
                  placeholder="Last Name"
                  placeholderTextColor={currentTheme.infoColor}
                />
                {errors.lastName && (
                  <Text style={responsiveStyles.errorText}>
                    {errors.lastName}
                  </Text>
                )}
              </View>

              <View style={responsiveStyles.inputGroup}>
                <View style={responsiveStyles.labelRow}>
                  <Text style={[styles.text, responsiveStyles.label]}>
                    Birth Date <Text style={responsiveStyles.optionalText}>(Optional)</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowTooltip(!showTooltip)}
                    style={responsiveStyles.infoButton}
                  >
                    <View style={responsiveStyles.infoIcon}>
                      <Text style={responsiveStyles.infoIconText}>i</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {showTooltip && (
                  <View style={responsiveStyles.tooltip}>
                    <Text style={[styles.text, responsiveStyles.tooltipText]}>
                      Get ready for exclusive promos in your birth month! By adding your
                      birthdate, you'll unlock special offers and rewards to make
                      your celebration even sweeter.
                    </Text>
                  </View>
                )}

                {showDatePicker && (
                  Platform.OS === "ios" ? (
                    <Modal transparent={true} animationType="slide">
                      <View style={responsiveStyles.modalOverlay}>
                        <View style={responsiveStyles.modalContent}>
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
                          <TouchableOpacity
                            style={[styles.primaryButton, { marginTop: 16 }]}
                            onPress={() => setShowDatePicker(false)}
                          >
                            <Text style={styles.primaryButtonText}>Done</Text>
                          </TouchableOpacity>
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
                  <View style={[styles.form_input, responsiveStyles.input, responsiveStyles.dateInput]}>
                    <Text style={[styles.text, !Batch1Form?.birthDate && { color: currentTheme.infoColor }]}>
                      {Batch1Form?.birthDate || "Select Birth Date"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={responsiveStyles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.primaryButton, responsiveStyles.button]}
                  onPress={handleNext}
                >
                  <Text style={[styles.primaryButtonText, responsiveStyles.buttonText]}>Next</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryButton, responsiveStyles.button]}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={[styles.secondaryButtonText, responsiveStyles.buttonText]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const Step2 = ({ navigation, route }) => {
  const { styles, currentTheme } = useTheme();
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
      setLoadingState(false);
      navigation.navigate("Step3", { data: data, batch1form: batch1Final });
    } else {
      setLoadingState(false);
      Alert.alert("Error", data.message);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={responsiveStyles.header}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={StyleSheet.absoluteFillObject}
        />
      </ImageBackground>

      <KeyboardAvoidingView
        style={responsiveStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={responsiveStyles.scrollView}
          contentContainerStyle={responsiveStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProgressIndicator step={2} />

          <View style={responsiveStyles.contentContainer}>
            <View style={responsiveStyles.headerSection}>
              <Text style={[styles.text, responsiveStyles.subtitle]}>
                Create Your Account
              </Text>
              <Text style={[styles.text, responsiveStyles.title]}>
                Enter Your Mobile Number
              </Text>
            </View>

            <View style={responsiveStyles.formWrapper}>
              <View style={responsiveStyles.inputGroup}>
                <Text style={[styles.text, responsiveStyles.label]}>Mobile Number</Text>
                <View style={responsiveStyles.phoneInputContainer}>
                  <Text style={responsiveStyles.countryCode}>+63</Text>
                  <TextInput
                    style={[
                      styles.form_input,
                      responsiveStyles.input,
                      responsiveStyles.phoneInput,
                      errors.mobileNumber && responsiveStyles.inputError
                    ]}
                    value={batch1Final?.mobileNumber || ""}
                    onChangeText={(mobileNumber) => {
                      const cleanedNumber = mobileNumber.replace(/^0+/, "");
                      setBatch1Final({ ...batch1Final, mobileNumber: cleanedNumber });
                      if (errors.mobileNumber) {
                        setErrors({ ...errors, mobileNumber: null });
                      }
                    }}
                    placeholder="9XX XXX XXXX"
                    placeholderTextColor={currentTheme.infoColor}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
                {!errors.mobileNumber && (
                  <Text style={responsiveStyles.helperText}>
                    Please enter 10-digit number, excluding 0 at the beginning.
                  </Text>
                )}
                {errors.mobileNumber && (
                  <Text style={responsiveStyles.errorText}>
                    {errors.mobileNumber}
                  </Text>
                )}
              </View>

              <View style={responsiveStyles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.primaryButton, responsiveStyles.button]}
                  disabled={loadingState}
                  onPress={handleNext}
                >
                  <Text style={[styles.primaryButtonText, responsiveStyles.buttonText]}>
                    {loadingState ? "Loading..." : "Next"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryButton, responsiveStyles.button]}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={[styles.secondaryButtonText, responsiveStyles.buttonText]}>Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const Step3 = ({ navigation, route }) => {
  const { styles, currentTheme, mainTheme } = useTheme();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const { data, batch1form } = route.params;
  const { verifyCode } = useContext(AuthContext);
  const [loadingState, setLoadingState] = useState(false);

  const handleChange = (text, index) => {
    // console.log(data);
    if (text.length > 1) text = text.charAt(0);
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && !code[index]) {
      const newIndex = index === 0 ? 0 : index - 1;
      inputs.current[newIndex].focus();
    }
  };

  const handleVerify = async () => {
    setLoadingState(true);
    const res = await verifyCode(data.data, code.join(""));
    // console.log(res);

    if (res.statusCode == 200 || res.statusCode == 201) {
      navigation.navigate("Step4", { res: res, data: data.data });
    } else {
      setLoadingState(false);
      Alert.alert("Invalid Code", "Verification failed");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={responsiveStyles.header}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={StyleSheet.absoluteFillObject}
        />
      </ImageBackground>

      <KeyboardAvoidingView
        style={responsiveStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={responsiveStyles.scrollView}
          contentContainerStyle={responsiveStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProgressIndicator step={3} />

          <View style={responsiveStyles.contentContainer}>
            <View style={responsiveStyles.headerSection}>
              <Text style={[styles.text, responsiveStyles.subtitle]}>
                Create Your Account
              </Text>
              <Text style={[styles.text, responsiveStyles.title]}>
                Enter Verification Code
              </Text>
              <Text style={[styles.text, responsiveStyles.description]}>
                A one-time passcode has been sent to (+63) {batch1form?.mobileNumber || 0}. Please
                enter the passcode to verify your phone number. 
                {/* (code: {data.data.code}) */}
              </Text>
            </View>

            <View style={responsiveStyles.formWrapper}>
              <View style={responsiveStyles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputs.current[index] = ref)}
                    style={[
                      responsiveStyles.codeInput,
                      code[index] !== "" && { borderColor: mainTheme.accent, borderWidth: 2 }
                    ]}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                  />
                ))}
              </View>

              <View style={responsiveStyles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.primaryButton, responsiveStyles.button]}
                  disabled={loadingState}
                  onPress={handleVerify}
                >
                  <Text style={[styles.primaryButtonText, responsiveStyles.buttonText]}>
                    {loadingState ? "Verifying..." : "Verify"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryButton, responsiveStyles.button]}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={[styles.secondaryButtonText, responsiveStyles.buttonText]}>Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const Step4 = ({ navigation, route }) => {
  const { res, data } = route.params;
  const { styles, currentTheme } = useTheme();
  const [Batch2Form, setBatch2Form] = useState(data);
  const [errors, setErrors] = useState({});

  const validateEmail = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!Batch2Form?.email || Batch2Form.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(Batch2Form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // console.log(res, data);
    if (validateEmail()) {
      navigation.navigate("Step5", { Batch2Form });
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={responsiveStyles.header}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={StyleSheet.absoluteFillObject}
        />
      </ImageBackground>

      <KeyboardAvoidingView
        style={responsiveStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={responsiveStyles.scrollView}
          contentContainerStyle={responsiveStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ProgressIndicator step={4} />

          <View style={responsiveStyles.contentContainer}>
            <View style={responsiveStyles.headerSection}>
              <Text style={[styles.text, responsiveStyles.subtitle]}>
                Create Your Account
              </Text>
              <Text style={[styles.text, responsiveStyles.title]}>
                Enter Your Email Address
              </Text>
              <Text style={[styles.text, responsiveStyles.description]}>
                Updates will be sent to your email address.
              </Text>
            </View>

            <View style={responsiveStyles.formWrapper}>
              <View style={responsiveStyles.inputGroup}>
                <Text style={[styles.text, responsiveStyles.label]}>Email Address</Text>
                <TextInput
                  style={[
                    styles.form_input,
                    responsiveStyles.input,
                    errors.email && responsiveStyles.inputError
                  ]}
                  onChangeText={(e) => {
                    setBatch2Form({ ...Batch2Form, email: e });
                    if (errors.email) {
                      setErrors({ ...errors, email: null });
                    }
                  }}
                  value={Batch2Form.email}
                  placeholder="your.email@example.com"
                  placeholderTextColor={currentTheme.infoColor}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && (
                  <Text style={responsiveStyles.errorText}>
                    {errors.email}
                  </Text>
                )}
              </View>

              <View style={responsiveStyles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.primaryButton, responsiveStyles.button]}
                  onPress={handleNext}
                >
                  <Text style={[styles.primaryButtonText, responsiveStyles.buttonText]}>Next</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryButton, responsiveStyles.button]}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={[styles.secondaryButtonText, responsiveStyles.buttonText]}>Back</Text>
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
        <ProgressIndicator step={5} />
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
                onPress={async () => {
                  console.log(finalForm);
                  setLoadingState(true);

                  // if (reconfirmPassword !== finalForm.password) {
                  //   Alert.alert("Password Mismatch", "Passwords do not match");
                  //   setLoadingState(false);
                  //   return;
                  // }

                  const res = await registerStep2(finalForm);
                  console.info(res);

                  if (res.statusCode == 201) {
                    navigation.navigate("Step6", { user_id: res.data.user_id });
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

const Step6 = ({ navigation, route }) => {
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
        <ProgressIndicator step={6} />
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
                  navigation.navigate("Step7", { user_id: user_id });
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

const Step7 = ({ navigation, route }) => {
  const { styles, mainTheme, currentTheme } = useTheme();

  return (
    <View style={styles.container}>
      <ImageBackground
        resizeMode="stretch"
        source={require("../../../assets/mygas-header.jpeg")}
        style={responsiveStyles.header}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.5)"]}
          style={StyleSheet.absoluteFillObject}
        />
      </ImageBackground>

      <KeyboardAvoidingView
        style={responsiveStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={responsiveStyles.scrollView}
          contentContainerStyle={[responsiveStyles.scrollContent, { justifyContent: 'center' }]}
          showsVerticalScrollIndicator={false}
        >
          <ProgressIndicator step={7} />

          <View style={responsiveStyles.successContainer}>
            <View style={responsiveStyles.successIconContainer}>
              <Text style={responsiveStyles.successIcon}>✓</Text>
            </View>

            <Text style={[styles.text, responsiveStyles.successTitle]}>
              Thank You for Registering!
            </Text>

            <Text style={[styles.text, responsiveStyles.successDescription]}>
              You can now proceed to the nearest station for your barcode number and verification processing.
            </Text>

            <View style={responsiveStyles.successButtonContainer}>
              <TouchableOpacity
                style={[styles.primaryButton, responsiveStyles.button]}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={[styles.primaryButtonText, responsiveStyles.buttonText]}>
                  Complete Registration
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const ProgressIndicator = ({ step }) => {
  const { mainTheme, currentTheme } = useTheme();
  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  return (
    <View style={responsiveStyles.progressContainer}>
      <View style={responsiveStyles.progressBarContainer}>
        <View style={[responsiveStyles.progressBar, { backgroundColor: currentTheme.borderColor }]}>
          <View
            style={[
              responsiveStyles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: mainTheme.accent
              }
            ]}
          />
        </View>
        <Text style={[responsiveStyles.progressText, { color: currentTheme.foregroundColor }]}>
          Step {step} of {totalSteps}
        </Text>
      </View>
    </View>
  );
};

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
    </Stack.Navigator>
  );
}

const responsiveStyles = StyleSheet.create({
  // Layout containers
  keyboardView: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scale(30),
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: scale(20),
  },

  // Header
  header: {
    height: verticalScale(120),
    width: '100%',
    position: 'relative',
  },

  // Section headers
  headerSection: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(30),
  },
  subtitle: {
    fontSize: scale(16),
    marginBottom: verticalScale(8),
    opacity: 0.7,
  },
  title: {
    fontSize: scale(28),
    fontWeight: 'bold',
    marginBottom: verticalScale(12),
    lineHeight: scale(34),
  },
  description: {
    fontSize: scale(14),
    lineHeight: scale(20),
    opacity: 0.8,
  },

  // Form wrapper
  formWrapper: {
    flex: 1,
  },

  // Input groups
  inputGroup: {
    marginBottom: verticalScale(24),
  },
  label: {
    fontSize: scale(14),
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  input: {
    fontSize: scale(16),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    borderRadius: 8,
    minHeight: verticalScale(56),
  },
  inputError: {
    borderColor: '#fe0002',
    borderWidth: 2,
  },
  dateInput: {
    justifyContent: 'center',
  },

  // Phone input
  phoneInputContainer: {
    position: 'relative',
  },
  phoneInput: {
    paddingLeft: scale(60),
  },
  countryCode: {
    position: 'absolute',
    top: verticalScale(18),
    left: scale(16),
    fontSize: scale(16),
    color: '#666',
    fontWeight: '600',
    zIndex: 1,
  },

  // Helper and error text
  helperText: {
    fontSize: scale(12),
    marginTop: verticalScale(6),
    color: '#666',
    lineHeight: scale(16),
  },
  errorText: {
    fontSize: scale(12),
    marginTop: verticalScale(6),
    color: '#fe0002',
    lineHeight: scale(16),
  },

  // Tooltip
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  optionalText: {
    color: '#999',
    fontSize: scale(13),
  },
  infoButton: {
    marginLeft: scale(8),
  },
  infoIcon: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    borderWidth: 1.5,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconText: {
    fontSize: scale(13),
    color: '#666',
    fontWeight: 'bold',
  },
  tooltip: {
    backgroundColor: '#f5f5f5',
    padding: scale(14),
    borderRadius: 8,
    marginBottom: verticalScale(16),
    borderLeftWidth: 3,
    borderLeftColor: '#fe0002',
  },
  tooltipText: {
    fontSize: scale(13),
    lineHeight: scale(18),
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: scale(20),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  // Code input
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(30),
    paddingHorizontal: scale(10),
  },
  codeInput: {
    width: scale(48),
    height: verticalScale(60),
    borderWidth: 2,
    borderColor: '#ddd',
    textAlign: 'center',
    fontSize: scale(24),
    fontWeight: '600',
    borderRadius: 12,
  },

  // Buttons
  buttonGroup: {
    marginTop: verticalScale(20),
    gap: verticalScale(12),
  },
  button: {
    paddingVertical: verticalScale(16),
    borderRadius: 8,
    minHeight: verticalScale(56),
  },
  buttonText: {
    fontSize: scale(16),
    fontWeight: '600',
  },

  // Progress indicator
  progressContainer: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: verticalScale(8),
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: scale(13),
    marginTop: verticalScale(8),
    textAlign: 'center',
    fontWeight: '500',
  },

  // Success screen
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(30),
    paddingVertical: verticalScale(40),
  },
  successIconContainer: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(30),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  successIcon: {
    fontSize: scale(60),
    color: '#fff',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: scale(26),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: verticalScale(16),
    lineHeight: scale(32),
  },
  successDescription: {
    fontSize: scale(15),
    textAlign: 'center',
    lineHeight: scale(22),
    opacity: 0.8,
    marginBottom: verticalScale(40),
  },
  successButtonContainer: {
    width: '100%',
    maxWidth: scale(400),
  },
});