import React, { createContext, useState, useEffect } from "react";
import { AUTH_URL, BASE_URL, processResponse } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      try {
        fetch(${AUTH_URL}login-customer, {
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
              console.log(data);
              setUserInfo(data);
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
  const register = (email, password) => {
    try {
      fetch(${AUTH_URL}register, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          user_type: 1, //1 customer, 2 merchant, 3 rider
          first_name: "test",
          last_name: "test",
          middle_name: "test",
          contact_no: "0000",
          address: "",
          lat: "0000",
          long: "0000",
        }),
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
          if (statusCode === 200) {
            alert(JSON.stringify(data));
          }
          console.log(data);
        })
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };
  const logout = (navigation) => {
    try {
      fetch(${AUTH_URL}logout, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: Bearer ${userInfo.token},
        },
      })
        .then(processResponse)
        .then((res) => {
          const { statusCode, data } = res;
          if (statusCode === 200) {
            console.log(data);
            setUserInfo(null);
            navigation.navigate("Login");
          }
          console.log(data);
        })
        .catch((e) => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        userInfo,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
