import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCallback, useState} from "react";
import { router, useLocalSearchParams,useFocusEffect } from "expo-router";
import {getChildTotalXP,calculateLevel, getLevelProgress,} from "../../services/progressService";

export default function ChildDashboard() {
  const { childId, childName } = useLocalSearchParams<{ childId: string; childName: string}>();
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const [xpToNextLevel, setXpToNextLevel] = useState(100);

  useFocusEffect(
  useCallback(() => {
    loadXP();
  }, [childId])
);

 const loadXP = async () => {
  try {
    if (!childId) {
      return;
    }

    const xp =
      await getChildTotalXP(
        childId
      );

    const levelData =
      getLevelProgress(xp);

    setTotalXP(xp);

    setLevel(
      levelData.level
    );

    setLevelProgress(
      levelData.progress
    );

    setXpToNextLevel(
      levelData.nextLevelXP - xp
    );
  } catch (error) {
    console.log(
      "XP ERROR:",
      error
    );
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.avatar}>🧒</Text>

      <Text style={styles.greeting}>Welcome back!</Text>

      <Text style={styles.name}>{childName} ⭐</Text>

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

  <View style={styles.xpProgressBackground}>
    <View
      style={[
        styles.xpProgressFill,
        {
          width: `${Math.min(
            levelProgress * 100,
            100
          )}%`,
        },
      ]}
    />
  </View>

  <Text style={styles.progressLabel}>
    {Math.round(
      levelProgress * 100
    )}% complete
  </Text>

</View>

      <Text style={styles.question}>What do you want to learn?</Text>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.gameCard}
          onPress={() =>
            router.push({
              pathname: "/child/math",
              params: {
                childId,
              },
            })
          }
        >
          <Text style={styles.icon}>🔢</Text>
          <Text style={styles.gameTitle}>Math</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gameCard}
          onPress={() =>
            router.push({
              pathname: "/child/alphabet" as any,
              params: {
                childId,
              },
            })
          }
        >
          <Text style={styles.icon}>🔤</Text>
          <Text style={styles.gameTitle}>ABC</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gameCard}
          onPress={() =>
            router.push({
              pathname: "/child/reading",
              params: {
                childId,
              },
            })
          }
        >
          <Text style={styles.icon}>📖</Text>
          <Text style={styles.gameTitle}>Reading</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gameCard}
          onPress={() =>
            router.push({
              pathname: "/child/brain-games",
              params: {
                childId,
              },
            })
          }
        >
          <Text style={styles.icon}>🧩</Text>
          <Text style={styles.gameTitle}>Brain Games</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#F7F8FC",
    alignItems: "center",
  },

  avatar: {
    fontSize: 70,
  },

  greeting: {
    marginTop: 10,
    color: "#777",
  },

  name: {
    fontSize: 28,
    fontWeight: "800",
    color: "#22223B",
  },

  xpCard: {
    width: "100%",
    backgroundColor: "#6C63FF",
    borderRadius: 18,
    padding: 20,
    marginTop: 25,
  },

  level: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  xp: {
    color: "#fff",
    marginTop: 5,
  },

  question: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "700",
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
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 25,
    marginBottom: 15,
    alignItems: "center",
  },

  icon: {
    fontSize: 40,
  },

  gameTitle: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: "700",
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

levelEmoji: {
  fontSize: 40,
},

xpRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 15,
},

nextLevel: {
  color: "rgba(255,255,255,0.85)",
  fontSize: 12,
  fontWeight: "600",
},

xpProgressBackground: {
  height: 14,
  backgroundColor: "rgba(255,255,255,0.25)",
  borderRadius: 20,
  overflow: "hidden",
  marginTop: 15,
},

xpProgressFill: {
  height: "100%",
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
},

progressLabel: {
  color: "rgba(255,255,255,0.75)",
  fontSize: 12,
  marginTop: 7,
  textAlign: "right",
},
});
