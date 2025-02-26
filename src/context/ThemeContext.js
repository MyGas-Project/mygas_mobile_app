import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, Appearance, useColorScheme } from 'react-native';

const lightTheme = {
  backgroundColor: '#ffffff',
  textColor: '#333333',
  buttonColor: '#007BFF',
};

const darkTheme = {
  backgroundColor: '#333333',
  textColor: '#ffffff',
  buttonColor: '#007BFF',
};

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('Color Scheme Changed:', colorScheme);
      setTheme(colorScheme);
    });
  
    return () => {
      subscription.remove();
    };
  }, []);
  
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontFamily: 'Roboto',
      fontSize: 16,
      color: currentTheme.textColor,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: currentTheme.textColor,
      textAlign: 'center',
      marginBottom: 16,
    },
    button: {
      backgroundColor: currentTheme.buttonColor,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
    },
  });

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, styles }}>
      {children}
    </ThemeContext.Provider>
  );
};