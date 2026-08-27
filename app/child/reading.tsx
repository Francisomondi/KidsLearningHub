import {ScrollView,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const READING_LESSON_ID = "e5cb0292-f974-41e3-8a28-73d7dc9c087e";

export default function ReadingScreen() {
  const { childId } = useLocalSearchParams<{
    childId: string;
  }>();

 const openLesson = () => {
    if (!childId) {
      console.log("Missing childId");
      return;
    }

    router.push({
      pathname: "/child/lesson",
      params: {
        childId,
        lessonId: READING_LESSON_ID,
      },
    });
};

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* =========================
          HEADER
      ========================== */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerEmoji}>📖</Text>

          <Text style={styles.headerTitle}>Reading</Text>

          <Text style={styles.headerSubtitle}>
            Let's discover new words!
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* =========================
          HERO CARD
      ========================== */}

      <View style={styles.heroCard}>
        <Text style={styles.heroStars}>✨ ⭐ ✨</Text>

        <Text style={styles.heroEmoji}>📚</Text>

        <Text style={styles.heroTitle}>
          Reading Adventure!
        </Text>

        <Text style={styles.heroText}>
          Learn letters, words and simple sentences
          through fun activities.
        </Text>
      </View>

      {/* =========================
          WHAT WE LEARN
      ========================== */}

      <Text style={styles.sectionTitle}>
        What will we learn? 🌟
      </Text>

      <View style={styles.cardsContainer}>
        {/* WORDS */}

        <TouchableOpacity
          style={[styles.learningCard, styles.wordsCard]}
          activeOpacity={0.85}
          onPress={openLesson}
        >
          <View style={styles.cardEmojiContainer}>
            <Text style={styles.cardEmoji}>🔤</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              New Words
            </Text>

            <Text style={styles.cardDescription}>
              Learn simple words and what they mean.
            </Text>

            <Text style={styles.cardAction}>
              Start learning →
            </Text>
          </View>
        </TouchableOpacity>

        {/* SOUNDS */}

        <TouchableOpacity
          style={[styles.learningCard, styles.soundsCard]}
          activeOpacity={0.85}
          onPress={openLesson}
        >
          <View style={styles.cardEmojiContainer}>
            <Text style={styles.cardEmoji}>🔊</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Word Sounds
            </Text>

            <Text style={styles.cardDescription}>
              Practice sounds and learn how words are spoken.
            </Text>

            <Text style={styles.cardAction}>
              Practice sounds →
            </Text>
          </View>
        </TouchableOpacity>

        {/* SENTENCES */}

        <TouchableOpacity
          style={[styles.learningCard, styles.sentencesCard]}
          activeOpacity={0.85}
          onPress={openLesson}
        >
          <View style={styles.cardEmojiContainer}>
            <Text style={styles.cardEmoji}>📝</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Simple Sentences
            </Text>

            <Text style={styles.cardDescription}>
              Read short and fun sentences.
            </Text>

            <Text style={styles.cardAction}>
              Read sentences →
            </Text>
          </View>
        </TouchableOpacity>

        {/* STORIES */}

        <TouchableOpacity
          style={[styles.learningCard, styles.storyCard]}
          activeOpacity={0.85}
          onPress={openLesson}
        >
          <View style={styles.cardEmojiContainer}>
            <Text style={styles.cardEmoji}>📚</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Little Stories
            </Text>

            <Text style={styles.cardDescription}>
              Enjoy short stories made for young learners.
            </Text>

            <Text style={styles.cardAction}>
              Read a story →
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* =========================
          START BUTTON
      ========================== */}

      <TouchableOpacity
        style={styles.startButton}
        activeOpacity={0.85}
        onPress={openLesson}
      >
        <Text style={styles.startButtonText}>
          📖 Start Reading
        </Text>
      </TouchableOpacity>

      {/* =========================
          MOTIVATION
      ========================== */}

      <View style={styles.motivationCard}>
        <Text style={styles.motivationEmoji}>
          🌈
        </Text>

        <View style={styles.motivationContent}>
          <Text style={styles.motivationTitle}>
            Every word makes you smarter!
          </Text>

          <Text style={styles.motivationText}>
            Keep learning, keep reading and have fun!
            ⭐
          </Text>
        </View>
      </View>

      {/* =========================
          BACK TO DASHBOARD
      ========================== */}

      <TouchableOpacity
        style={styles.dashboardButton}
        activeOpacity={0.8}
        onPress={() =>
          router.replace({
            pathname: "/child/dashboard",
            params: {
              childId,
            },
          })
        }
      >
        <Text style={styles.dashboardText}>
          🏠 Back to Dashboard
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 22,
    paddingTop: 55,
    paddingBottom: 40,
    backgroundColor: "#F7F8FC",
  },

  // ==========================
  // HEADER
  // ==========================

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  backText: {
    fontSize: 27,
    fontWeight: "800",
    color: "#22223B",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  headerEmoji: {
    fontSize: 35,
  },

  headerTitle: {
    fontSize: 27,
    fontWeight: "900",
    color: "#22223B",
    marginTop: 2,
  },

  headerSubtitle: {
    color: "#777",
    fontSize: 13,
    marginTop: 2,
    fontWeight: "600",
  },

  headerSpacer: {
    width: 45,
  },

  // ==========================
  // HERO
  // ==========================

  heroCard: {
    backgroundColor: "#6C63FF",
    borderRadius: 28,
    padding: 25,
    marginTop: 25,
    alignItems: "center",
    overflow: "hidden",
  },

  heroStars: {
    fontSize: 18,
    marginBottom: 5,
  },

  heroEmoji: {
    fontSize: 65,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 5,
    textAlign: "center",
  },

  heroText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 23,
    textAlign: "center",
    marginTop: 10,
  },

  // ==========================
  // SECTION
  // ==========================

  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#22223B",
    marginTop: 30,
    marginBottom: 15,
  },

  // ==========================
  // LEARNING CARDS
  // ==========================

  cardsContainer: {
    gap: 14,
  },

  learningCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
  },

  wordsCard: {
    backgroundColor: "#FFF3F3",
    borderColor: "#FFD6D6",
  },

  soundsCard: {
    backgroundColor: "#EEF5FF",
    borderColor: "#D5E5FF",
  },

  sentencesCard: {
    backgroundColor: "#FFF9E6",
    borderColor: "#FFE9A8",
  },

  storyCard: {
    backgroundColor: "#EFFAF1",
    borderColor: "#D0F0D5",
  },

  cardEmojiContainer: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  cardEmoji: {
    fontSize: 38,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#22223B",
  },

  cardDescription: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    lineHeight: 19,
    marginTop: 4,
  },

  cardAction: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6C63FF",
    marginTop: 7,
  },

  // ==========================
  // START BUTTON
  // ==========================

  startButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 25,
    elevation: 3,
  },

  startButtonText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  // ==========================
  // MOTIVATION
  // ==========================

  motivationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 17,
    marginTop: 20,
  },

  motivationEmoji: {
    fontSize: 40,
    marginRight: 13,
  },

  motivationContent: {
    flex: 1,
  },

  motivationTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#22223B",
  },

  motivationText: {
    color: "#777",
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },

  // ==========================
  // DASHBOARD
  // ==========================

  dashboardButton: {
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 12,
  },

  dashboardText: {
    color: "#6C63FF",
    fontSize: 16,
    fontWeight: "800",
  },
}); 