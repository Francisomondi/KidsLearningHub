import {Alert,StyleSheet,Text,TextInput,TouchableOpacity,View} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert(
        "Missing information",
        "Please fill in all fields."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Password too short",
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        Alert.alert("Signup failed", error.message);
        return;
      }

      console.log("SIGNUP DATA:", data);

      Alert.alert(
        "Account created",
        "Your account has been created."
      );

      router.replace("/parent/dashboard");

    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Create Account 🚀
      </Text>

      <Text style={styles.subtitle}>
        Create your parent account
      </Text>

      <TextInput
        placeholder="Full name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Account"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
      >
        <Text style={styles.link}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F7F8FC",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#22223B",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 30,
    color: "#777",
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#6C63FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  link: {
    textAlign: "center",
    marginTop: 20,
    color: "#6C63FF",
  },
});