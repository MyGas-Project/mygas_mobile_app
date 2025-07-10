import React, { createContext, useState, useEffect } from "react";
import { AUTH_URL, BASE_URL, processResponse } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // STEP 1: Register Step 1
  const registerStep1 = (data) => {
    return new Promise((resolve, reject) => {
      fetch(`${AUTH_URL}register/step1`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
          // console.log("registerStep1 response:", res); // Add this

          if (statusCode === 200 || statusCode === 201) {
            resolve({ success: true, data: data.data }); // pass only inner `data`
          } else {
            resolve({
              success: false,
              error: data?.error || data?.message || "Step 1 failed",
            });
          }
        })
        .catch((err) => {
          console.log("registerStep1 error:", err);
          reject(err);
        });
    });
  };

  // STEP 2: Verify Code (for phone/email)
  const verifyCode = ({ user_id, code_id, code }) => {
    return new Promise((resolve, reject) => {
      fetch(
        `${AUTH_URL}verify-code?user_id=${user_id}&code_id=${code_id}&code=${code}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      )
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
          if (statusCode === 200) {
            resolve({ success: true, data });
          } else {
            resolve({
              success: false,
              error: data.error || "Verification failed",
            });
          }
        })
        .catch(reject);
    });
  };

  // STEP 3: Register Step 2
  const registerStep2 = ({ user_id, email }) => {
    return new Promise((resolve, reject) => {
      fetch(`${AUTH_URL}register/step-2`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, email }),
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
          if (statusCode === 200) {
            resolve({ success: true, data });
          } else {
            resolve({ success: false, error: data.error || "Step 2 failed" });
          }
        })
        .catch(reject);
    });
  };

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
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
          }),
        })
          .then(processResponse)
          .then((res) => {
            const { statusCode, data } = res;
            if (statusCode === 200) {
              setUserInfo(data);
              getUserDetails(data);
              AsyncStorage.setItem("userInfo", JSON.stringify(data));
              resolve({ success: true, data });
            } else {
              resolve({ success: false, error: data.error || "Login failed" });
            }
            console.log(data);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
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
        // console.log("user details: ", data);
        setUserDetails(data.data);
      });
    } catch (error) {
      reject(error);
    }
  };

  const logout = (navigation) => {
    try {
      // console.log(navigation);
      fetch(`${AUTH_URL}logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${navigation.token}`,
        },
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
          // console.info(data);
          if (statusCode == 200) {
            // console.log(data);
            setUserInfo(null);
            setUserDetails(null);
            AsyncStorage.removeItem("userInfo");
          }
          console.log(data);
        })
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("userInfo");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserInfo(parsedData);
          getUserDetails(parsedData);
        }
      } catch (e) {
        console.log("Failed to load user from storage", e);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
