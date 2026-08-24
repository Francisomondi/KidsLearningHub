import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

export default function BrainGamesScreen() {
  const { childId } = useLocalSearchParams<{
    childId: string;
  }>();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🧩</Text>

      <Text style={styles.title}>
        Brain Games
      </Text>

      <Text style={styles.subtitle}>
        Train your memory and thinking!
      </Text>

      <View style={styles.gameCard}>
        <Text style={styles.gameIcon}>
          🧠
        </Text>

        <Text style={styles.gameTitle}>
          Memory Match
        </Text>

        <Text style={styles.description}>
          Match the cards and test your memory.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/child/lesson",
              params: {
                childId,
                lesson: "memory",
              },
            })
          }
        >
          <Text style={styles.buttonText}>
            Play
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 70,
    backgroundColor: "#F7F8FC",
  },

  icon: {
    fontSize: 60,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#22223B",
  },

  subtitle: {
    color: "#777",
    marginTop: 5,
  },

  gameCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    marginTop: 30,
    alignItems: "center",
  },

  gameIcon: {
    fontSize: 55,
  },

  gameTitle: {
    fontSize: 21,
    fontWeight: "800",
    marginTop: 10,
  },

  description: {
    color: "#777",
    textAlign: "center",
    marginTop: 8,
  },

  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});