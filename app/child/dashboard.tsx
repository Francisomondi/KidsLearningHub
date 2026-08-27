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

type Child = {
  id: string;
  name: string;
  date_of_birth: string | null;
};

type ProgressRecord = {
  completed: boolean;
  lessons:
    | {
        xp_reward: number | null;
      }
    | {
        xp_reward: number | null;
      }[]
    | null;
};

export default function ChildDashboard() {
  const { childId, childName } = useLocalSearchParams<{
    childId: string;
    childName: string;
  }>();

  const [name, setName] = useState(
    typeof childName === "string" ? childName : "Learner"
  );

  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const [xpToNextLevel, setXpToNextLevel] = useState(100);
  const [loading, setLoading] = useState(true);

  // =====================================
  // CALCULATE LEVEL
  // =====================================

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  // =====================================
  // CALCULATE LEVEL PROGRESS
  // =====================================

  const calculateLevelProgress = (xp: number) => {
    const currentLevel = calculateLevel(xp);

    const currentLevelXP = (currentLevel - 1) * 100;
    const nextLevelXP = currentLevel * 100;

    const xpIntoLevel = xp - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;

    const progress =
      xpNeeded > 0
        ? Math.min(Math.max(xpIntoLevel / xpNeeded, 0), 1)
        : 0;

    return {
      level: currentLevel,
      currentLevelXP,
      nextLevelXP,
      xpIntoLevel,
      xpNeeded,
      progress,
    };
  };

  // =====================================
  // LOAD CHILD NAME
  // =====================================

  const loadChild = async () => {
    if (!childId) {
      return;
    }

    const { data, error } = await supabase
      .from("children")
      .select("id, name, date_of_birth")
      .eq("id", childId)
      .maybeSingle();

    if (error) {
      console.log("LOAD CHILD ERROR:", error);
      return;
    }

    if (data) {
      setName(data.name);
    }
  };

  // =====================================
  // LOAD XP
  //
  // XP comes from lessons.xp_reward.
  // Only COMPLETED lessons count.
  // =====================================

  const loadXP = async () => {
    if (!childId) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("child_progress")
        .select(`
          completed,
          lessons (
            xp_reward
          )
        `)
        .eq("child_id", childId)
        .eq("completed", true);

      if (error) {
        console.log("XP ERROR:", error);
        return;
      }

      const progressRecords = (data || []) as ProgressRecord[];

      let calculatedXP = 0;

      progressRecords.forEach((record) => {
        if (!record.completed || !record.lessons) {
          return;
        }

        // Supabase can return the relationship as
        // either an object or an array depending on
        // the relationship configuration.
        if (Array.isArray(record.lessons)) {
          record.lessons.forEach((lesson) => {
            calculatedXP += Number(lesson.xp_reward || 0);
          });
        } else {
          calculatedXP += Number(
            record.lessons.xp_reward || 0
          );
        }
      });

      const levelData =
        calculateLevelProgress(calculatedXP);

      setTotalXP(calculatedXP);

      setLevel(levelData.level);

      setLevelProgress(levelData.progress);

      setXpToNextLevel(
        Math.max(
          levelData.nextLevelXP - calculatedXP,
          0
        )
      );
    } catch (error) {
      console.log("CALCULATE XP ERROR:", error);
    }
  };

  // =====================================
  // LOAD EVERYTHING
  // =====================================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      if (!childId) {
        console.log("CHILD ID IS MISSING");
        return;
      }

      await Promise.all([
        loadChild(),
        loadXP(),
      ]);
    } catch (error) {
      console.log("DASHBOARD ERROR:", error);
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
  // LOADING SCREEN
  // =====================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>
          🚀
        </Text>

        <ActivityIndicator
          size="large"
          color="#6C63FF"
        />

        <Text style={styles.loadingTitle}>
          Loading your adventure...
        </Text>

        <Text style={styles.loadingText}>
          Getting your XP ready! ⭐
        </Text>
      </View>
    );
  }

  // =====================================
  // DASHBOARD
  // =====================================

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* =================================
          CHILD HEADER
      ================================= */}

      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatar}>
            🧒
          </Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.greeting}>
            Welcome back! 👋
          </Text>

          <Text
            style={styles.name}
            numberOfLines={1}
          >
            {name} ⭐
          </Text>
        </View>
      </View>

      {/* =================================
          XP CARD
      ================================= */}

      <View style={styles.xpCard}>
        <View style={styles.xpHeader}>
          <View>
            <Text style={styles.levelLabel}>
              CURRENT LEVEL
            </Text>

            <Text style={styles.level}>
              Level {level} 🌟
            </Text>
          </View>

          <Text style={styles.levelEmoji}>
            🏆
          </Text>
        </View>

        <View style={styles.xpRow}>
          <Text style={styles.xp}>
            ⭐ {totalXP} XP
          </Text>

          <Text style={styles.nextLevel}>
            {xpToNextLevel > 0
              ? `${xpToNextLevel} XP to Level ${
                  level + 1
                }`
              : "Level Up! 🎉"}
          </Text>
        </View>

        {/* XP PROGRESS */}

        <View
          style={
            styles.xpProgressBackground
          }
        >
          <View
            style={[
              styles.xpProgressFill,
              {
                width: `${Math.min(
                  Math.max(
                    levelProgress * 100,
                    0
                  ),
                  100
                )}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.progressLabel}>
          {Math.round(
            levelProgress * 100
          )}
          % complete
        </Text>

        <View style={styles.xpSummary}>
          <Text style={styles.xpSummaryText}>
            🎯 Total XP: {totalXP}
          </Text>

          <Text style={styles.xpSummaryText}>
            🏆 Level: {level}
          </Text>
        </View>
      </View>

      {/* =================================
          LEARNING TITLE
      ================================= */}

      <Text style={styles.question}>
        What do you want to learn?
      </Text>

      {/* =================================
          LEARNING GRID
      ================================= */}

      <View style={styles.grid}>
        {/* MATH */}

        <TouchableOpacity
          style={[
            styles.gameCard,
            styles.mathCard,
          ]}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/child/math",
              params: {
                childId,
              },
            })
          }
        >
          <Text style={styles.icon}>
            🔢
          </Text>

          <Text style={styles.gameTitle}>
            Math
          </Text>

          <Text style={styles.gameSubtitle}>
            Numbers & counting
          </Text>
        </TouchableOpacity>

        {/* ABC */}

        <TouchableOpacity
          style={[
            styles.gameCard,
            styles.abcCard,
          ]}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/child/alphabet" as any,
              params: {
                childId,
              },
            })
          }
        >
          <Text style={styles.icon}>
            🔤
          </Text>

          <Text style={styles.gameTitle}>
            ABC
          </Text>

          <Text style={styles.gameSubtitle}>
            Letters & words
          </Text>
        </TouchableOpacity>

        {/* READING */}

        <TouchableOpacity
          style={[
            styles.gameCard,
            styles.readingCard,
          ]}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/child/reading",
              params: {
                childId,
              },
            })
          }
        >
          <Text style={styles.icon}>
            📖
          </Text>

          <Text style={styles.gameTitle}>
            Reading
          </Text>

          <Text style={styles.gameSubtitle}>
            Stories & reading
          </Text>
        </TouchableOpacity>

        {/* BRAIN GAMES */}

        <TouchableOpacity
          style={[
            styles.gameCard,
            styles.brainCard,
          ]}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/child/brain-games",
              params: {
                childId,
              },
            })
          }
        >
          <Text style={styles.icon}>
            🧩
          </Text>

          <Text style={styles.gameTitle}>
            Brain Games
          </Text>

          <Text style={styles.gameSubtitle}>
            Think & have fun
          </Text>
        </TouchableOpacity>
      </View>

      {/* =================================
          XP INFORMATION
      ================================= */}

      <View style={styles.infoCard}>
        <Text style={styles.infoEmoji}>
          ⭐
        </Text>

        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>
            Keep Learning!
          </Text>

          <Text style={styles.infoText}>
            Complete lessons to earn XP and
            reach the next level.
          </Text>
        </View>
      </View>
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
    paddingTop: 60,
    paddingBottom: 40,
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
    fontSize: 16,
    color: "#777",
  },

  // ===================================
  // HEADER
  // ===================================

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarCircle: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  avatar: {
    fontSize: 48,
  },

  headerText: {
    marginLeft: 15,
    flex: 1,
  },

  greeting: {
    color: "#777",
    fontSize: 15,
    fontWeight: "600",
  },

  name: {
    fontSize: 28,
    fontWeight: "900",
    color: "#22223B",
    marginTop: 3,
  },

  // ===================================
  // XP CARD
  // ===================================

  xpCard: {
    width: "100%",
    backgroundColor: "#6C63FF",
    borderRadius: 25,
    padding: 22,
    marginTop: 25,

    elevation: 5,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.18,

    shadowRadius: 8,
  },

  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  levelLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  level: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 4,
  },

  levelEmoji: {
    fontSize: 45,
  },

  xpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },

  xp: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  nextLevel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "700",
  },

  xpProgressBackground: {
    height: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 17,
  },

  xpProgressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },

  progressLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 7,
    textAlign: "right",
  },

  xpSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },

  xpSummaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  // ===================================
  // LEARNING
  // ===================================

  question: {
    alignSelf: "flex-start",
    fontSize: 21,
    fontWeight: "900",
    color: "#22223B",
    marginTop: 30,
    marginBottom: 15,
  },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  gameCard: {
    width: "48%",
    borderRadius: 22,
    padding: 22,
    marginBottom: 15,
    alignItems: "center",
    minHeight: 155,

    elevation: 3,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 5,
  },

  mathCard: {
    backgroundColor: "#FFF4D6",
  },

  abcCard: {
    backgroundColor: "#E8F0FF",
  },

  readingCard: {
    backgroundColor: "#E8F8EC",
  },

  brainCard: {
    backgroundColor: "#F5E9FF",
  },

  icon: {
    fontSize: 45,
  },

  gameTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "900",
    color: "#22223B",
  },

  gameSubtitle: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: "#777",
    textAlign: "center",
  },

  // ===================================
  // INFORMATION
  // ===================================

  infoCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,

    elevation: 2,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.06,

    shadowRadius: 4,
  },

  infoEmoji: {
    fontSize: 35,
  },

  infoContent: {
    flex: 1,
    marginLeft: 13,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#22223B",
  },

  infoText: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
    lineHeight: 19,
  },
});