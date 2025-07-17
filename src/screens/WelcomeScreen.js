import { View, Text, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeableComponent from '../components/SwipeableComponent';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location'
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';

export default function WelcomeScreen({ navigation }) {
    const { theme, styles } = useTheme();

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                  Alert.alert(
                    "Location Permission Required",
                    "Please enable location services to find nearby gas stations."
                  );
                  return;
                }

                // const location = await Location.getCurrentPositionAsync({});
            } catch (error) {
                console.error("Location error:", error);
                Alert.alert(
                    "Location Error",
                    "Unable to get your current location. Using default location instead."
                );
            }
        })();
    }, []);


    const slides = [
        <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%', paddingVertical: 20, paddingHorizontal: 20 }}>
            <Text style={[styles.text, styles.text_lg]}>Welcome to MyGas Motorista Card</Text>
            <Text style={[styles.text, styles.text_sm]}>Gas Up and earn rewards and points.</Text>
        </View>,
        <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%', paddingVertical: 20, paddingHorizontal: 20 }}>
            <Text style={[styles.text, styles.text_lg]}>Fuel Up & Earn More!</Text>
            <Text style={[styles.text, styles.text_sm]}>Every fill-up brings you closer to exciting rewards and exclusive perks. Start earning today!</Text>
        </View>,
        <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%', paddingVertical: 20, paddingHorizontal: 20 }}>
            <Text style={[styles.text, styles.text_lg]}>Unlock Exclusive Promos!</Text>
            <Text style={[styles.text, styles.text_sm]}>Save more with our limited-time offers on fuel and rewards. Fill up and enjoy the benefits.</Text>
        </View>,
    ];
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/welcome.jpeg')} resizeMode='cover' style={{ flex: 1 }}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={['transparent', 'rgba(255,255,255,0.8)']}
                    style={{ position: 'absolute', bottom: 0, right: 0, left: 0, height: '100%' }}
                />
                <GestureHandlerRootView style={styles.welcome_content}>
                    <SwipeableComponent slides={slides} />
                </GestureHandlerRootView>
                <View style={styles.footer}>
                    <View style={styles.footer_button_container}>
                        <TouchableOpacity style={styles.secondaryButton}
                            onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.secondaryButtonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footer_button_container}>
                        <TouchableOpacity style={styles.primaryButton}
                            onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.primaryButtonText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            <StatusBar style={'light'} />
        </View>
    )
}