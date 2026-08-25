import { StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {router, useLocalSearchParams,useFocusEffect, } from "expo-router";
import { useCallback, useState} from "react";
import { isLessonCompleted } from "../../services/progressService";

const COUNTING_LESSON_ID =
  "5fd23917-f005-441a-8aea-860d48695510";

export default function MathScreen() {
  const { childId } =  useLocalSearchParams<{ childId: string }>();
  const [completed, setCompleted] = useState(false);


  useFocusEffect(
    useCallback(() => {
      checkCompletion();
    }, [childId])
  );

const checkCompletion = async () => {
  try {
    if (!childId) {
      return;
    }

    const completed =
      await isLessonCompleted(
        childId,
        COUNTING_LESSON_ID
      );

    setCompleted(completed);
  } catch (error) {
    console.log(
      "COMPLETION ERROR:",
      error
    );
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔢</Text>

      <Text style={styles.title}>
        Mathematics
      </Text>

      <Text style={styles.subtitle}>
        Let's learn numbers!
      </Text>

      <View style={styles.lessonCard}>
        <Text style={styles.lessonIcon}>
          🔢
        </Text>

        <Text style={styles.lessonTitle}>
          Counting 1 - 10
        </Text>

        <Text style={styles.lessonDescription}>
          Learn how to count from 1 to 10.
        </Text>

        {completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>
              ✓ Completed
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/child/lesson",
              params: {
                childId,
                lessonId:
                  COUNTING_LESSON_ID,
              },
            })
          }
        >
          <Text style={styles.buttonText}>
            {completed
              ? "Practice Again 🔄"
              : "Start Lesson"}
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
    fontSize: 16,
    marginTop: 5,
  },

  lessonCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    marginTop: 30,
    alignItems: "center",
  },

  lessonIcon: {
    fontSize: 50,
  },

  lessonTitle: {
    fontSize: 21,
    fontWeight: "800",
    marginTop: 10,
  },

  lessonDescription: {
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
    fontSize: 16,
    fontWeight: "700",
  },
  completedBadge: {
  backgroundColor: "#EAF8EC",
  paddingVertical: 7,
  paddingHorizontal: 14,
  borderRadius: 20,
  marginTop: 15,
},

completedText: {
  color: "#4CAF50",
  fontSize: 14,
  fontWeight: "800",
},
});