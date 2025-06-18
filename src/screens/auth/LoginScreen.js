import { View, Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from 'react-native';
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({navigation}) {
    const { styles } = useTheme();
    return (
        <View style={styles.container}>
            <ImageBackground resizeMode='stretch' source={require('../../../assets/mygas-header.jpeg')} style={styles.top_bar}>
                <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.5)']}
                    style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0}}
                />
                {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 25}}>
                    <Image source={require('../../../assets/arrow-circle-left.png')} style={styles.top_bar_button}/>
                </TouchableOpacity> */}
            </ImageBackground>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView style={styles.auth_content}>
                    <View style={styles.logo_container}>
                        <Image source={require('../../../assets/mygas.jpg')} style={styles.logo}/>
                    </View>
                    <View style={styles.form_container}>
                        <View style={styles.form_section}>
                            <Text style={styles.form_label}>Mobile Number / Email Address</Text>
                            <TextInput style={styles.form_input}/>
                        </View>
                        <View style={styles.form_section}>
                            <Text style={styles.form_label}>Password</Text>
                            <TextInput style={styles.form_input}/>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <View style={styles.footer}>
                <View style={styles.footer_button_container}>
                    <TouchableOpacity style={styles.primaryButton}
                    onPress={() => navigation.navigate('Main')}>
                        <Text style={styles.primaryButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}