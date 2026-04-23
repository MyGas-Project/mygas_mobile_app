import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
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
  StatusBar,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../../context/AuthContext";
import { AUTH_URL, BASE_URL, processResponse } from "../../config";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AgreementScreen from "../AgreementScreen";
import { OtpInput } from "react-native-otp-entry";

import { Popover } from 'heroui-native';

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get("window");

// Responsive sizing helper
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;
const isLargeDevice = width >= 414;

const Step1 = ({ navigation }) => {
  const { styles, currentTheme, mainTheme } = useTheme();
  const [Batch1Form, setBatch1Form] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showTooltip, setShowTooltip] = useState(false);
  const [errors, setErrors] = useState({});
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");

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

  const updateBirthDate = (year, month, day) => {
    if (year.length === 4 && month && day) {
      const formattedMonth = month.padStart(2, "0");
      const formattedDay = day.padStart(2, "0");
      setBatch1Form({
        ...Batch1Form,
        birthDate: `${year}-${formattedMonth}-${formattedDay}`,
      });
    } else {
      setBatch1Form({ ...Batch1Form, birthDate: null });
    }
  };

  return (
    <SafeAreaView style={responsiveStyles.container} edges={[]}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../../assets/office.jpg')}
        resizeMode='cover'
        style={responsiveStyles.backgroundImage}
      >
        <LinearGradient
          colors={[
            'rgba(139, 44, 46, 0.92)',
            'rgba(200, 75, 58, 0.85)',
            'rgba(232, 137, 94, 0.75)',
            'rgba(244, 181, 124, 0.65)'
          ]}
          locations={[0, 0.35, 0.65, 1]}
          style={responsiveStyles.gradient}
        >
          <KeyboardAvoidingView
            style={responsiveStyles.keyboardView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              style={responsiveStyles.scrollView}
              contentContainerStyle={responsiveStyles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <ProgressIndicator step={1} />

              <View style={responsiveStyles.contentContainer}>
                <View style={responsiveStyles.headerSection}>
                  <Text style={responsiveStyles.welcomeText}>CREATE YOUR</Text>
                  <Text style={responsiveStyles.motoristaText}>ACCOUNT</Text>
                  <View style={responsiveStyles.underline} />
                  <Text style={responsiveStyles.subtitleText}>Complete Your Profile Details</Text>
                </View>

                <View style={responsiveStyles.formWrapper}>
                  <View style={responsiveStyles.inputGroup}>
                    <Text style={responsiveStyles.label}>First Name</Text>
                    <TextInput
                      style={[
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
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    />
                    {errors.firstName && (
                      <Text style={responsiveStyles.errorText}>
                        {errors.firstName}
                      </Text>
                    )}
                  </View>

                  <View style={responsiveStyles.inputGroup}>
                    <Text style={responsiveStyles.label}>Last Name</Text>
                    <TextInput
                      style={[
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
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    />
                    {errors.lastName && (
                      <Text style={responsiveStyles.errorText}>
                        {errors.lastName}
                      </Text>
                    )}
                  </View>

                  <View style={responsiveStyles.inputGroup}>
                    {/* <View style={responsiveStyles.labelRow}>
                      <Text style={responsiveStyles.label}>
                        Birth Date 
                        <Text style={responsiveStyles.optionalText}>(Optional)</Text>
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
                        <Text style={responsiveStyles.tooltipText}>
                          Get ready for exclusive promos in your birth month! By adding your
                          birthdate, you'll unlock special offers and rewards to make
                          your celebration even sweeter.
                        </Text>
                      </View>
                    )} */}
                    <View style={responsiveStyles.labelRow}>
                      <Text style={responsiveStyles.label}>
                        Birth Date
                      </Text>
                      <Popover>
                        <Popover.Trigger asChild>
                          <TouchableOpacity style={responsiveStyles.infoButton}>
                            <View style={responsiveStyles.infoIcon}>
                              <Text style={responsiveStyles.infoIconText}>i</Text>
                            </View>
                          </TouchableOpacity>
                        </Popover.Trigger>
                        <Popover.Portal>
                          <Popover.Overlay />
                          <Popover.Content
                            presentation="popover"
                            placement="bottom"
                            align="start"
                            width={270}
                            className="gap-1 rounded-xl px-3 py-3"
                          >
                            {/* <Popover.Close className="absolute top-2 right-2 z-50" /> */}
                            <Popover.Title>Birthday Promos 🎉</Popover.Title>
                            <Popover.Description>
                              Get ready for exclusive promos in your birth month! By adding your
                              birthdate, you'll unlock special offers and rewards to make
                              your celebration even sweeter.
                            </Popover.Description>
                          </Popover.Content>
                        </Popover.Portal>
                      </Popover>
                    </View>

                    {/* {showDatePicker && (
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
                                style={responsiveStyles.modalButton}
                                onPress={() => setShowDatePicker(false)}
                              >
                                <Text style={responsiveStyles.modalButtonText}>Done</Text>
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
                      <View style={[responsiveStyles.input, responsiveStyles.dateInput]}>
                        <Text style={[responsiveStyles.dateText, !Batch1Form?.birthDate && responsiveStyles.placeholderText]}>
                          {Batch1Form?.birthDate || "Select Birth Date"}
                        </Text>
                      </View>
                    </TouchableOpacity> */}
                    <View style={[{ with: "auto", flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }]}>
                      <TextInput
                        style={[
                          responsiveStyles.input,
                          { width: "30%" },
                          // errors.lastName && responsiveStyles.inputError
                        ]}
                        value={birthYear}
                        maxLength={4}
                        keyboardType="numeric"
                        onChangeText={(text) => {
                          setBirthYear(text);
                          updateBirthDate(text, birthMonth, birthDay);
                        }}
                        placeholder="Year"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)" />
                      <TextInput
                        style={[
                          responsiveStyles.input,
                          { width: "30%" },
                          // errors.lastName && responsiveStyles.inputError
                        ]}
                        value={birthMonth}
                        maxLength={2}
                        keyboardType="numeric"
                        onChangeText={(text) => {
                          setBirthMonth(text);
                          updateBirthDate(birthYear, text, birthDay);
                        }}
                        placeholder="Month"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)" />
                      <TextInput
                        style={[
                          responsiveStyles.input,
                          { width: "30%" },
                          // errors.lastName && responsiveStyles.inputError
                        ]}
                        value={birthDay}
                        maxLength={2}
                        keyboardType="numeric"
                        onChangeText={(text) => {
                          setBirthDay(text);
                          updateBirthDate(birthYear, birthMonth, text);
                        }}
                        placeholder="Day"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)" />
                    </View>
                  </View>

                  <View style={responsiveStyles.buttonGroup}>
                    <TouchableOpacity
                      style={responsiveStyles.signInButton}
                      onPress={handleNext}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#FFFFFF', '#F8F8F8']}
                        style={responsiveStyles.buttonGradient}
                      >
                        <Text style={responsiveStyles.signInText}>NEXT</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={responsiveStyles.registerButton}
                      onPress={() => navigation.goBack()}
                      activeOpacity={0.8}
                    >
                      <Text style={responsiveStyles.registerText}>CANCEL</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const Step2 = ({ navigation, route }) => {
  const { styles, currentTheme } = useTheme();
  const { Batch1Form } = route?.params || {};
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

    console.log(batch1Final);

    setLoadingState(true);
    const { statusCode, data } = await registerStep1(batch1Final);

    console.log(data);
    if (statusCode == 201) {
      setLoadingState(false);
      navigation.navigate("Step3", { data: data, batch1form: batch1Final });
    } else {
      setLoadingState(false);
      setBatch1Final({ ...batch1Final, mobileNumber: '' });
      Alert.alert("Error", data.message);
    }
  };

  return (
    <SafeAreaView style={responsiveStyles.container} edges={[]}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../../assets/office.jpg')}
        resizeMode='cover'
        style={responsiveStyles.backgroundImage}
      >
        <LinearGradient
          colors={[
            'rgba(139, 44, 46, 0.92)',
            'rgba(200, 75, 58, 0.85)',
            'rgba(232, 137, 94, 0.75)',
            'rgba(244, 181, 124, 0.65)'
          ]}
          locations={[0, 0.35, 0.65, 1]}
          style={responsiveStyles.gradient}
        >
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
                  <Text style={responsiveStyles.welcomeText}>ENTER YOUR</Text>
                  <Text style={responsiveStyles.motoristaText}>MOBILE NUMBER</Text>
                  <View style={responsiveStyles.underline} />
                </View>

                <View style={responsiveStyles.formWrapper}>
                  <View style={responsiveStyles.inputGroup}>
                    <Text style={responsiveStyles.label}>Mobile Number</Text>
                    <View style={responsiveStyles.phoneInputContainer}>
                      <Text style={responsiveStyles.countryCode}>+63</Text>
                      <TextInput
                        style={[
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
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
                      style={responsiveStyles.signInButton}
                      disabled={loadingState}
                      onPress={handleNext}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#FFFFFF', '#F8F8F8']}
                        style={responsiveStyles.buttonGradient}
                      >
                        <Text style={responsiveStyles.signInText}>
                          {loadingState ? "LOADING..." : "NEXT"}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={responsiveStyles.registerButton}
                      onPress={() => navigation.goBack()}
                      activeOpacity={0.8}
                    >
                      <Text style={responsiveStyles.registerText}>BACK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const Step3 = ({ navigation, route }) => {
  const { styles, currentTheme, mainTheme } = useTheme();
  const [code, setCode] = useState("");
  const inputs = useRef([]);
  const { data, batch1form } = route?.params || {};
  const { verifyCode } = useContext(AuthContext);
  const [loadingState, setLoadingState] = useState(false);

  const handleChange = (text, index) => {
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
    if (!code || code.length < 6) {
      Alert.alert("Incomplete Code", "Please enter all 6 digits.");
      return;
    }

    setLoadingState(true);
    try {
      const codeString = typeof code === "string" ? code : code.join("");
      console.log("Submitting code:", codeString);
      const res = await verifyCode(data.data, codeString);
      console.log("Verification result:", res);

      if (res?.statusCode == 200 || res?.statusCode == 201) {
        navigation.navigate("Step4", { res: res, data: data.data });
      } else {
        setLoadingState(false);
        Alert.alert("Invalid Code", res?.data?.message || "Verification failed");
      }
    } catch (err) {
      console.log("handleVerify error:", err);
      setLoadingState(false);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={responsiveStyles.container} edges={[]}>
      <StatusBar hidden={true} />
      <ImageBackground
        source={require('../../../assets/office.jpg')}
        resizeMode='cover'
        style={responsiveStyles.backgroundImage}
      >
        <LinearGradient
          colors={[
            'rgba(139, 44, 46, 0.92)',
            'rgba(200, 75, 58, 0.85)',
            'rgba(232, 137, 94, 0.75)',
            'rgba(244, 181, 124, 0.65)'
          ]}
          locations={[0, 0.35, 0.65, 1]}
          style={responsiveStyles.gradient}
        >
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
                  <Text style={responsiveStyles.welcomeText}>ENTER</Text>
                  <Text style={responsiveStyles.motoristaText}>VERIFICATION CODE</Text>
                  <View style={responsiveStyles.underline} />
                  <Text style={responsiveStyles.descriptionText}>
                    A one-time passcode has been sent to (+63) {batch1form?.mobileNumber || 0}. Please
                    enter the passcode to verify your phone number.
                  </Text>
                </View>

                <View style={responsiveStyles.formWrapper}>
                  <View style={responsiveStyles.codeContainer}>
                    <OtpInput
                      numberOfDigits={6}
                      // onTextChange={(text) => console.log(text)}
                      onFilled={(text) => setCode(text)}
                      focusColor="orange"
                      autoFocus={true}
                      textInputProps={{
                        accessibilityLabel: "One-Time Password",
                      }}
                      textProps={{
                        accessibilityRole: "text",
                        accessibilityLabel: "OTP digit",
                        allowFontScaling: false,
                      }}
                      theme={{
                        pinCodeContainerStyle: responsiveStyles.codeInputFilled,
                      }}
                    />
                    {/* {code.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (inputs.current[index] = ref)}
                        style={[
                          responsiveStyles.codeInput,
                          code[index] !== "" && responsiveStyles.codeInputFilled
                        ]}
                        keyboardType="numeric"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                      />
                    ))} */}
                  </View>

                  <View style={responsiveStyles.buttonGroup}>
                    <TouchableOpacity
                      style={responsiveStyles.signInButton}
                      disabled={loadingState}
                      onPress={handleVerify}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#FFFFFF', '#F8F8F8']}
                        style={responsiveStyles.buttonGradient}
                      >
                        <Text style={responsiveStyles.signInText}>
                          {loadingState ? "VERIFYING..." : "VERIFY"}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={responsiveStyles.registerButton}
                      onPress={() => navigation.goBack()}
                      activeOpacity={0.8}
                    >
                      <Text style={responsiveStyles.registerText}>BACK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const Step4 = ({ navigation, route }) => {
  const { res, data } = route?.params;
  const { styles, currentTheme } = useTheme();
  const [Batch2Form, setBatch2Form] = useState(data);
  const [errors, setErrors] = useState({});

  const validateEmail = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // if (!Batch2Form?.email || Batch2Form.email.trim() === "") {
    //   newErrors.email = "Email is required";
    // } else if (!emailRegex.test(Batch2Form.email)) {
    //   newErrors.email = "Please enter a valid email address";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateEmail()) {
      navigation.navigate("Step5", { Batch2Form });
    }
  };

  return (
    <SafeAreaView style={responsiveStyles.container} edges={[]}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../../assets/office.jpg')}
        resizeMode='cover'
        style={responsiveStyles.backgroundImage}
      >
        <LinearGradient
          colors={[
            'rgba(139, 44, 46, 0.92)',
            'rgba(200, 75, 58, 0.85)',
            'rgba(232, 137, 94, 0.75)',
            'rgba(244, 181, 124, 0.65)'
          ]}
          locations={[0, 0.35, 0.65, 1]}
          style={responsiveStyles.gradient}
        >
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
                  <Text style={responsiveStyles.welcomeText}>ENTER YOUR</Text>
                  <Text style={responsiveStyles.motoristaText}>EMAIL ADDRESS</Text>
                  <View style={responsiveStyles.underline} />
                  <Text style={responsiveStyles.descriptionText}>
                    Updates will be sent to your email address.
                  </Text>
                </View>

                <View style={responsiveStyles.formWrapper}>
                  <View style={responsiveStyles.inputGroup}>
                    <Text style={responsiveStyles.label}>Email Address (optional)</Text>
                    <TextInput
                      style={[
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
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
                      style={responsiveStyles.signInButton}
                      onPress={handleNext}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#FFFFFF', '#F8F8F8']}
                        style={responsiveStyles.buttonGradient}
                      >
                        <Text style={responsiveStyles.signInText}>NEXT</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={responsiveStyles.registerButton}
                      onPress={() => navigation.goBack()}
                      activeOpacity={0.8}
                    >
                      <Text style={responsiveStyles.registerText}>BACK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const Step5 = ({ navigation, route }) => {
  const { Batch2Form } = route.params;
  const { styles } = useTheme();
  const [finalForm, setFinalForm] = useState(Batch2Form);
  const [reconfirmPassword, setReconfirmPassword] = useState("");
  const { registerStep2 } = useContext(AuthContext);
  const [loadingState, setLoadingState] = useState(false);

  const handleConfirm = async () => {
    setLoadingState(true);

    // if (reconfirmPassword !== finalForm.password) {
    //   Alert.alert("Password Mismatch", "Passwords do not match");
    //   setLoadingState(false);
    //   return;
    // }

    const res = await registerStep2(finalForm);

    if (res.statusCode == 201) {
      navigation.navigate("Step6", { user_id: res.data.user_id });
    } else {
      setLoadingState(false);
      Alert.alert("Error", res.data.message);
    }
  };

  return (
    <SafeAreaView style={responsiveStyles.container} edges={[]}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../../assets/office.jpg')}
        resizeMode='cover'
        style={responsiveStyles.backgroundImage}
      >
        <LinearGradient
          colors={[
            'rgba(139, 44, 46, 0.92)',
            'rgba(200, 75, 58, 0.85)',
            'rgba(232, 137, 94, 0.75)',
            'rgba(244, 181, 124, 0.65)'
          ]}
          locations={[0, 0.35, 0.65, 1]}
          style={responsiveStyles.gradient}
        >
          <KeyboardAvoidingView
            style={responsiveStyles.keyboardView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              style={responsiveStyles.scrollView}
              contentContainerStyle={responsiveStyles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <ProgressIndicator step={5} />

              <View style={responsiveStyles.contentContainer}>
                <View style={responsiveStyles.headerSection}>
                  <Text style={responsiveStyles.welcomeText}>CREATE YOUR</Text>
                  <Text style={responsiveStyles.motoristaText}>PASSWORD</Text>
                  <View style={responsiveStyles.underline} />
                  <Text style={responsiveStyles.descriptionText}>
                    Your password protects your account and keeps your information safe.
                  </Text>
                </View>

                <View style={responsiveStyles.formWrapper}>
                  <View style={responsiveStyles.inputGroup}>
                    <Text style={responsiveStyles.label}>Enter your password (optional)</Text>
                    <TextInput
                      style={responsiveStyles.input}
                      onChangeText={(password) => {
                        setFinalForm({
                          ...finalForm,
                          password: password,
                        })
                      }}
                      secureTextEntry={true}
                      placeholder="Password"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    />
                  </View>

                  <View style={responsiveStyles.inputGroup}>
                    <Text style={responsiveStyles.label}>Re-enter your password (optional)</Text>
                    <TextInput
                      style={responsiveStyles.input}
                      secureTextEntry={true}
                      onChangeText={(e) => {
                        setReconfirmPassword(e);
                      }}
                      placeholder="Confirm Password"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    />
                  </View>

                  <View style={responsiveStyles.buttonGroup}>
                    <TouchableOpacity
                      style={responsiveStyles.signInButton}
                      disabled={loadingState}
                      onPress={handleConfirm}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#FFFFFF', '#F8F8F8']}
                        style={responsiveStyles.buttonGradient}
                      >
                        <Text style={responsiveStyles.signInText}>
                          {loadingState ? "LOADING..." : "CONFIRM PASSWORD"}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={responsiveStyles.registerButton}
                      onPress={() => navigation.goBack()}
                      activeOpacity={0.8}
                    >
                      <Text style={responsiveStyles.registerText}>BACK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
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

  const handleConfirm = async () => {
    setLoadingState(true);
    const data = {
      user_id: user_id,
      wheel_type_id: selectedWheelType.id
    }
    const res = await registerStep3(data);
    if (res.statusCode == 201 || res.statusCode == 200) {
      navigation.navigate('AgreementScreen', { label: 'register_2' });
    } else {
      setLoadingState(false);
      Alert.alert("Error", res.data.message);
    }
  };

  return (
    <SafeAreaView style={responsiveStyles.container} edges={[]}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../../assets/office.jpg')}
        resizeMode='cover'
        style={responsiveStyles.backgroundImage}
      >
        <LinearGradient
          colors={[
            'rgba(139, 44, 46, 0.92)',
            'rgba(200, 75, 58, 0.85)',
            'rgba(232, 137, 94, 0.75)',
            'rgba(244, 181, 124, 0.65)'
          ]}
          locations={[0, 0.35, 0.65, 1]}
          style={responsiveStyles.gradient}
        >
          <KeyboardAvoidingView
            style={responsiveStyles.keyboardView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              style={responsiveStyles.scrollView}
              contentContainerStyle={responsiveStyles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <ProgressIndicator step={6} />

              <View style={responsiveStyles.contentContainer}>
                <View style={responsiveStyles.headerSection}>
                  <Text style={responsiveStyles.welcomeText}>SELECT YOUR</Text>
                  <Text style={responsiveStyles.motoristaText}>VEHICLE TYPE</Text>
                  <View style={responsiveStyles.underline} />
                </View>

                <View style={responsiveStyles.formWrapper}>
                  <View style={responsiveStyles.inputGroup}>
                    <SelectList
                      data={wheelTypes}
                      setSelected={(val) => {
                        setSelectedWheelType(
                          wheelTypes.find((item) => item.value === val)
                        );
                      }}
                      save="value"
                      boxStyles={responsiveStyles.selectBox}
                      dropdownStyles={responsiveStyles.selectDropdown}
                      inputStyles={responsiveStyles.selectInput}
                      dropdownTextStyles={responsiveStyles.selectText}
                    />
                  </View>

                  <View style={responsiveStyles.buttonGroup}>
                    <TouchableOpacity
                      style={responsiveStyles.signInButton}
                      disabled={loadingState}
                      onPress={handleConfirm}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#FFFFFF', '#F8F8F8']}
                        style={responsiveStyles.buttonGradient}
                      >
                        <Text style={responsiveStyles.signInText}>
                          {loadingState ? "LOADING..." : "CONFIRM VEHICLE"}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={responsiveStyles.registerButton}
                      onPress={() => navigation.goBack()}
                      activeOpacity={0.8}
                    >
                      <Text style={responsiveStyles.registerText}>BACK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const Step7 = ({ navigation, route }) => {
  const { styles, mainTheme, currentTheme } = useTheme();

  return (
    <SafeAreaView style={responsiveStyles.container} edges={[]}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../../../assets/office.jpg')}
        resizeMode='cover'
        style={responsiveStyles.backgroundImage}
      >
        <LinearGradient
          colors={[
            'rgba(139, 44, 46, 0.92)',
            'rgba(200, 75, 58, 0.85)',
            'rgba(232, 137, 94, 0.75)',
            'rgba(244, 181, 124, 0.65)'
          ]}
          locations={[0, 0.35, 0.65, 1]}
          style={responsiveStyles.gradient}
        >
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

                <Text style={responsiveStyles.successTitle}>
                  THANK YOU FOR REGISTERING!
                </Text>

                <Text style={responsiveStyles.successDescription}>
                  You can now proceed to the nearest station for your barcode number and verification processing.
                </Text>

                <View style={responsiveStyles.successButtonContainer}>
                  <TouchableOpacity
                    style={responsiveStyles.signInButton}
                    onPress={() => navigation.navigate("Login")}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#FFFFFF', '#F8F8F8']}
                      style={responsiveStyles.buttonGradient}
                    >
                      <Text style={responsiveStyles.signInText}>COMPLETE REGISTRATION</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const ProgressIndicator = ({ step }) => {
  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  return (
    <View style={responsiveStyles.progressContainer}>
      <View style={responsiveStyles.progressBarContainer}>
        <View style={responsiveStyles.progressBar}>
          <View
            style={[
              responsiveStyles.progressFill,
              { width: `${progress}%` }
            ]}
          />
        </View>
        <Text style={responsiveStyles.progressText}>
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
      <Stack.Screen name="AgreementScreen" component={AgreementScreen} />
      <Stack.Screen name="Step7" component={Step7} />
    </Stack.Navigator>
  );
}

const responsiveStyles = StyleSheet.create({
  // Base containers
  container: {
    flex: 1,
    backgroundColor: '#8B2C2E',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: isSmallDevice ? 20 : 30,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: isSmallDevice ? 20 : 28,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
  },

  // Header section
  headerSection: {
    marginTop: isSmallDevice ? 20 : 30,
    marginBottom: isSmallDevice ? 24 : 36,
  },
  welcomeText: {
    fontSize: isSmallDevice ? 28 : isLargeDevice ? 38 : 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    lineHeight: isSmallDevice ? 34 : isLargeDevice ? 44 : 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  motoristaText: {
    fontSize: isSmallDevice ? 28 : isLargeDevice ? 38 : 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    lineHeight: isSmallDevice ? 34 : isLargeDevice ? 44 : 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  underline: {
    width: 80,
    height: 4,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  subtitleText: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: isSmallDevice ? 20 : 24,
    letterSpacing: 0.3,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  descriptionText: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: isSmallDevice ? 18 : 20,
    letterSpacing: 0.2,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Form wrapper
  formWrapper: {
    flex: 1,
  },

  // Input groups
  inputGroup: {
    marginBottom: isSmallDevice ? 18 : 24,
  },
  label: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: isSmallDevice ? 14 : 16,
    paddingHorizontal: 16,
    fontSize: isSmallDevice ? 15 : 16,
    color: '#FFFFFF',
    fontWeight: '500',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputError: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  dateInput: {
    justifyContent: 'center',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: '500',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },

  // Phone input
  phoneInputContainer: {
    position: 'relative',
  },
  phoneInput: {
    paddingLeft: 60,
  },
  countryCode: {
    position: 'absolute',
    top: isSmallDevice ? 14 : 16,
    left: 16,
    fontSize: isSmallDevice ? 15 : 16,
    color: '#FFFFFF',
    fontWeight: '600',
    zIndex: 1,
  },

  // Helper and error text
  helperText: {
    fontSize: isSmallDevice ? 11 : 12,
    marginTop: 6,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: isSmallDevice ? 15 : 16,
  },
  errorText: {
    fontSize: isSmallDevice ? 11 : 12,
    marginTop: 6,
    color: '#FFD700',
    lineHeight: isSmallDevice ? 15 : 16,
    fontWeight: '600',
  },

  // Tooltip
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionalText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: isSmallDevice ? 12 : 13,
  },
  infoButton: {
    marginLeft: 8,
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FFFFFF',
  },
  tooltipText: {
    fontSize: isSmallDevice ? 12 : 13,
    lineHeight: isSmallDevice ? 17 : 18,
    color: '#FFFFFF',
    opacity: 0.9,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalButton: {
    backgroundColor: '#8B2C2E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Code input
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: isSmallDevice ? 24 : 30,
    paddingHorizontal: 10,
  },
  codeInput: {
    width: isSmallDevice ? 45 : 50,
    height: isSmallDevice ? 55 : 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    fontSize: isSmallDevice ? 22 : 24,
    fontWeight: '600',
    borderRadius: 12,
    color: '#FFFFFF',
  },
  codeInputFilled: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // SelectList styling
  selectBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: isSmallDevice ? 14 : 16,
  },
  selectDropdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    marginTop: 8,
  },
  selectInput: {
    color: '#FFFFFF',
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: '500',
  },
  selectText: {
    color: '#8B2C2E',
    fontSize: isSmallDevice ? 14 : 15,
  },

  // Buttons
  buttonGroup: {
    marginTop: isSmallDevice ? 20 : 30,
    gap: isSmallDevice ? 12 : 14,
  },
  signInButton: {
    borderRadius: 16,
    shadowColor: '#8B2C2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: isSmallDevice ? 17 : 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  signInText: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '900',
    color: '#8B2C2E',
    letterSpacing: 2.5,
  },
  registerButton: {
    backgroundColor: '#8B2C2E',
    borderRadius: 16,
    paddingVertical: isSmallDevice ? 17 : 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  registerText: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2.5,
  },

  // Progress indicator
  progressContainer: {
    paddingHorizontal: isSmallDevice ? 20 : 28,
    paddingTop: isSmallDevice ? 30 : 55,
    paddingBottom: isSmallDevice ? 10 : 15,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: isSmallDevice ? 12 : 13,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    opacity: 0.9,
  },

  // Success screen
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  successIconContainer: {
    width: isSmallDevice ? 90 : 100,
    height: isSmallDevice ? 90 : 100,
    borderRadius: isSmallDevice ? 45 : 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  successIcon: {
    fontSize: isSmallDevice ? 55 : 60,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: isSmallDevice ? 30 : 34,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  successDescription: {
    fontSize: isSmallDevice ? 14 : 15,
    textAlign: 'center',
    lineHeight: isSmallDevice ? 20 : 22,
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  successButtonContainer: {
    width: '100%',
  },
});