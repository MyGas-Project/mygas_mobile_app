import { View, Text } from 'react-native';
import React, {useContext} from 'react';
import { useTheme } from '../context/ThemeContext';

export default function WelcomeScreen() {
    const {styles, theme} = useTheme();
    return (
        <View style={styles.container}>
            <Text>{theme}</Text>
        </View>
    )
}