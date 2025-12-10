import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(username.trim(), password.trim());
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'employee' | 'admin') => {
    const credentials = role === 'employee' 
      ? { username: 'user', password: 'password' }
      : { username: 'admin', password: 'password' };
    
    setUsername(credentials.username);
    setPassword(credentials.password);
    setIsLoading(true);
    try {
      await onLogin(credentials.username, credentials.password);
    } catch (error) {
      Alert.alert('Login Failed', `${role} login failed`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: textColor + '80' }]}>
            Please sign in to your account
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: textColor }]}>Username</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  color: textColor,
                  borderColor: textColor + '30',
                  backgroundColor: backgroundColor,
                }
              ]}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              placeholderTextColor={textColor + '60'}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: textColor }]}>Password</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  color: textColor,
                  borderColor: textColor + '30',
                  backgroundColor: backgroundColor,
                }
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={textColor + '60'}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              { 
                backgroundColor: tintColor,
                opacity: isLoading ? 0.7 : 1,
              }
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.demoButtonsContainer}>
            <TouchableOpacity
              style={[styles.demoButton, { borderColor: '#34C759', backgroundColor: '#34C759' + '20' }]}
              onPress={() => handleDemoLogin('employee')}
              disabled={isLoading}
            >
              <Text style={[styles.demoButtonText, { color: '#34C759' }]}>
                Employee Login
              </Text>
              <Text style={[styles.demoCredentials, { color: '#34C759' + '80' }]}>
                user / password
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoButton, { borderColor: '#FF6B35', backgroundColor: '#FF6B35' + '20' }]}
              onPress={() => handleDemoLogin('admin')}
              disabled={isLoading}
            >
              <Text style={[styles.demoButtonText, { color: '#FF6B35' }]}>
                Admin Login
              </Text>
              <Text style={[styles.demoCredentials, { color: '#FF6B35' + '80' }]}>
                admin / password
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: textColor + '60' }]}>
            Employee: user/password | Admin: admin/password
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  loginButton: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  demoButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  demoButtonsContainer: {
    marginTop: 16,
    gap: 12,
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  demoCredentials: {
    fontSize: 12,
    fontWeight: '400',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});