import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, Appearance, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const mainTheme = {
  primary: '#fe0002',
  accent: '#ffff01'
}
const lightTheme = {
  backgroundColor: '#ffffff',
  foregroundColor: '#343434',
  borderColor: '#DDDDDD',
  headerColor: '#DDDDDD',
  labelColor: '#333333',
  infoColor: '#777777',
};

const darkTheme = {
  backgroundColor: '#343434',
  foregroundColor: '#ffffff',
  borderColor: '#444444',
  headerColor: '333333',
  labelColor: '#F5F5F5',
  infoColor: '#888888',
};

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log("Color Scheme Changed:", colorScheme);
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
      flexDirection: 'column',
      backgroundColor: currentTheme.backgroundColor,
      height: height,
      width: width,
      alignItems: 'center'
    },
    welcome_content: {
      flex: 1,
      marginBottom: 100,
      width: width
    },
    auth_content: {
      flex: 1,
      marginTop: 10,
      marginBottom: 100,
      width: width,
      backgroundColor: currentTheme.backgroundColor,
    },
    footer: {
      flexDirection: 'row',
      height: 100,
      width: width,
      bottom: 0,
      position: 'absolute'
    },
    footer_button_container: {
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: 'center'
    },
    text: {
      fontFamily: 'Roboto',
      color: currentTheme.foregroundColor,
    },
    text_sm: {
      fontSize: 18
    },
    text_md: {
      fontSize: 24
    },
    text_lg: {
      fontSize: 35
    },
    text_primary: {
      color: mainTheme.primary
    },
    text_bold: {
      fontWeight: 'bold'
    },
    text_semibold: {
      fontWeight: 'semibold'
    },
    text_gray: {
      color: "#a8a8a8"
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: currentTheme.foregroundColor,
      textAlign: 'center',
      marginBottom: 16,
    },
    secondaryButton: {
      // backgroundColor: currentTheme.backgroundColor,
      width: '100%',
      paddingVertical: 15,
      justifyContent: 'center',
      borderRadius: 5,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: currentTheme.foregroundColor
    },
    secondaryButtonText: {
      color: currentTheme.foregroundColor,
    },
    primaryButton: {
      backgroundColor: mainTheme.primary,
      width: '100%',
      paddingVertical: 15,
      justifyContent: 'center',
      borderRadius: 5,
      alignItems: 'center'
    },
    primaryButtonText: {
      color: '#fff',
    },
    authButtonText: {
      color: '#fff',
    },
    slideButton: {
      height: 12,
      width: 12,
      borderRadius: 12,
      marginHorizontal: 10,
      borderWidth: 2,
      borderColor: mainTheme.primary
    },
    slideButtonActive: {
      width: 36,
      backgroundColor: mainTheme.primary
    },
    top_bar: {
      height: 150,
      width: '100%',
      position: 'relative',
      //backgroundColor: currentTheme.headerColor
    },
    top_bar_button: {
      width: 32,
      height: 32,
      tintColor: mainTheme.primary
    },
    logo_container: {
      width: '100%',
      paddingVertical: 50,
      alignItems: 'center',
      justifyContent: 'center'
    },
    logo: {
      width: 175,
      height: undefined,
      aspectRatio: 1/1
    },
    form_container: {
      width: '100%',
      display: 'flex',
      flex: 1,
      paddingHorizontal: 20,
    },
    form_section: {
      width: '100%',
      marginBottom: 15
    },
    form_label: {
      fontSize: 16,
      color: currentTheme.labelColor,
      marginBottom: 5
    },
    form_input: {
      borderWidth: 1,
      fontSize: 16,
      borderRadius: 5,
      width: '100%',
      borderColor: currentTheme.borderColor,
      color: currentTheme.foregroundColor,
      padding: 20
    },
    form_input_info: {
      textAlign: 'right',
      fontSize: 12,
      marginTop: 5,
      color: currentTheme.infoColor
    },
    codeContainer: {
      flexDirection: "row",
      justifyContent: 'space-around'
    },
    code_input: {
      width: 45,
      height: 60,
      borderWidth: 1,
      borderColor: currentTheme.borderColor,
      color: currentTheme.foregroundColor,
      textAlign: "center",
      fontSize: 32,
      borderRadius: 8
    },
    tabScreen: {
      flex: 1,
      width: width,
      alignItems: "center",
      borderWidth: 1
    },
    tabBar: {
      flexDirection: "row",
      height: 70,
      backgroundColor: "#FFF",
      elevation: 5,
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
    },
    tabButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
    },
    centerTabButton: {
      width: 80,
      height: 80,
      backgroundColor: "#ffffff",
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      position: "absolute",
      bottom: 30
    },
    greetingsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 40,
      alignItems: 'center'
    }
  });

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, styles }}>
      {children}
    </ThemeContext.Provider>
  );
};