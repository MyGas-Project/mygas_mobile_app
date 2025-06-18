import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import Navigation from './src/components/Navigation';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Navigation/>
      </AuthProvider>
    </ThemeProvider>
  );
}
