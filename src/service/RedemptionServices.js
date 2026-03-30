import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Enhanced responsive breakpoints
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768 && width < 1024;
const isLargeTablet = width >= 1024;

export const getCardWidth = () => {
    const columns = getColumnCount();
    const padding = getResponsiveValue(16, 20, 28, 36);
    const spacing = getResponsiveValue(12, 16, 20, 24);
    return (width - padding * 2 - spacing * (columns - 1)) / columns;
};

export const getResponsiveValue = (small, medium, tablet, large) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  if (isTablet) return tablet;
  return large;
};

export const getColumnCount = () => {
  if (isSmallDevice) return 2;
  if (isMediumDevice) return 2;
  if (isTablet) return 3;
  return 4;
};
