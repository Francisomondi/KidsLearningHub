import {Alert,StyleSheet,Text,TextInput,TouchableOpacity,View} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password."
      );

      return;
    }

    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("Unable to log in.");
      }

      router.replace("/parent/dashboard");

    } catch (error: any) {
      console.log("LOGIN ERROR:", error);

      Alert.alert(
        "Login failed",
        error.message || "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>
        🧠
      </Text>

      <Text style={styles.title}>
        Welcome Back!
      </Text>

      <Text style={styles.subtitle}>
        Login to continue learning.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/auth/signup")}
      >
        <Text style={styles.signupText}>
          Don't have an account?{" "}
          <Text style={styles.signupLink}>
            Sign Up
          </Text>
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 100,
    backgroundColor: "#F7F8FC",
  },

  logo: {
    fontSize: 65,
    textAlign: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#22223B",
    textAlign: "center",
    marginTop: 15,
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    marginTop: 8,
    marginBottom: 35,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#6C63FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  signupText: {
    textAlign: "center",
    marginTop: 25,
    color: "#777",
  },

  signupLink: {
    color: "#6C63FF",
    fontWeight: "700",
  },
});