import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { signIn, signUp, confirmSignUp } = useAuth();
  const [mode, setMode] = React.useState('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmationCode, setConfirmationCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Missing details', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      const message = err?.message || String(err);
      const code = err?.code || err?.name;
      const details = code ? `${code}: ${message}` : message;
      console.error('Sign in failed:', err);
      try {
        console.error('Sign in error details:', JSON.stringify(err));
      } catch (jsonErr) {
        console.error('Sign in error stringify failed:', jsonErr);
      }
      Alert.alert('Sign in failed', details || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Missing details', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), password);
      setMode('confirm');
    } catch (err) {
      Alert.alert('Sign up failed', err.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!email || !confirmationCode) {
      Alert.alert('Missing details', 'Please enter email and confirmation code.');
      return;
    }
    setLoading(true);
    try {
      await confirmSignUp(email.trim(), confirmationCode.trim());
      setMode('signin');
      Alert.alert('Success', 'Your account is confirmed. Please sign in.');
    } catch (err) {
      Alert.alert('Confirmation failed', err.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          {mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Confirm account'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {mode !== 'confirm' && (
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        )}

        {mode === 'confirm' && (
          <TextInput
            style={styles.input}
            placeholder="Confirmation code"
            value={confirmationCode}
            onChangeText={setConfirmationCode}
            keyboardType="number-pad"
          />
        )}

        {mode === 'signin' && (
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
        )}

        {mode === 'signup' && (
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Create account</Text>
          </TouchableOpacity>
        )}

        {mode === 'confirm' && (
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          {mode === 'signin' && (
            <TouchableOpacity onPress={() => setMode('signup')}>
              <Text style={styles.link}>Need an account? Sign up</Text>
            </TouchableOpacity>
          )}
          {mode === 'signup' && (
            <TouchableOpacity onPress={() => setMode('signin')}>
              <Text style={styles.link}>Already have an account? Sign in</Text>
            </TouchableOpacity>
          )}
          {mode === 'confirm' && (
            <TouchableOpacity onPress={() => setMode('signin')}>
              <Text style={styles.link}>Back to sign in</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  link: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '500',
  },
});
