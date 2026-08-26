import {ActivityIndicator,ScrollView,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {calculateLevel,getChildTotalXP} from "../../services/progressService";
import { supabase } from "../../lib/supabase";

type Child = {
  id: string;
  name: string;
};

type ProgressRecord = {
  id: string;
  lesson_id: string;
  xp: number;
  completed: boolean;
  completed_at: string | null;
};

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  xp_reward: number;
};

export default function ChildProgressScreen() {
  const { childId, childName } =
    useLocalSearchParams<{
      childId: string;
      childName: string;
    }>();
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<Child | null>(null);
  const [totalXP, setTotalXP] = useState(0);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  
  const loadProgress = async () => {
    try {
      setLoading(true);

      if (!childId) {
        return;
      }

      // ==============================
      // GET CHILD
      // ==============================

      const { data: childData, error: childError } =
        await supabase
          .from("children")
          .select("id, name")
          .eq("id", childId)
          .single();

      if (childError) {
        throw childError;
      }

      setChild(childData);

      // ==============================
      // GET TOTAL XP
      // ==============================

      const xp =
        await getChildTotalXP(childId);

      setTotalXP(xp);

      // ==============================
      // GET PROGRESS
      // ==============================

      const {
        data: progressData,
        error: progressError,
      } = await supabase
        .from("child_progress")
        .select(
          "id, lesson_id, xp, completed, completed_at"
        )
        .eq("child_id", childId)
        .order("completed_at", {
          ascending: false,
        });

      if (progressError) {
        throw progressError;
      }

      setProgress(progressData || []);

      // ==============================
      // GET LESSONS
      // ==============================

      const {
        data: lessonData,
        error: lessonError,
      } = await supabase
        .from("lessons")
        .select(
          "id, title, description, xp_reward"
        )
        .order("created_at", {
          ascending: true,
        });

      if (lessonError) {
        throw lessonError;
      }

      setLessons(lessonData || []);
    } catch (error) {
      console.log(
        "CHILD PROGRESS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, [childId]);

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingEmoji}>
          📊
        </Text>

        <ActivityIndicator
          size="large"
          color="#6C63FF"
        />

        <Text style={styles.loadingText}>
          Loading progress...
        </Text>
      </View>
    );
  }

  // ==============================
  // LEVEL
  // ==============================

  const level =
    calculateLevel(totalXP);

  const currentLevelXP =
    (level - 1) * 100;

  const nextLevelXP =
    level * 100;

  const xpIntoLevel =
    totalXP - currentLevelXP;

  const xpNeeded =
    nextLevelXP - currentLevelXP;

  const levelProgress =
    Math.min(
      xpIntoLevel / xpNeeded,
      1
    );

  // ==============================
  // COMPLETED LESSONS
  // ==============================

  const completedLessons =
    progress.filter(
      (item) => item.completed
    );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
    >
      {/* ==========================
          HEADER
      =========================== */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ←
          </Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            Child Progress
          </Text>

          <Text style={styles.headerSubtitle}>
            {child?.name || childName}
          </Text>
        </View>

        <Text style={styles.headerEmoji}>
          📚
        </Text>
      </View>

      {/* ==========================
          CHILD CARD
      =========================== */}

      <View style={styles.childCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatar}>
            🧒
          </Text>
        </View>

        <View style={styles.childInfo}>
          <Text style={styles.childName}>
            {child?.name || childName}
          </Text>

          <Text style={styles.levelText}>
            Level {level} ⭐
          </Text>
        </View>
      </View>

      {/* ==========================
          XP CARD
      =========================== */}

      <View style={styles.xpCard}>
        <View style={styles.xpHeader}>
          <Text style={styles.xpTitle}>
            Total XP
          </Text>

          <Text style={styles.xpEmoji}>
            ⭐
          </Text>
        </View>

        <Text style={styles.totalXP}>
          {totalXP}
        </Text>

        <Text style={styles.xpLabel}>
          experience points earned
        </Text>
      </View>

      {/* ==========================
          LEVEL PROGRESS
      =========================== */}

      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <Text style={styles.sectionTitle}>
            Level {level}
          </Text>

          <Text style={styles.levelXP}>
            {xpIntoLevel} / {xpNeeded} XP
          </Text>
        </View>

        <View
          style={styles.progressBackground}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  levelProgress * 100
                }%`,
              },
            ]}
          />
        </View>

        <Text style={styles.nextLevelText}>
          {nextLevelXP - totalXP} XP until
          Level {level + 1} 🚀
        </Text>
      </View>

      {/* ==========================
          STATISTICS
      =========================== */}

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>
            🎓
          </Text>

          <Text style={styles.statNumber}>
            {completedLessons.length}
          </Text>

          <Text style={styles.statLabel}>
            Lessons
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>
            ⭐
          </Text>

          <Text style={styles.statNumber}>
            {totalXP}
          </Text>

          <Text style={styles.statLabel}>
            XP Earned
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>
            🏆
          </Text>

          <Text style={styles.statNumber}>
            {level}
          </Text>

          <Text style={styles.statLabel}>
            Level
          </Text>
        </View>
      </View>

      {/* ==========================
          LESSON PROGRESS
      =========================== */}

      <Text style={styles.sectionHeading}>
        Lesson Progress 📚
      </Text>

      {lessons.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>
            📚
          </Text>

          <Text style={styles.emptyTitle}>
            No lessons yet
          </Text>

          <Text style={styles.emptyText}>
            Lessons will appear here as
            they are added.
          </Text>
        </View>
      ) : (
        lessons.map((lesson) => {
          const lessonProgress =
            progress.find(
              (item) =>
                item.lesson_id ===
                lesson.id
            );

          const completed =
            lessonProgress?.completed ===
            true;

          return (
            <View
              key={lesson.id}
              style={styles.lessonCard}
            >
              <View
                style={[
                  styles.lessonIcon,
                  completed &&
                    styles.completedIcon,
                ]}
              >
                <Text style={styles.lessonEmoji}>
                  {completed
                    ? "✓"
                    : "📖"}
                </Text>
              </View>

              <View
                style={styles.lessonInfo}
              >
                <Text
                  style={styles.lessonTitle}
                  numberOfLines={1}
                >
                  {lesson.title}
                </Text>

                <Text
                  style={styles.lessonDescription}
                  numberOfLines={2}
                >
                  {lesson.description ||
                    "Learning lesson"}
                </Text>

                <Text
                  style={styles.lessonXP}
                >
                  ⭐{" "}
                  {lessonProgress?.xp ||
                    lesson.xp_reward ||
                    0}{" "}
                  XP
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  completed &&
                    styles.completedBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    completed &&
                      styles.completedText,
                  ]}
                >
                  {completed
                    ? "Completed"
                    : "Not started"}
                </Text>
              </View>
            </View>
          );
        })
      )}

      {/* ==========================
          RECENT ACTIVITY
      =========================== */}

      <Text style={styles.sectionHeading}>
        Recent Activity 🕒
      </Text>

      {completedLessons.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>
            🌱
          </Text>

          <Text style={styles.emptyTitle}>
            Start learning!
          </Text>

          <Text style={styles.emptyText}>
            Completed lessons will appear
            here.
          </Text>
        </View>
      ) : (
        completedLessons
          .slice(0, 5)
          .map((item) => {
            const lesson =
              lessons.find(
                (lessonItem) =>
                  lessonItem.id ===
                  item.lesson_id
              );

            return (
              <View
                key={item.id}
                style={styles.activityCard}
              >
                <Text
                  style={styles.activityEmoji}
                >
                  🎉
                </Text>

                <View
                  style={
                    styles.activityInfo
                  }
                >
                  <Text
                    style={
                      styles.activityTitle
                    }
                  >
                    {lesson?.title ||
                      "Lesson completed"}
                  </Text>

                  <Text
                    style={
                      styles.activityDate
                    }
                  >
                    Lesson completed
                  </Text>
                </View>

                <Text
                  style={styles.activityXP}
                >
                  +{item.xp} XP
                </Text>
              </View>
            );
          })
      )}

      {/* ==========================
          BACK BUTTON
      =========================== */}

      <TouchableOpacity
        style={styles.dashboardButton}
        activeOpacity={0.8}
        onPress={() =>
          router.back()
        }
      >
        <Text
          style={
            styles.dashboardButtonText
          }
        >
          ← Back to Dashboard
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8FC",
  },

  loadingEmoji: {
    fontSize: 65,
    marginBottom: 15,
  },

  loadingText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "700",
    color: "#555",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  backText: {
    fontSize: 28,
    color: "#22223B",
    fontWeight: "700",
  },

  headerCenter: {
    flex: 1,
    marginLeft: 15,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#22223B",
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 15,
    color: "#777",
    fontWeight: "600",
  },

  headerEmoji: {
    fontSize: 38,
  },

  childCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F1EFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    fontSize: 45,
  },

  childInfo: {
    marginLeft: 15,
  },

  childName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#22223B",
  },

  levelText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "700",
    color: "#6C63FF",
  },

  xpCard: {
    marginTop: 18,
    backgroundColor: "#6C63FF",
    borderRadius: 25,
    padding: 25,
  },

  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  xpTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  xpEmoji: {
    fontSize: 28,
  },

  totalXP: {
    marginTop: 5,
    color: "#FFFFFF",
    fontSize: 45,
    fontWeight: "900",
  },

  xpLabel: {
    color: "#E9E7FF",
    fontSize: 14,
    fontWeight: "600",
  },

  levelCard: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
  },

  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#22223B",
  },

  levelXP: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6C63FF",
  },

  progressBackground: {
    height: 14,
    backgroundColor: "#E8E8EE",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 15,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#6C63FF",
    borderRadius: 20,
  },

  nextLevelText: {
    marginTop: 10,
    color: "#777",
    fontSize: 14,
    fontWeight: "600",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  statCard: {
    width: "31%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
  },

  statEmoji: {
    fontSize: 27,
  },

  statNumber: {
    marginTop: 7,
    fontSize: 22,
    fontWeight: "900",
    color: "#22223B",
  },

  statLabel: {
    marginTop: 3,
    fontSize: 12,
    color: "#777",
    fontWeight: "600",
  },

  sectionHeading: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 21,
    fontWeight: "900",
    color: "#22223B",
  },

  lessonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  lessonIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: "#F1EFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  completedIcon: {
    backgroundColor: "#EAF8EC",
  },

  lessonEmoji: {
    fontSize: 25,
    color: "#4CAF50",
    fontWeight: "900",
  },

  lessonInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  lessonTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#22223B",
  },

  lessonDescription: {
    marginTop: 3,
    fontSize: 12,
    color: "#888",
  },

  lessonXP: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "800",
    color: "#6C63FF",
  },

  statusBadge: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },

  completedBadge: {
    backgroundColor: "#EAF8EC",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#888",
  },

  completedText: {
    color: "#4CAF50",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 30,
    alignItems: "center",
  },

  emptyEmoji: {
    fontSize: 50,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "900",
    color: "#22223B",
  },

  emptyText: {
    marginTop: 7,
    textAlign: "center",
    color: "#777",
    lineHeight: 21,
  },

  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  activityEmoji: {
    fontSize: 30,
  },

  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },

  activityTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#22223B",
  },

  activityDate: {
    marginTop: 3,
    fontSize: 12,
    color: "#888",
  },

  activityXP: {
    fontSize: 15,
    fontWeight: "900",
    color: "#4CAF50",
  },

  dashboardButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 17,
    borderRadius: 17,
    alignItems: "center",
    marginTop: 25,
  },

  dashboardButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
});