import {ImageBackground,SafeAreaView,StyleSheet,Text,TouchableOpacity,View,Dimensions,StatusBar} from "react-native";
import { router } from "expo-router";
const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#36A9E1"
      />

      {/* =====================================
          COLORFUL BACKGROUND
      ====================================== */}

      <ImageBackground
        source={require("../assets/images/home-background-2.png")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Dark/light overlay for readability */}
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safeArea}>
          {/* =================================
              HEADER
          ================================== */}

          <View style={styles.header}>
            <View style={styles.welcomeCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatar}>🧒</Text>
              </View>

              <View>
                <Text style={styles.welcomeSmall}>
                  Welcome! 👋
                </Text>

                <Text style={styles.welcomeTitle}>
                  Kids Learning Hub
                </Text>
              </View>
            </View>

            <View style={styles.xpCard}>
              <Text style={styles.xpEmoji}>⭐</Text>

              <View>
                <Text style={styles.xpNumber}>
                  0 XP
                </Text>

                <Text style={styles.xpLabel}>
                  Level 1
                </Text>
              </View>
            </View>
          </View>

          {/* =================================
              HERO SECTION
          ================================== */}

          <View style={styles.hero}>
           

            <Text style={styles.heroTitle}>
              Ready to Learn?
            </Text>

            <Text style={styles.heroSubtitle}>
              Explore, learn and have fun! 🎉
            </Text>
          </View>

          {/* =================================
              MAIN MENU
          ================================== */}

          <View style={styles.menuContainer}>
            {/* LESSONS */}

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.menuCard,
                styles.lessonsCard,
              ]}
              onPress={() =>
                router.push("/parent/dashboard")
              }
            >
              <View
                style={[
                  styles.iconCircle,
                  styles.greenCircle,
                ]}
              >
                <Text style={styles.menuIcon}>
                  📚
                </Text>
              </View>

              <Text style={styles.menuTitle}>
                Lessons
              </Text>

              <Text style={styles.menuDescription}>
                Learn something new
              </Text>
            </TouchableOpacity>

            {/* QUIZZES */}

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.menuCard,
                styles.quizCard,
              ]}
              onPress={() =>
                router.push("/parent/dashboard")
              }
            >
              <View
                style={[
                  styles.iconCircle,
                  styles.blueCircle,
                ]}
              >
                <Text style={styles.menuIcon}>
                  🏆
                </Text>
              </View>

              <Text style={styles.menuTitle}>
                Quizzes
              </Text>

              <Text style={styles.menuDescription}>
                Test your knowledge
              </Text>
            </TouchableOpacity>

            {/* ACTIVITIES */}

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.menuCard,
                styles.activitiesCard,
              ]}
              onPress={() =>
                router.push("/parent/dashboard")
              }
            >
              <View
                style={[
                  styles.iconCircle,
                  styles.purpleCircle,
                ]}
              >
                <Text style={styles.menuIcon}>
                  🎨
                </Text>
              </View>

              <Text style={styles.menuTitle}>
                Activities
              </Text>

              <Text style={styles.menuDescription}>
                Fun & interactive
              </Text>
            </TouchableOpacity>
          </View>

          {/* =================================
              BOTTOM ACTION
          ================================== */}

          <View style={styles.bottomSection}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.startButton}
              onPress={() =>
                router.push("/parent/dashboard")
              }
            >
              <Text style={styles.startButtonText}>
                🚀 Start Learning
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#36A9E1",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor:
      "rgba(255,255,255,0.12)",
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 18,
  },

  /* =====================================
     HEADER
  ====================================== */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 15,
  },

  welcomeCard: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.94)",

    borderRadius: 22,

    paddingVertical: 10,
    paddingHorizontal: 12,

    maxWidth: width * 0.62,

    elevation: 5,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.2,

    shadowRadius: 6,
  },

  avatarCircle: {
    width: 50,
    height: 50,

    borderRadius: 25,

    backgroundColor: "#FFE5D0",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 10,
  },

  avatar: {
    fontSize: 31,
  },

  welcomeSmall: {
    fontSize: 12,
    color: "#777",
    fontWeight: "700",
  },

  welcomeTitle: {
    fontSize: 15,
    color: "#243B8F",
    fontWeight: "900",
    marginTop: 2,
  },

  xpCard: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.95)",

    borderRadius: 22,

    paddingVertical: 9,
    paddingHorizontal: 12,

    elevation: 5,
  },

  xpEmoji: {
    fontSize: 28,
    marginRight: 5,
  },

  xpNumber: {
    fontSize: 14,
    fontWeight: "900",
    color: "#24449C",
  },

  xpLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#777",
  },

  /* =====================================
     HERO
  ====================================== */

  hero: {
    alignItems: "center",

    marginTop: height < 750 ? 25 : 40,
  },

  heroEmoji: {
    fontSize: 42,
  },

  heroTitle: {
    fontSize: width < 380 ? 31 : 37,

    fontWeight: "900",

    color: "#FFFFFF",

    textAlign: "center",

    textShadowColor:
      "rgba(0,0,0,0.25)",

    textShadowOffset: {
      width: 2,
      height: 3,
    },

    textShadowRadius: 5,

    marginTop: 2,
  },

  heroSubtitle: {
    backgroundColor:
      "rgba(255,193,7,0.95)",

    color: "#704600",

    fontSize: 15,

    fontWeight: "900",

    paddingHorizontal: 18,
    paddingVertical: 8,

    borderRadius: 18,

    marginTop: 10,

    textAlign: "center",
  },

  /* =====================================
     MENU
  ====================================== */

  menuContainer: {
    flexDirection: "row",

    justifyContent: "space-between",

    marginTop: height < 750 ? 22 : 35,

    gap: 8,
  },

  menuCard: {
    flex: 1,

    backgroundColor:
      "rgba(255,255,255,0.96)",

    borderRadius: 20,

    paddingVertical: 16,
    paddingHorizontal: 7,

    alignItems: "center",

    minHeight: 165,

    elevation: 7,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.2,

    shadowRadius: 7,
  },

  lessonsCard: {
    borderBottomWidth: 5,
    borderBottomColor: "#57C84D",
  },

  quizCard: {
    borderBottomWidth: 5,
    borderBottomColor: "#3498DB",
  },

  activitiesCard: {
    borderBottomWidth: 5,
    borderBottomColor: "#9B59B6",
  },

  iconCircle: {
    width: 67,
    height: 67,

    borderRadius: 34,

    justifyContent: "center",
    alignItems: "center",
  },

  greenCircle: {
    backgroundColor: "#DDF8D8",
  },

  blueCircle: {
    backgroundColor: "#DCEFFF",
  },

  purpleCircle: {
    backgroundColor: "#F0DFFF",
  },

  menuIcon: {
    fontSize: 35,
  },

  menuTitle: {
    fontSize: 17,

    fontWeight: "900",

    color: "#283593",

    marginTop: 9,

    textAlign: "center",
  },

  menuDescription: {
    fontSize: 12,

    color: "#666",

    fontWeight: "600",

    textAlign: "center",

    marginTop: 5,

    lineHeight: 16,
  },

  /* =====================================
     BOTTOM
  ====================================== */

  bottomSection: {
    flex: 1,

    justifyContent: "flex-end",

    alignItems: "center",

    paddingBottom: 20,
  },

  startButton: {
    width: "92%",

    backgroundColor: "#6C63FF",

    borderRadius: 20,

    paddingVertical: 17,

    alignItems: "center",

    elevation: 7,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.25,

    shadowRadius: 7,
  },

  startButtonText: {
    color: "#FFFFFF",

    fontSize: 20,

    fontWeight: "900",
  },
});