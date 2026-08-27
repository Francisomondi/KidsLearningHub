import { router, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";

import {Animated,StyleSheet,Text,TouchableOpacity,View} from "react-native";

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
  const { childId } =
    useLocalSearchParams<{
      childId: string;
    }>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const letterScale = useRef(
    new Animated.Value(0.7)
  ).current;

  const completionScale = useRef(
    new Animated.Value(0.7)
  ).current;

  const speechTimer = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const letter = letters[currentIndex];

  /*
   * Stop any speech currently playing.
   */
  const stopSpeech = async () => {
    try {
      if (speechTimer.current) {
        clearTimeout(speechTimer.current);
        speechTimer.current = null;
      }

      await Speech.stop();
      setIsSpeaking(false);
    } catch (error) {
      console.log(
        "SPEECH STOP ERROR:",
        error
      );
    }
  };

  /*
   * Speak the current letter.
   */
  const speakLetter = async () => {
    try {
      await Speech.stop();

      setIsSpeaking(true);

      Speech.speak(
        `${letter.letter}. is for ${letter.word}.`,
        {
          language: "en-US",
          rate: 0.75,
          pitch: 1.1,

          onDone: () => {
            setIsSpeaking(false);
          },

          onStopped: () => {
            setIsSpeaking(false);
          },

          onError: () => {
            setIsSpeaking(false);
          },
        }
      );
    } catch (error) {
      console.log(
        "SPEECH ERROR:",
        error
      );

      setIsSpeaking(false);
    }
  };

  /*
   * Animate a new letter.
   */
  const animateLetter = () => {
    letterScale.setValue(0.7);

    Animated.spring(letterScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  /*
   * Automatically animate and speak
   * whenever the letter changes.
   */
  useEffect(() => {
    animateLetter();

    if (speechTimer.current) {
      clearTimeout(speechTimer.current);
    }

    stopSpeech();

    speechTimer.current = setTimeout(() => {
      speakLetter();
    }, 500);

    return () => {
      if (speechTimer.current) {
        clearTimeout(
          speechTimer.current
        );

        speechTimer.current = null;
      }

      Speech.stop();
    };
  }, [currentIndex]);

  /*
   * Animate completion screen.
   */
  useEffect(() => {
    if (!completed) {
      return;
    }

    completionScale.setValue(0.7);

    Animated.spring(
      completionScale,
      {
        toValue: 1,
        friction: 5,
        tension: 70,
        useNativeDriver: true,
      }
    ).start();
  }, [completed]);

  /*
   * Stop speech when leaving screen.
   */
  useEffect(() => {
    return () => {
      if (speechTimer.current) {
        clearTimeout(
          speechTimer.current
        );
      }

      Speech.stop();
    };
  }, []);

  /*
   * Move to the next letter.
   */
  const nextLetter = () => {
    stopSpeech();

    if (
      currentIndex <
      letters.length - 1
    ) {
      setCurrentIndex(
        (previous) => previous + 1
      );

      return;
    }

    // Z reached
    setCompleted(true);
  };

  /*
   * Move to previous letter.
   */
  const previousLetter = () => {
    if (currentIndex === 0) {
      return;
    }

    stopSpeech();

    setCurrentIndex(
      (previous) => previous - 1
    );
  };

  /*
   * Start the Supabase quiz.
   */
  const startQuiz = () => {
    stopSpeech();

    router.push({
      pathname: "/child/lesson",
      params: {
        childId,
        lessonId:
          ALPHABET_LESSON_ID,
      },
    });
  };

  /*
   * Restart alphabet from A.
   */
  const reviewAgain = () => {
    stopSpeech();

    setCompleted(false);
    setCurrentIndex(0);
  };

  /*
   * COMPLETION SCREEN
   */
  if (completed) {
    return (
      <View
        style={
          styles.completionContainer
        }
      >
        <Animated.View
          style={[
            styles.completionCard,
            {
              transform: [
                {
                  scale:
                    completionScale,
                },
              ],
            },
          ]}
        >
          <Text
            style={
              styles.celebrationEmoji
            }
          >
            🎉
          </Text>

          <Text
            style={
              styles.completionTitle
            }
          >
            Amazing Job!
          </Text>

          <Text
            style={
              styles.completionSubtitle
            }
          >
            You learned the whole
            alphabet!
          </Text>

          <Text
            style={
              styles.alphabetComplete
            }
          >
            A - Z 🔤
          </Text>

          <View
            style={
              styles.starContainer
            }
          >
            <Text
              style={styles.star}
            >
              ⭐
            </Text>

            <Text
              style={
                styles.star
              }
            >
              ⭐
            </Text>

            <Text
              style={
                styles.star
              }
            >
              ⭐
            </Text>
          </View>

          <Text
            style={styles.rewardText}
          >
            You're ready for the
            Alphabet quiz!
          </Text>

          <TouchableOpacity
            style={
              styles.quizButton
            }
            activeOpacity={0.8}
            onPress={startQuiz}
          >
            <Text
              style={styles.quizText}
            >
              Take the Quiz 🎯
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.reviewButton
            }
            activeOpacity={0.8}
            onPress={
              reviewAgain
            }
          >
            <Text
              style={
                styles.reviewText
              }
            >
              Review Again 🔄
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  /*
   * MAIN ALPHABET SCREEN
   */
  return (
    <View style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <View>
          <Text
            style={
              styles.smallTitle
            }
          >
            Learn the Alphabet
          </Text>

          <Text
            style={styles.title}
          >
            Letter{" "}
            {currentIndex + 1}{" "}
            of 26
          </Text>
        </View>

        <Text
          style={
            styles.headerEmoji
          }
        >
          🔤
        </Text>
      </View>

      {/* Progress */}

      <View
        style={
          styles.progressBackground
        }
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${
                ((currentIndex +
                  1) /
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
                scale:
                  letterScale,
              },
            ],
          },
        ]}
      >
        {/* Letter */}

        <Text
          style={[
            styles.bigLetter,
            {
              color:
                letter.color,
            },
          ]}
        >
          {letter.letter}
        </Text>

        {/* Object */}

        <Text
          style={styles.emoji}
        >
          {letter.emoji}
        </Text>

        {/* Word */}

        <Text
          style={styles.word}
        >
          {letter.letter} is for{" "}
          {letter.word}!
        </Text>

        {/* Speaker */}

        <TouchableOpacity
          style={[
            styles.speakButton,
            isSpeaking &&
              styles.speakingButton,
          ]}
          activeOpacity={0.8}
          onPress={
            speakLetter
          }
        >
          <Text
            style={
              styles.speakIcon
            }
          >
            {isSpeaking
              ? "🔊"
              : "🔈"}
          </Text>

          <Text
            style={
              styles.speakText
            }
          >
            {isSpeaking
              ? "Speaking..."
              : "Hear it"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Navigation */}

      <View
        style={styles.navigation}
      >
        {/* Back */}

        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === 0 &&
              styles.disabledButton,
          ]}
          disabled={
            currentIndex === 0
          }
          activeOpacity={0.8}
          onPress={
            previousLetter
          }
        >
          <Text
            style={styles.navText}
          >
            ← Back
          </Text>
        </TouchableOpacity>

        {/* Next / Finish */}

        {currentIndex <
        letters.length - 1 ? (
          <TouchableOpacity
            style={
              styles.nextButton
            }
            activeOpacity={0.8}
            onPress={
              nextLetter
            }
          >
            <Text
              style={
                styles.nextText
              }
            >
              Next →
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={
              styles.finishButton
            }
            activeOpacity={0.8}
            onPress={
              nextLetter
            }
          >
            <Text
              style={
                styles.finishText
              }
            >
              Finish 🎉
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Hint */}

      <Text
        style={styles.hint}
      >
        Tap 🔊 to hear the
        letter again!
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

  speakButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EEFF",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 20,
    marginTop: 20,
  },

  speakingButton: {
    backgroundColor: "#E2DEFF",
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

  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
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
    flex: 1,
    backgroundColor: "#6C63FF",
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 15,
    alignItems: "center",
  },

  nextText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  finishButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 15,
    alignItems: "center",
  },

  finishText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  hint: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    marginTop: 15,
    marginBottom: 5,
  },

  /*
   * Completion screen
   */

  completionContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F7F8FC",
    justifyContent: "center",
    alignItems: "center",
  },

  completionCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 35,
    alignItems: "center",

    elevation: 8,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.2,

    shadowRadius: 10,
  },

  celebrationEmoji: {
    fontSize: 90,
    marginBottom: 10,
  },

  completionTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#6C63FF",
    textAlign: "center",
  },

  completionSubtitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
    marginTop: 10,
  },

  alphabetComplete: {
    fontSize: 40,
    fontWeight: "900",
    color: "#22223B",
    marginTop: 25,
  },

  starContainer: {
    flexDirection: "row",
    marginTop: 15,
  },

  star: {
    fontSize: 32,
    marginHorizontal: 4,
  },

  rewardText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#777",
    marginTop: 15,
    textAlign: "center",
  },

  quizButton: {
    width: "100%",
    backgroundColor: "#4CAF50",
    paddingVertical: 17,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 25,
  },

  quizText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  reviewButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },

  reviewText: {
    color: "#555",
    fontSize: 17,
    fontWeight: "800",
  },
});