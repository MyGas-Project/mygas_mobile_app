import React, { createContext, useState, useEffect } from "react";
import { AUTH_URL, BASE_URL, processResponse } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

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
          birthday: data.birthDate,
          phone_number: "0" + data.mobileNumber,
        }),
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
          console.log("registerStep1 response: ", res); // Add this
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
          // console.log("verification response: ", res); // Add this

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
    // console.info(data);
    try {
      return fetch(`${AUTH_URL}register/step-2`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: data.data.user_id,
          password: data.password,
          email: data.email
        }),
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
          // console.log("registerStep1 response: ", res); // Add this
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
    // console.info(data);
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
          // console.log("registerStep1 response: ", res); // Add this
          return res;
        })
        .catch((err) => {
          console.log("registerStep1 error: ", err);
        });
    } catch (error) {
      console.log("registerStep1 error: ", error);
    }
  };

  const login = async (email, password) => {
    try {
      // const token = await AsyncStorage.getItem("expoPushToken");
      // console.log(token);
      fetch(`${AUTH_URL}login-customer`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cred: email,
          password: password,
        }),
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
          console.log("login response: ", res);

          if (statusCode !== 200) {
            Alert.alert("Login Failed", data.message || "Login failed");
            return
          }

          setUserInfo(data);
          getUserDetails(data);
          AsyncStorage.setItem("userInfo", JSON.stringify(data));
          AsyncStorage.setItem("newUser", "true");

          // pushCodeNotifcation(data.user_id);
        })
        .catch((error) => {
          // console.error("login error:", error.message);
          // Alert.alert("Login Failed", error || "Login failed");
          console.error(error);
          alert("Login Catch Error: ", error);
        });
    } catch (error) {
      // console.error("login error:", error.message);
      alert("Login Error", error);
    }
  };

  const getUserDetails = (data) => {
    try {
      fetch(`${BASE_URL}customer/user-profile`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      }).then(processResponse).then((res) => {
        const { statusCode, data } = res;
        // console.log("user details: ", data.data);
        setUserDetails(data.data);
      });
    } catch (error) {
      // reject(error);
      console.error("getUserDetails error:", error);
    }
  };

  const logout = (navigation) => {
    let res;
    if (!navigation) {
      res = AsyncStorage.getItem("userInfo");
    } else {
      res = navigation
    }

    setUserInfo(null);
    setUserDetails(null);
    AsyncStorage.removeItem("userInfo");

    try {
      // console.log(navigation);
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
    const token = await AsyncStorage.getItem("expoPushToken");
    try {
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
          console.log("notification code response: ", res);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("userInfo");
        // console.info("from authcontext: ", userData);

        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserInfo(parsedData);
          getUserDetails(parsedData);
        } else {
          setUserInfo(null);
          setUserDetails(null);
          AsyncStorage.removeItem("userInfo");
        }
      } catch (e) {
        console.log("Failed to load user from storage", e);
        setUserInfo(null);
        setUserDetails(null);
        AsyncStorage.removeItem("userInfo");
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        userInfo,
        userDetails,
        registerStep1,
        verifyCode,
        registerStep2,
        registerStep3
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
