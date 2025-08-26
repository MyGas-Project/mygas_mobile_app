import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import Navigation from './src/components/Navigation';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import useNotifications from './src/lib/Notification';

export default function App() {
  useNotifications();

  return (
    <ThemeProvider>
      <StatusBar hidden={true} />
      <AuthProvider>
        <Navigation/>
      </AuthProvider>
    </ThemeProvider>
  );
}
