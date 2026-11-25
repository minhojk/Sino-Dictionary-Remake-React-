import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { useState } from 'react';
import { loginUser } from '../api/users' 

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setError('');
    setIsSubmitting(true);

    try {
      await loginUser( {identifier, password});
      navigation.replace('Home');
    }
    catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in');
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput 
        accessibilityLabel="Username/Email"
        autoCapitalize="none"
        autoCorrect = {false}
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="Username/Email"
        style={styles.input}
      />
      <TextInput
        accessibilityLabel="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={{ color: '#b00020' }}>{error}

      </Text> : null}

      <Pressable style={styles.button} onPress={handleLogin} disabled={isSubmitting}>
        <Text style={styles.text}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </Text>
      </Pressable>

      <Pressable style={styles.button2}>
        <Text style={styles.text}>
          Sign in with Google
        </Text>
      </Pressable>

      <Text style={styles.text2}>
        No account? Click {' '}
        <Text
          style={styles.link}
          accessibilityRole="link"
          onPress={() => navigation.navigate('Register')}
        >
          here
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  text2: {
    color: 'black',
    fontSize: 18,
  },
  link: {
    fontSize: 18,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  button: {
    width: 100,
    height: 25,
    backgroundColor: 'black',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  button2: {
    width: 200,
    height: 25,
    backgroundColor: 'black',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    width: 300,
    borderColor: '#888',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});