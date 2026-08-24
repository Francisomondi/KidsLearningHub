import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { router, useLocalSearchParams } from "expo-router";

export default function ChildDashboard() {
  const { childId, childName } = useLocalSearchParams<{
    childId: string;
    childName: string;
  }>();

  return (
    <View style={styles.container}>
      <Text style={styles.avatar}>🧒</Text>

      <Text style={styles.greeting}>Welcome back!</Text>

      <Text style={styles.name}>{childName} ⭐</Text>

      <View style={styles.xpCard}>
        <Text style={styles.level}>Level 1</Text>

        <Text style={styles.xp}>0 / 100 XP</Text>
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
              pathname: "/child/reading" as any,
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
});
