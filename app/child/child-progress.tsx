import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { supabase } from "../../lib/supabase";

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
  created_at: string | null;
  lessons:
    | Lesson
    | Lesson[]
    | null;
};

export default function ChildProgress() {
  const { childId, childName } =
    useLocalSearchParams<{
      childId: string;
      childName: string;
    }>();

  const [name, setName] = useState(
    typeof childName === "string"
      ? childName
      : "Learner"
  );

  const [progress, setProgress] = useState<
    ProgressRecord[]
  >([]);

  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelProgress, setLevelProgress] =
    useState(0);

  const [xpToNextLevel, setXpToNextLevel] =
    useState(100);

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // LEVEL CALCULATION
  // =====================================

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  // =====================================
  // LEVEL PROGRESS
  // =====================================

  const calculateLevelProgress = (
    xp: number
  ) => {
    const currentLevel =
      calculateLevel(xp);

    const currentLevelXP =
      (currentLevel - 1) * 100;

    const nextLevelXP =
      currentLevel * 100;

    const xpIntoLevel =
      xp - currentLevelXP;

    const xpNeeded =
      nextLevelXP -
      currentLevelXP;

    const progress =
      xpNeeded > 0
        ? Math.min(
            Math.max(
              xpIntoLevel /
                xpNeeded,
              0
            ),
            1
          )
        : 0;

    return {
      level: currentLevel,
      nextLevelXP,
      progress,
    };
  };

  // =====================================
  // LOAD CHILD
  // =====================================

  const loadChild = async () => {
    if (!childId) {
      return;
    }

    const { data, error } =
      await supabase
        .from("children")
        .select(
          "id, name, date_of_birth"
        )
        .eq("id", childId)
        .maybeSingle();

    if (error) {
      console.log(
        "LOAD CHILD ERROR:",
        error
      );
      return;
    }

    if (data) {
      setName(data.name);
    }
  };

  // =====================================
  // LOAD PROGRESS
  // =====================================

  const loadProgress = async () => {
    if (!childId) {
      return;
    }

    try {
      const { data, error } =
        await supabase
          .from("child_progress")
          .select(`
            id,
            lesson_id,
            completed,
            completed_at,
            created_at,
            lessons (
              id,
              title,
              description,
              difficulty,
              xp_reward
            )
          `)
          .eq(
            "child_id",
            childId
          )
          .eq(
            "completed",
            true
          )
          .order(
            "completed_at",
            {
              ascending: false,
            }
          );

      if (error) {
        console.log(
          "LOAD PROGRESS ERROR:",
          error
        );

        setProgress([]);
        setTotalXP(0);

        return;
      }

      const records =
        (data || []) as ProgressRecord[];

      setProgress(records);

      // =================================
      // CALCULATE TOTAL XP
      // =================================

      let calculatedXP = 0;

      records.forEach(
        (record) => {
          if (
            !record.completed ||
            !record.lessons
          ) {
            return;
          }

          if (
            Array.isArray(
              record.lessons
            )
          ) {
            record.lessons.forEach(
              (lesson) => {
                calculatedXP +=
                  Number(
                    lesson.xp_reward ||
                      0
                  );
              }
            );
          } else {
            calculatedXP +=
              Number(
                record.lessons
                  .xp_reward ||
                  0
              );
          }
        }
      );

      setTotalXP(
        calculatedXP
      );

      // =================================
      // LEVEL
      // =================================

      const levelData =
        calculateLevelProgress(
          calculatedXP
        );

      setLevel(
        levelData.level
      );

      setLevelProgress(
        levelData.progress
      );

      setXpToNextLevel(
        Math.max(
          levelData.nextLevelXP -
            calculatedXP,
          0
        )
      );
    } catch (error) {
      console.log(
        "PROGRESS ERROR:",
        error
      );
    }
  };

  // =====================================
  // LOAD EVERYTHING
  // =====================================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      if (!childId) {
        console.log(
          "CHILD ID IS MISSING"
        );

        return;
      }

      await Promise.all([
        loadChild(),
        loadProgress(),
      ]);
    } catch (error) {
      console.log(
        "CHILD PROGRESS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // REFRESH WHEN SCREEN OPENS
  // =====================================

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [childId])
  );

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (
    date: string | null
  ) => {
    if (!date) {
      return "Completed";
    }

    const formatted =
      new Date(date);

    return formatted.toLocaleDateString(
      "en-KE",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================
  // GET LESSON
  // =====================================

  const getLesson = (
    record: ProgressRecord
  ) => {
    if (!record.lessons) {
      return null;
    }

    if (
      Array.isArray(
        record.lessons
      )
    ) {
      return (
        record.lessons[0] ||
        null
      );
    }

    return record.lessons;
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <Text
          style={
            styles.loadingEmoji
          }
        >
          📊
        </Text>

        <ActivityIndicator
          size="large"
          color="#6C63FF"
        />

        <Text
          style={
            styles.loadingTitle
          }
        >
          Loading your progress...
        </Text>

        <Text
          style={
            styles.loadingText
          }
        >
          Let's see how much you've learned! ⭐
        </Text>
      </View>
    );
  }

  // =====================================
  // SCREEN
  // =====================================

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* =================================
          HEADER
      ================================= */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={
              styles.backButtonText
            }
          >
            ←
          </Text>
        </TouchableOpacity>

        <View
          style={
            styles.headerContent
          }
        >
          <Text
            style={
              styles.headerTitle
            }
          >
            My Progress
          </Text>

          <Text
            style={
              styles.headerSubtitle
            }
          >
            {name}'s learning journey 🚀
          </Text>
        </View>

        <Text
          style={
            styles.headerEmoji
          }
        >
          🏆
        </Text>
      </View>

      {/* =================================
          LEVEL CARD
      ================================= */}

      <View style={styles.levelCard}>
        <View
          style={
            styles.levelTop
          }
        >
          <View>
            <Text
              style={
                styles.levelLabel
              }
            >
              CURRENT LEVEL
            </Text>

            <Text
              style={
                styles.levelText
              }
            >
              Level {level} 🌟
            </Text>
          </View>

          <Text
            style={
              styles.trophy
            }
          >
            🏆
          </Text>
        </View>

        <View
          style={
            styles.xpRow
          }
        >
          <Text
            style={
              styles.totalXP
            }
          >
            ⭐ {totalXP} XP
          </Text>

          <Text
            style={
              styles.nextLevelText
            }
          >
            {xpToNextLevel > 0
              ? `${xpToNextLevel} XP to Level ${
                  level + 1
                }`
              : "Level Up! 🎉"}
          </Text>
        </View>

        <View
          style={
            styles.progressBackground
          }
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(
                  Math.max(
                    levelProgress *
                      100,
                    0
                  ),
                  100
                )}%`,
              },
            ]}
          />
        </View>

        <Text
          style={
            styles.progressText
          }
        >
          {Math.round(
            levelProgress * 100
          )}
          % to next level
        </Text>
      </View>

      {/* =================================
          STATISTICS
      ================================= */}

      <View
        style={
          styles.statsRow
        }
      >
        <View
          style={
            styles.statCard
          }
        >
          <Text
            style={
              styles.statEmoji
            }
          >
            ⭐
          </Text>

          <Text
            style={
              styles.statValue
            }
          >
            {totalXP}
          </Text>

          <Text
            style={
              styles.statLabel
            }
          >
            Total XP
          </Text>
        </View>

        <View
          style={
            styles.statCard
          }
        >
          <Text
            style={
              styles.statEmoji
            }
          >
            📚
          </Text>

          <Text
            style={
              styles.statValue
            }
          >
            {progress.length}
          </Text>

          <Text
            style={
              styles.statLabel
            }
          >
            Lessons
          </Text>
        </View>

        <View
          style={
            styles.statCard
          }
        >
          <Text
            style={
              styles.statEmoji
            }
          >
            🏆
          </Text>

          <Text
            style={
              styles.statValue
            }
          >
            {level}
          </Text>

          <Text
            style={
              styles.statLabel
            }
          >
            Level
          </Text>
        </View>
      </View>

      {/* =================================
          LESSON HISTORY TITLE
      ================================= */}

      <View
        style={
          styles.historyHeader
        }
      >
        <View>
          <Text
            style={
              styles.historyTitle
            }
          >
            Completed Lessons
          </Text>

          <Text
            style={
              styles.historySubtitle
            }
          >
            Keep learning and earning XP! ⭐
          </Text>
        </View>

        <Text
          style={
            styles.historyEmoji
          }
        >
          📚
        </Text>
      </View>

      {/* =================================
          EMPTY STATE
      ================================= */}

      {progress.length === 0 ? (
        <View
          style={
            styles.emptyCard
          }
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
            Your journey starts here!
          </Text>

          <Text
            style={
              styles.emptyText
            }
          >
            Complete your first lesson
            to start earning XP.
          </Text>

          <TouchableOpacity
            style={
              styles.startButton
            }
            activeOpacity={0.8}
            onPress={() =>
              router.replace({
                pathname:
                  "/child/dashboard",
                params: {
                  childId,
                  childName: name,
                },
              })
            }
          >
            <Text
              style={
                styles.startButtonText
              }
            >
              Start Learning 🚀
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* =================================
            LESSON LIST
        ================================= */

        <View
          style={
            styles.lessonList
          }
        >
          {progress.map(
            (record, index) => {
              const lesson =
                getLesson(
                  record
                );

              if (!lesson) {
                return null;
              }

              const lessonXP =
                Number(
                  lesson.xp_reward ||
                    0
                );

              return (
                <View
                  key={
                    record.id
                  }
                  style={
                    styles.lessonCard
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

                  {/* CONTENT */}

                  <View
                    style={
                      styles.lessonContent
                    }
                  >
                    <Text
                      style={
                        styles.lessonTitle
                      }
                      numberOfLines={
                        2
                      }
                    >
                      {lesson.title}
                    </Text>

                    {lesson.description && (
                      <Text
                        style={
                          styles.lessonDescription
                        }
                        numberOfLines={
                          2
                        }
                      >
                        {
                          lesson.description
                        }
                      </Text>
                    )}

                    <View
                      style={
                        styles.lessonDetails
                      }
                    >
                      <Text
                        style={
                          styles.completedText
                        }
                      >
                        ✓ Completed
                      </Text>

                      <Text
                        style={
                          styles.dateText
                        }
                      >
                        {formatDate(
                          record.completed_at
                        )}
                      </Text>
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
                      XP ⭐
                    </Text>
                  </View>
                </View>
              );
            }
          )}
        </View>
      )}

      {/* =================================
          MOTIVATION
      ================================= */}

      {progress.length > 0 && (
        <View
          style={
            styles.motivationCard
          }
        >
          <Text
            style={
              styles.motivationEmoji
            }
          >
            🎉
          </Text>

          <View
            style={
              styles.motivationContent
            }
          >
            <Text
              style={
                styles.motivationTitle
              }
            >
              Amazing work, {name}!
            </Text>

            <Text
              style={
                styles.motivationText
              }
            >
              You've completed{" "}
              {progress.length}{" "}
              {progress.length === 1
                ? "lesson"
                : "lessons"}{" "}
              and earned{" "}
              {totalXP} XP!
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 55,
    paddingBottom: 45,
  },

  // ===================================
  // LOADING
  // ===================================

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F8FC",
    padding: 24,
  },

  loadingEmoji: {
    fontSize: 70,
    marginBottom: 15,
  },

  loadingTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "900",
    color: "#22223B",
  },

  loadingText: {
    marginTop: 8,
    fontSize: 15,
    color: "#777",
    textAlign: "center",
  },

  // ===================================
  // HEADER
  // ===================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",

    elevation: 3,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 4,
  },

  backButtonText: {
    fontSize: 27,
    fontWeight: "800",
    color: "#22223B",
  },

  headerContent: {
    flex: 1,
    marginLeft: 14,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#22223B",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },

  headerEmoji: {
    fontSize: 40,
    marginLeft: 10,
  },

  // ===================================
  // LEVEL
  // ===================================

  levelCard: {
    backgroundColor: "#6C63FF",
    borderRadius: 25,
    padding: 22,

    elevation: 5,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.18,

    shadowRadius: 8,
  },

  levelTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  levelLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  levelText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    marginTop: 4,
  },

  trophy: {
    fontSize: 45,
  },

  xpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },

  totalXP: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  nextLevelText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    fontWeight: "700",
  },

  progressBackground: {
    height: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 16,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },

  progressText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 7,
  },

  // ===================================
  // STATS
  // ===================================

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  statCard: {
    width: "31.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",

    elevation: 2,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.06,

    shadowRadius: 4,
  },

  statEmoji: {
    fontSize: 28,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#22223B",
    marginTop: 5,
  },

  statLabel: {
    fontSize: 11,
    color: "#777",
    fontWeight: "700",
    marginTop: 2,
  },

  // ===================================
  // HISTORY HEADER
  // ===================================

  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },

  historyTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#22223B",
  },

  historySubtitle: {
    color: "#777",
    fontSize: 13,
    marginTop: 4,
  },

  historyEmoji: {
    fontSize: 35,
  },

  // ===================================
  // LESSON LIST
  // ===================================

  lessonList: {
    width: "100%",
  },

  lessonCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",

    elevation: 2,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.06,

    shadowRadius: 4,
  },

  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1EFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  lessonNumberText: {
    color: "#6C63FF",
    fontSize: 16,
    fontWeight: "900",
  },

  lessonContent: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },

  lessonTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#22223B",
  },

  lessonDescription: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },

  lessonDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  completedText: {
    color: "#4CAF50",
    fontSize: 11,
    fontWeight: "800",
  },

  dateText: {
    color: "#999",
    fontSize: 10,
    marginLeft: 9,
  },

  lessonXP: {
    minWidth: 52,
    backgroundColor: "#FFF4C2",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 7,
    alignItems: "center",
  },

  lessonXPText: {
    color: "#D99000",
    fontSize: 16,
    fontWeight: "900",
  },

  lessonXPLabel: {
    color: "#D99000",
    fontSize: 9,
    fontWeight: "800",
    marginTop: 1,
  },

  // ===================================
  // EMPTY
  // ===================================

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
    marginTop: 5,

    elevation: 3,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 5,
  },

  emptyEmoji: {
    fontSize: 65,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#22223B",
    textAlign: "center",
    marginTop: 12,
  },

  emptyText: {
    color: "#777",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
  },

  startButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 16,
    marginTop: 20,
  },

  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  // ===================================
  // MOTIVATION
  // ===================================

  motivationCard: {
    backgroundColor: "#EAF8EC",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  motivationEmoji: {
    fontSize: 38,
  },

  motivationContent: {
    flex: 1,
    marginLeft: 12,
  },

  motivationTitle: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "900",
  },

  motivationText: {
    color: "#4F6F52",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
});