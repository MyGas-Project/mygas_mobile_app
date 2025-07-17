import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import Navigation from './src/components/Navigation';
import { StatusBar } from 'expo-status-bar';

export default function App() {

  return (
    <ThemeProvider>
      <StatusBar hidden={true} />
      <AuthProvider>
        <Navigation/>
      </AuthProvider>
    </ThemeProvider>
  );
}
