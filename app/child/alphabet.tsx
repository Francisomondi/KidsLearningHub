import {Animated,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import {router,useLocalSearchParams} from "expo-router";
import {useRef,useState, useEffect} from "react";
import * as Speech from "expo-speech";

const ALPHABET_LESSON_ID =
  "bcb6000d-f563-4f0d-a49c-e0de07109888";

const letters = [
  {
    letter: "A",
    word: "Apple",
    emoji: "🍎",
    color: "#FF6B6B",
  },
  {
    letter: "B",
    word: "Ball",
    emoji: "⚽",
    color: "#4D96FF",
  },
  {
    letter: "C",
    word: "Cat",
    emoji: "🐱",
    color: "#FFD93D",
  },
  {
    letter: "D",
    word: "Dog",
    emoji: "🐶",
    color: "#6BCB77",
  },
  {
    letter: "E",
    word: "Elephant",
    emoji: "🐘",
    color: "#9B59B6",
  },
  {
    letter: "F",
    word: "Fish",
    emoji: "🐟",
    color: "#3498DB",
  },
  {
    letter: "G",
    word: "Grapes",
    emoji: "🍇",
    color: "#8E44AD",
  },
  {
    letter: "H",
    word: "House",
    emoji: "🏠",
    color: "#E67E22",
  },
  {
    letter: "I",
    word: "Ice Cream",
    emoji: "🍦",
    color: "#FF69B4",
  },
  {
    letter: "J",
    word: "Juice",
    emoji: "🧃",
    color: "#F1C40F",
  },
  {
    letter: "K",
    word: "Kite",
    emoji: "🪁",
    color: "#1ABC9C",
  },
  {
    letter: "L",
    word: "Lion",
    emoji: "🦁",
    color: "#F39C12",
  },
  {
    letter: "M",
    word: "Monkey",
    emoji: "🐒",
    color: "#A0522D",
  },
  {
    letter: "N",
    word: "Nest",
    emoji: "🪺",
    color: "#795548",
  },
  {
    letter: "O",
    word: "Orange",
    emoji: "🍊",
    color: "#FF8C00",
  },
  {
    letter: "P",
    word: "Penguin",
    emoji: "🐧",
    color: "#34495E",
  },
  {
    letter: "Q",
    word: "Queen",
    emoji: "👑",
    color: "#9B59B6",
  },
  {
    letter: "R",
    word: "Rabbit",
    emoji: "🐰",
    color: "#E91E63",
  },
  {
    letter: "S",
    word: "Sun",
    emoji: "☀️",
    color: "#F1C40F",
  },
  {
    letter: "T",
    word: "Tiger",
    emoji: "🐯",
    color: "#E67E22",
  },
  {
    letter: "U",
    word: "Umbrella",
    emoji: "☂️",
    color: "#3498DB",
  },
  {
    letter: "V",
    word: "Van",
    emoji: "🚐",
    color: "#27AE60",
  },
  {
    letter: "W",
    word: "Whale",
    emoji: "🐳",
    color: "#2980B9",
  },
  {
    letter: "X",
    word: "Xylophone",
    emoji: "🎵",
    color: "#8E44AD",
  },
  {
    letter: "Y",
    word: "Yoyo",
    emoji: "🪀",
    color: "#E74C3C",
  },
  {
    letter: "Z",
    word: "Zebra",
    emoji: "🦓",
    color: "#2C3E50",
  },
];



export default function AlphabetScreen() {
  const { childId } = useLocalSearchParams<{ childId: string}>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scale =useRef( new Animated.Value(0.7)).current;
  const letter = letters[currentIndex];

  const speakLetter = () => {
    Speech.stop();

    Speech.speak(
      `${letter.letter}.letter} is for ${letter.word}.`,
      {
        language: "en-US",
        rate: 0.75,
        pitch: 1.1,
      }
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakLetter();
    }, 400);

    return () => {
      clearTimeout(timer);
      Speech.stop();
    };
  }, [currentIndex]);

  const animateLetter = () => {
    scale.setValue(0.7);

    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const nextLetter = () => {
    if (
      currentIndex <
      letters.length - 1
    ) {
      setCurrentIndex(
        (previous) => previous + 1
      );

      setTimeout(
        animateLetter,
        50
      );
    }
  };

  const previousLetter = () => {
    if (currentIndex > 0) {
      setCurrentIndex(
        (previous) => previous - 1
      );

      setTimeout(
        animateLetter,
        50
      );
    }
  };

  const startQuiz = () => {
    router.push({
      pathname: "/child/lesson",
      params: {
        childId,
        lessonId:
          ALPHABET_LESSON_ID,
      },
    });
  };

  return (
    <View style={styles.container}>

      {/* Header */}

      <View style={styles.header}>

        <View>
          <Text style={styles.smallTitle}>
            Learn the Alphabet
          </Text>

          <Text style={styles.title}>
            Letter {currentIndex + 1} of 26
          </Text>
        </View>

        <Text style={styles.headerEmoji}>
          🔤
        </Text>

      </View>

      {/* Progress */}

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${
                ((currentIndex + 1) /
                  letters.length) *
                100
              }%`,
            },
          ]}
        />
      </View>

      {/* Letter Card */}

      <Animated.View
        style={[
          styles.letterCard,
          {
            transform: [
              {
                scale,
              },
            ],
          },
        ]}
      >

        <Text
          style={[
            styles.bigLetter,
            {
              color: letter.color,
            },
          ]}
        >
          {letter.letter}
        </Text>

        <Text style={styles.emoji}>
          {letter.emoji}
        </Text>

        <Text style={styles.word}>
          {letter.letter} is for{" "}
          {letter.word}!
        </Text>

        <TouchableOpacity
          style={styles.speakButton}
          activeOpacity={0.8}
          onPress={speakLetter}
        >
          <Text style={styles.speakIcon}>
            🔊
          </Text>

          <Text style={styles.speakText}>
            Hear it
          </Text>
        </TouchableOpacity>

      </Animated.View>

      {/* Navigation */}

      <View style={styles.navigation}>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === 0 &&
              styles.disabledButton,
          ]}
          disabled={currentIndex === 0}
          onPress={previousLetter}
        >
          <Text style={styles.navText}>
            ← Back
          </Text>
        </TouchableOpacity>

        {currentIndex <
        letters.length - 1 ? (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={nextLetter}
          >
            <Text style={styles.nextText}>
              Next →
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.quizButton}
            onPress={startQuiz}
          >
            <Text style={styles.quizText}>
              Start Quiz 🎯
            </Text>
          </TouchableOpacity>
        )}

      </View>

      {/* Hint */}

      <Text style={styles.hint}>
        Tap Next to learn another letter! ⭐
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#F7F8FC",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smallTitle: {
    color: "#777",
    fontSize: 15,
    fontWeight: "600",
  },

  title: {
    color: "#22223B",
    fontSize: 25,
    fontWeight: "900",
    marginTop: 3,
  },

  headerEmoji: {
    fontSize: 45,
  },

  progressBackground: {
    height: 10,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#6C63FF",
    borderRadius: 10,
  },

  letterCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",

    elevation: 5,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.15,

    shadowRadius: 8,
  },

  bigLetter: {
    fontSize: 150,
    fontWeight: "900",
  },

  emoji: {
    fontSize: 70,
    marginTop: 5,
  },

  word: {
    fontSize: 23,
    fontWeight: "800",
    color: "#22223B",
    marginTop: 15,
    textAlign: "center",
  },

  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  navButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },

  disabledButton: {
    opacity: 0.4,
  },

  navText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#555",
  },

  nextButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 15,
  },

  nextText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  quizButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 17,
    borderRadius: 15,
    alignItems: "center",
  },

  quizText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  hint: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    marginTop: 15,
    marginBottom: 5,
  },
  speakButton: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F0EEFF",
  paddingVertical: 12,
  paddingHorizontal: 22,
  borderRadius: 20,
  marginTop: 20,
},

speakIcon: {
  fontSize: 25,
},

speakText: {
  color: "#6C63FF",
  fontSize: 16,
  fontWeight: "800",
  marginLeft: 8,
},
});