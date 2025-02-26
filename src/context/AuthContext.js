import React, {createContext, useContext, useState} from 'react'

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const login = (email, password) => {
        
    }
    const register = (email, password) => {
        
    }
    const logout = () => {
        
    }
    return (
        <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
    )
}