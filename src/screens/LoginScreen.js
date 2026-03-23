import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../components/AuthContext";

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Feil", "Fyll inn e-post og passord");
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) Alert.alert("Innloggingsfeil", error.message);
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Feil", "Fyll inn e-post og passord");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);
    if (error) Alert.alert("Registreringsfeil", error.message);
    else Alert.alert("Suksess", "Sjekk e-posten din for bekreftelse");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blodroed Notes</Text>
      <Text style={styles.subtitle}>Logg inn for å fortsette</Text>

      <TextInput
        style={styles.input}
        placeholder="E-post"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        testID="email-input"
      />
      <TextInput
        style={styles.input}
        placeholder="Passord"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        testID="password-input"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#8B0000" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignIn}
            testID="login-button"
          >
            <Text style={styles.buttonText}>Logg inn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleSignUp}
            testID="signup-button"
          >
            <Text style={[styles.buttonText, styles.secondaryText]}>
              Registrer deg
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B0000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#8B0000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#8B0000",
  },
  secondaryText: {
    color: "#8B0000",
  },
});
