import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";




export default function HomeScreen() {

    
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🧒</Text>

      <Text style={styles.title}>
        Kids Learning Hub
      </Text>

      <Text style={styles.subtitle}>
        Learn. Play. Grow.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={styles.buttonText}>
          Get Started
        </Text>
      </TouchableOpacity>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F7F8FC",
  },

  logo: {
    fontSize: 70,
  },

  title: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "800",
    color: "#22223B",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 17,
    color: "#777",
  },

  button: {
    marginTop: 35,
    backgroundColor: "#6C63FF",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 14,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});