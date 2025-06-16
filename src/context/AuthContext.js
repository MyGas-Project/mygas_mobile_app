import React, {createContext, useContext, useState} from 'react'
const BASE_URL = "http://192.168.110.116:3000"

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const login = (email, password) => {
        // fetch();
    }
    const register = (email, password) => {
        
    }
    const logout = () => {
        
    }
    return (
        <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
    )
}