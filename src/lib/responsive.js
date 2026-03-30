import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const wp = (percentage) => (percentage * screenWidth) / 100;
export const hp = (percentage) => (percentage * screenHeight) / 100;

export const isTablet = screenWidth >= 768;
export const isSmallScreen = screenWidth < 375;
