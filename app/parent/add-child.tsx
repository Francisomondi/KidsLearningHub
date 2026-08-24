import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { useState } from "react";

import { addChild } from "../../services/childrenService";

export default function AddChildScreen() {
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddChild = async () => {
    if (!name.trim()) {
      Alert.alert(
        "Missing name",
        "Please enter your child's name."
      );

      return;
    }

    try {
      setLoading(true);

      await addChild(
        name.trim(),
        dateOfBirth.trim()
      );

      Alert.alert(
        "Congratulations!",
        `${name} has been added.`
      );

      router.replace("/parent/dashboard");

    } catch (error: any) {
      console.log("ADD CHILD ERROR:", error);

      Alert.alert(
        "Error",
        error.message || "Unable to add child."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Add Child 
      </Text>

      <Text style={styles.subtitle}>
        Create a learning profile for your child.
      </Text>

      <TextInput
        placeholder="Child's name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Date of birth (YYYY-MM-DD)"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAddChild}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Adding..." : "Add Child"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
      >
        <Text style={styles.cancel}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
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
    fontSize: 16,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#6C63FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  cancel: {
    textAlign: "center",
    marginTop: 20,
    color: "#6C63FF",
    fontWeight: "600",
  },
});