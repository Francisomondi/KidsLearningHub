import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  useCallback,
  useState,
} from "react";

import {
  useFocusEffect,
} from "@react-navigation/native";

import { supabase } from "../../lib/supabase";

type Child = {
  id: string;
  name: string;
};

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  difficulty: number | null;
  xp_reward: number | null;
};

type ProgressRecord = {
  id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  lesson: Lesson | null;
};

export default function ChildProgressScreen() {
  const {
    childId,
    childName,
  } = useLocalSearchParams<{
    childId: string;
    childName?: string;
  }>();

  const [loading, setLoading] =
    useState(true);

  const [child, setChild] =
    useState<Child | null>(null);

  const [progress, setProgress] =
    useState<ProgressRecord[]>([]);

  const [totalXP, setTotalXP] =
    useState(0);

  const loadProgress = async () => {
    try {
      setLoading(true);

      if (!childId) {
        console.log(
          "Child ID is missing."
        );

        return;
      }

      // =====================================
      // GET CHILD
      // =====================================

      const {
        data: childData,
        error: childError,
      } = await supabase
        .from("children")
        .select("id, name")
        .eq("id", childId)
        .single();

      if (childError) {
        throw childError;
      }

      setChild(childData);

      // =====================================
      // GET COMPLETED LESSONS
      // =====================================

      const {
        data: progressData,
        error: progressError,
      } = await supabase
        .from("child_progress")
        .select(
          `
          id,
          lesson_id,
          completed,
          completed_at,
          lessons (
            id,
            title,
            description,
            difficulty,
            xp_reward
          )
        `
        )
        .eq("child_id", childId)
        .eq("completed", true)
        .order("completed_at", {
          ascending: false,
        });

      if (progressError) {
        throw progressError;
      }

      // =====================================
      // NORMALIZE LESSON RELATION
      // =====================================

      const formattedProgress =
        (progressData || []).map(
          (item) => ({
            id: item.id,
            lesson_id:
              item.lesson_id,
            completed:
              item.completed,
            completed_at:
              item.completed_at,

            lesson:
              Array.isArray(
                item.lessons
              )
                ? item.lessons[0] ||
                  null
                : item.lessons ||
                  null,
          })
        );

      setProgress(
        formattedProgress
      );

      // =====================================
      // CALCULATE TOTAL XP
      //
      // IMPORTANT:
      // XP COMES FROM lessons.xp_reward
      //
      // NOT child_progress.xp
      // =====================================

      const calculatedXP =
        formattedProgress.reduce(
          (total, item) => {
            const lessonXP =
              Number(
                item.lesson
                  ?.xp_reward || 0
              );

            return total + lessonXP;
          },
          0
        );

      setTotalXP(
        calculatedXP
      );

      console.log(
        "TOTAL CHILD XP:",
        calculatedXP
      );
    } catch (error) {
      console.log(
        "LOAD CHILD PROGRESS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // RELOAD WHEN SCREEN OPENS
  // =====================================

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [childId])
  );

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <View style={styles.center}>
        <Text
          style={styles.loadingEmoji}
        >
          📊
        </Text>

        <ActivityIndicator
          size="large"
          color="#6C63FF"
        />

        <Text
          style={styles.loadingTitle}
        >
          Loading progress...
        </Text>

        <Text
          style={styles.loadingText}
        >
          Let's see how you're doing! 🚀
        </Text>
      </View>
    );
  }

  // =====================================
  // LEVEL SYSTEM
  // =====================================

  const level =
    Math.floor(
      totalXP / 100
    ) + 1;

  const currentLevelXP =
    (level - 1) * 100;

  const nextLevelXP =
    level * 100;

  const xpIntoLevel =
    totalXP -
    currentLevelXP;

  const xpNeeded =
    nextLevelXP -
    currentLevelXP;

  const progressPercentage =
    Math.min(
      Math.max(
        (xpIntoLevel /
          xpNeeded) *
          100,
        0
      ),
      100
    );

  const xpRemaining =
    Math.max(
      nextLevelXP -
        totalXP,
      0
    );

  const displayName =
    child?.name ||
    childName ||
    "Your Child";

  // =====================================
  // RENDER
  // =====================================

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={styles.backText}
          >
            ←
          </Text>
        </TouchableOpacity>

        <View
          style={styles.headerText}
        >
          <Text
            style={
              styles.smallTitle
            }
          >
            Learning Progress
          </Text>

          <Text
            style={styles.title}
          >
            {displayName} 🎓
          </Text>
        </View>
      </View>

      {/* LEVEL CARD */}

      <View
        style={styles.levelCard}
      >
        <View
          style={
            styles.levelCircle
          }
        >
          <Text
            style={
              styles.levelNumber
            }
          >
            {level}
          </Text>

          <Text
            style={
              styles.levelLabel
            }
          >
            LEVEL
          </Text>
        </View>

        <View
          style={styles.levelInfo}
        >
          <Text
            style={
              styles.levelTitle
            }
          >
            Level {level}
          </Text>

          <Text
            style={styles.xpText}
          >
            ⭐ {totalXP} XP
          </Text>

          <Text
            style={
              styles.nextLevelText
            }
          >
            {xpRemaining} XP to
            Level {level + 1}
          </Text>

          <View
            style={
              styles.levelProgressBackground
            }
          >
            <View
              style={[
                styles.levelProgressFill,
                {
                  width: `${progressPercentage}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* STATISTICS */}

      <View
        style={styles.statsRow}
      >
        <View
          style={styles.statCard}
        >
          <Text
            style={styles.statEmoji}
          >
            ⭐
          </Text>

          <Text
            style={styles.statValue}
          >
            {totalXP}
          </Text>

          <Text
            style={styles.statLabel}
          >
            Total XP
          </Text>
        </View>

        <View
          style={styles.statCard}
        >
          <Text
            style={styles.statEmoji}
          >
            📚
          </Text>

          <Text
            style={styles.statValue}
          >
            {progress.length}
          </Text>

          <Text
            style={styles.statLabel}
          >
            Completed
          </Text>
        </View>
      </View>

      {/* LESSON HISTORY */}

      <View
        style={styles.lessonsCard}
      >
        <View
          style={styles.lessonsHeader}
        >
          <View>
            <Text
              style={
                styles.cardTitle
              }
            >
              📚 Completed Lessons
            </Text>

            <Text
              style={
                styles.cardSubtitle
              }
            >
              {progress.length ===
              0
                ? "No lessons completed yet"
                : `${
                    progress.length
                  } lesson${
                    progress.length ===
                    1
                      ? ""
                      : "s"
                  } completed`}
            </Text>
          </View>

          <Text
            style={styles.trophy}
          >
            🏆
          </Text>
        </View>

        {/* EMPTY */}

        {progress.length === 0 ? (
          <View
            style={styles.emptyBox}
          >
            <Text
              style={
                styles.emptyEmoji
              }
            >
              🌱
            </Text>

            <Text
              style={
                styles.emptyTitle
              }
            >
              Let's Get Started!
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              {displayName} hasn't
              completed any lessons
              yet.
            </Text>
          </View>
        ) : (
          <View
            style={styles.lessonList}
          >
            {progress.map(
              (item, index) => {
                const lesson =
                  item.lesson;

                const lessonXP =
                  Number(
                    lesson?.xp_reward ||
                      0
                  );

                return (
                  <View
                    key={item.id}
                    style={
                      styles.lessonItem
                    }
                  >
                    {/* NUMBER */}

                    <View
                      style={
                        styles.lessonNumber
                      }
                    >
                      <Text
                        style={
                          styles.lessonNumberText
                        }
                      >
                        {index + 1}
                      </Text>
                    </View>

                    {/* DETAILS */}

                    <View
                      style={
                        styles.lessonDetails
                      }
                    >
                      <Text
                        style={
                          styles.lessonTitle
                        }
                        numberOfLines={2}
                      >
                        {lesson?.title ||
                          "Completed Lesson"}
                      </Text>

                      {lesson?.description && (
                        <Text
                          style={
                            styles.lessonDescription
                          }
                          numberOfLines={2}
                        >
                          {
                            lesson.description
                          }
                        </Text>
                      )}

                      <View
                        style={
                          styles.lessonMeta
                        }
                      >
                        <Text
                          style={
                            styles.completedText
                          }
                        >
                          ✓ Completed
                        </Text>

                        {item.completed_at && (
                          <Text
                            style={
                              styles.dateText
                            }
                          >
                            {new Date(
                              item.completed_at
                            ).toLocaleDateString()}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* XP */}

                    <View
                      style={
                        styles.lessonXP
                      }
                    >
                      <Text
                        style={
                          styles.lessonXPText
                        }
                      >
                        +{lessonXP}
                      </Text>

                      <Text
                        style={
                          styles.lessonXPLabel
                        }
                      >
                        XP
                      </Text>
                    </View>
                  </View>
                );
              }
            )}
          </View>
        )}
      </View>

      {/* CHILD DASHBOARD */}

      <TouchableOpacity
        style={
          styles.learningButton
        }
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname:
              "/child/dashboard",
            params: {
              childId,
              childName:
                displayName,
            },
          })
        }
      >
        <Text
          style={
            styles.learningButtonText
          }
        >
          📚 View Child Dashboard
        </Text>
      </TouchableOpacity>

      {/* PARENT DASHBOARD */}

      <TouchableOpacity
        style={
          styles.parentButton
        }
        activeOpacity={0.8}
        onPress={() =>
          router.back()
        }
      >
        <Text
          style={
            styles.parentButtonText
          }
        >
          ← Parent Dashboard
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
    padding: 24,
    paddingTop: 65,
    backgroundColor: "#F7F8FC",
  },

  center: {
    flex: 1,
    justifyContent:
      "center",
    alignItems:
      "center",
    padding: 24,
    backgroundColor:
      "#F7F8FC",
  },

  loadingEmoji: {
    fontSize: 65,
    marginBottom: 15,
  },

  loadingTitle: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: "900",
    color: "#22223B",
  },

  loadingText: {
    marginTop: 7,
    color: "#777",
    fontSize: 15,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent:
      "center",
    alignItems: "center",
    marginRight: 12,
  },

  backText: {
    fontSize: 27,
    fontWeight: "800",
    color: "#6C63FF",
  },

  headerText: {
    flex: 1,
  },

  smallTitle: {
    color: "#777",
    fontSize: 14,
    fontWeight: "600",
  },

  title: {
    color: "#22223B",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 3,
  },

  levelCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 22,
    marginTop: 25,
    flexDirection: "row",
    alignItems: "center",

    elevation: 4,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.1,
    shadowRadius: 7,
  },

  levelCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#6C63FF",
    justifyContent:
      "center",
    alignItems: "center",
    marginRight: 18,
  },

  levelNumber: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },

  levelLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  levelInfo: {
    flex: 1,
  },

  levelTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#22223B",
  },

  xpText: {
    fontSize: 19,
    fontWeight: "800",
    color: "#6C63FF",
    marginTop: 4,
  },

  nextLevelText: {
    color: "#777",
    fontSize: 13,
    marginTop: 5,
  },

  levelProgressBackground: {
    height: 9,
    backgroundColor: "#E7E7E7",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },

  levelProgressFill: {
    height: "100%",
    backgroundColor: "#6C63FF",
    borderRadius: 10,
  },

  statsRow: {
    flexDirection: "row",
    gap: 15,
    marginTop: 18,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 2,
  },

  statEmoji: {
    fontSize: 32,
  },

  statValue: {
    fontSize: 27,
    fontWeight: "900",
    color: "#22223B",
    marginTop: 5,
  },

  statLabel: {
    color: "#777",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },

  lessonsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 23,
    padding: 20,
    marginTop: 18,
    elevation: 2,
  },

  lessonsHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#22223B",
  },

  cardSubtitle: {
    color: "#777",
    fontSize: 14,
    marginTop: 4,
  },

  trophy: {
    fontSize: 38,
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 30,
  },

  emptyEmoji: {
    fontSize: 60,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#22223B",
    marginTop: 10,
  },

  emptyText: {
    color: "#777",
    textAlign: "center",
    marginTop: 7,
    lineHeight: 21,
  },

  lessonList: {
    marginTop: 18,
  },

  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8FC",
    borderRadius: 18,
    padding: 13,
    marginBottom: 12,
  },

  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6C63FF",
    justifyContent:
      "center",
    alignItems: "center",
    marginRight: 12,
  },

  lessonNumberText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  lessonDetails: {
    flex: 1,
  },

  lessonTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#22223B",
  },

  lessonDescription: {
    color: "#777",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  lessonMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  completedText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "800",
  },

  dateText: {
    color: "#999",
    fontSize: 11,
    marginLeft: 10,
  },

  lessonXP: {
    backgroundColor: "#FFF4C2",
    borderRadius: 14,
    minWidth: 52,
    paddingVertical: 8,
    paddingHorizontal: 7,
    alignItems: "center",
    marginLeft: 8,
  },

  lessonXPText: {
    color: "#D99000",
    fontSize: 16,
    fontWeight: "900",
  },

  lessonXPLabel: {
    color: "#D99000",
    fontSize: 10,
    fontWeight: "800",
  },

  learningButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 17,
    borderRadius: 17,
    alignItems: "center",
    marginTop: 20,
  },

  learningButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  parentButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 17,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },

  parentButtonText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "800",
  },
});