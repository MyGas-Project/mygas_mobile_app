import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function SwipeableComponent({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0); // Keep track of the current slide
  const translateX = useSharedValue(0); // Initial position of the swipeable view

  const {styles} = useTheme();

  // Threshold value for swipe detection (half of screen width)
  const threshold = width / 3;

  // Gesture handler for detecting swipe
  const gestureHandler = (event) => {
    const { translationX } = event.nativeEvent;
    translateX.value = translationX; // Update translateX value during swipe
  };

  // Handle the end of the gesture
  const onGestureEnd = (event) => {
    const { translationX } = event.nativeEvent;

    // Only update slide after crossing the threshold
    if (Math.abs(translationX) > threshold) {
      if (translationX < 0 && currentSlide < slides.length - 1) {
        // Swipe left to go to the next slide
        runOnJS(setCurrentSlide)(currentSlide + 1); // Change slide index (go forward)
      } else if (translationX > 0 && currentSlide > 0) {
        // Swipe right to go to the previous slide
        runOnJS(setCurrentSlide)(currentSlide - 1); // Change slide index (go backward)
      }
    }

    // Reset translateX to center after the gesture ends
    translateX.value = withSpring(0, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const goToSlide = (slide_number) => {
    translateX.value = withTiming(-width, {}, () => {
      runOnJS(setCurrentSlide)(slide_number);
      translateX.value = withSpring(0, { damping: 15, stiffness: 300 });
    });
  };

  return (
    <View style={custom_styles.container}>
        <PanGestureHandler onGestureEvent={gestureHandler} onHandlerStateChange={onGestureEnd}>
            <Animated.View style={[custom_styles.swipeableView, animatedStyle]}>
                {slides[currentSlide]}
            </Animated.View>
        </PanGestureHandler>
        <View style={custom_styles.buttonsContainer}>
            {slides.map((slide, index) => {
                return (
                    <TouchableOpacity style={[styles.slideButton, currentSlide === index? styles.slideButtonActive : {}]} key={index} onPress={() => goToSlide(index)} disabled={currentSlide === index}>
                        {/* <Text style={custom_styles.navButtonText}>{(index + 1)}</Text> */}
                    </TouchableOpacity>
                );
            })}
        </View>
    </View>
  );
};

const custom_styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  swipeableView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#fff',
  },
  paginationText: {
    marginTop: 20,
    fontSize: 18,
    color: '#000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    width: width - 30
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
  },
});