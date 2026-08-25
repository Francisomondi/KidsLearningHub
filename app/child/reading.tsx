import {StyleSheet,Text,TouchableOpacity,View} from "react-native";
import {router,useLocalSearchParams} from "expo-router";

export default function ReadingScreen() {
  const { childId } = useLocalSearchParams<{
    childId: string;
  }>();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📖</Text>

      <Text style={styles.title}>
        Reading
      </Text>

      <Text style={styles.subtitle}>
        Discover the world through stories!
      </Text>

      <View style={styles.lessonCard}>
        <Text style={styles.storyIcon}>
          🐶
        </Text>

        <Text style={styles.lessonTitle}>
          My First Story
        </Text>

        <Text style={styles.description}>
          Read a simple story and answer questions.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/child/lesson",
              params: {
                childId,
                lesson: "reading",
              },
            })
          }
        >
          <Text style={styles.buttonText}>
            Start Story
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

  storyIcon: {
    fontSize: 55,
  },

  lessonTitle: {
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