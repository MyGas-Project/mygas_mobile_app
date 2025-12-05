import React, { createContext, useState, useEffect } from "react";
import { AUTH_URL, BASE_URL, processResponse } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import * as Location from "expo-location";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const registerStep1 = (data) => {
    try {
      return fetch(`${AUTH_URL}register/step1`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          birthday: data.birthDate ?? '',
          phone_number: "0" + data.mobileNumber,
        }),
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
          console.log("registerStep1 response: ", res);
          return res;
        })
        .catch((err) => {
          console.log("registerStep1 error: ", err);
        });
    } catch (error) {
      console.log("registerStep1 error: ", error);
    }
  };

  const verifyCode = (data, code) => {
    try {
      return fetch(`${AUTH_URL}verify-code`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: data.user_id,
          code: code,
          code_id: data.code_id,
        }),
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
          return res;
        })
        .catch((err) => {
          console.log("registerStep1 error: ", err);
        });
    } catch (error) {
      console.log("registerStep1 error: ", err);
    }
  };

  const registerStep2 = (data) => {
    try {
      return fetch(`${AUTH_URL}register/step-2`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: data.user_id,
          password: data.password,
          email: data.email
        }),
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
          return res;
        })
        .catch((err) => {
          console.log("registerStep1 error: ", err);
        });
    } catch (error) {
      console.log("registerStep1 error: ", error);
    }
  };

  const registerStep3 = (data) => {
    try {
      return fetch(`${AUTH_URL}register/step-3`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: data.user_id,
          wheel_type_id: data.wheel_type_id
        }),
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
          return res;
        })
        .catch((err) => {
          console.log("registerStep1 error: ", err);
        });
    } catch (error) {
      console.log("registerStep1 error: ", error);
    }
  };

  const login = async (email, password, card_login = false) => {
    try {
      fetch(`${AUTH_URL}login-customer`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cred: email,
          password: password,
          card_login: card_login
        }),
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;

          if (statusCode !== 200) {
            Alert.alert("Login Failed", data.message || "Login failed");
            return
          }

          setUserInfo(data);
          getUserDetails(data);
          AsyncStorage.setItem("userInfo", JSON.stringify(data));
          AsyncStorage.setItem("login_credentials", JSON.stringify({
            email: email,
            password: password
          }));
          AsyncStorage.setItem("newUser", "true");
          if(card_login == true){
            AsyncStorage.setItem("card_login", "true");
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Login Catch Error: ", error);
        });
    } catch (error) {
      alert("Login Error", error);
    }
  };

  const getUserDetails = (data) => {
    try {
      pushCodeNotifcation(data.user_id);
      fetch(`${BASE_URL}customer/user-profile`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      }).then(processResponse).then((res) => {
        const { statusCode, data } = res;
        setUserDetails(data.data);
      }).catch(error => {
        console.error(error);
      });
    } catch (error) {
      console.error("getUserDetails error:", error);
    }
  };

  const cardLoginVerification = (data) => {
    return fetch(`${AUTH_URL}login-using-barcode`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bar_code: data }),
    })
      .then(processResponse)
      .then((res) => {
        // console.log("cardLoginVerification response:", res);
        return res;
      })
      .catch((error) => {
        console.error("cardLoginVerification error:", error);
        throw error;
      });
  };

  const logout = async (navigation) => {
    let res;
    if (!navigation) {
      res = AsyncStorage.getItem("userInfo");
    } else {
      res = navigation
    }

    setUserInfo(null);
    setUserDetails(null);
    const allKeys = await AsyncStorage.getAllKeys();
    const keysToRemove = allKeys.filter(key => !['newUser', 'card_login'].includes(key));
    await AsyncStorage.multiRemove(keysToRemove);

    try {
      fetch(`${AUTH_URL}logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${res.token}`,
        },
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
        })
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };

  const pushCodeNotifcation = async (id) => {
    try {
      const token = await AsyncStorage.getItem("expoPushToken");
      fetch(`${AUTH_URL}save-token`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          user_id: id
        }),
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  const getLocationUser = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationEnabled(false);
        return false;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentLat = location.coords.latitude;
      const currentLong = location.coords.longitude;

      await AsyncStorage.setItem("lat_long", JSON.stringify({
        lat: currentLat,
        long: currentLong
      }));

      setUserLocation({ lat: currentLat, long: currentLong });
      setLocationEnabled(true);
      return true;

    } catch (error) {
      console.log("Location error:", error);
      setLocationEnabled(false);
      return false;
    }
  };

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationEnabled(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentLat = location.coords.latitude;
      const currentLong = location.coords.longitude;

      await AsyncStorage.setItem("lat_long", JSON.stringify({
        lat: currentLat,
        long: currentLong
      }));

      setUserLocation({ lat: currentLat, long: currentLong });
      setLocationEnabled(true);

    } catch (error) {
      console.log("Location re-check error:", error);
      setLocationEnabled(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        // Get location first (optional, can run in parallel)
        await getLocationUser();

        // Load stored user info
        const userData = await AsyncStorage.getItem("userInfo");
        if (userData) {
          const parsedData = JSON.parse(userData);
          // console.log("Loaded user from storage:", parsedData);
          setUserInfo(parsedData);
          getUserDetails(parsedData);
        }
      } catch (error) {
        console.error("Init error:", error);
      } finally {
        // Always set loading to false, whether user exists or not
        setIsLoading(false);
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        userInfo,
        userDetails,
        locationEnabled,
        cardLoginVerification,
        checkLocationPermission,
        userLocation,
        registerStep1,
        verifyCode,
        registerStep2,
        registerStep3,
        isLoading,
        getUserDetails
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};