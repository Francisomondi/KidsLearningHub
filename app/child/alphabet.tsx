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

export default function AlphabetScreen() {
  const { childId } = useLocalSearchParams<{
    childId: string;
  }>();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔤</Text>

      <Text style={styles.title}>
        Alphabet
      </Text>

      <Text style={styles.subtitle}>
        Let's learn our ABCs!
      </Text>

      <View style={styles.lessonCard}>
        <Text style={styles.bigLetter}>
          A B C
        </Text>

        <Text style={styles.lessonTitle}>
          Learn the Alphabet
        </Text>

        <Text style={styles.description}>
          Learn letters and their sounds.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/child/lesson",
              params: {
                childId,
                lesson: "alphabet",
              },
            })
          }
        >
          <Text style={styles.buttonText}>
            Start Lesson
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

  lessonCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    marginTop: 30,
    alignItems: "center",
  },

  bigLetter: {
    fontSize: 40,
    fontWeight: "800",
    color: "#6C63FF",
  },

  lessonTitle: {
    fontSize: 21,
    fontWeight: "800",
    marginTop: 15,
  },

  description: {
    color: "#777",
    marginTop: 8,
    textAlign: "center",
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