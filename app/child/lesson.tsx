import { ActivityIndicator, Animated, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {  getLesson, getLessonQuestions } from "../../services/lessonsService";
import {  saveLessonProgress } from "../../services/progressService";

type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
};

export default function LessonScreen() {
  // =====================================
  // ROUTE PARAMETERS
  // =====================================

  const { childId, lessonId } =
    useLocalSearchParams<{
      childId: string;
      lessonId: string;
    }>();

  // =====================================
  // STATE
  // =====================================

  const [questions, setQuestions] = useState<Question[]>([]);
  const [lessonXpReward, setLessonXpReward] = useState(50);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);

  // =====================================
  // ANIMATION
  // =====================================

  const feedbackScale =
    useRef(
      new Animated.Value(0)
    ).current;

  // =====================================
  // LOAD QUESTIONS
  // =====================================

  useEffect(() => {
    loadQuestions();
  }, [lessonId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);

      if (!lessonId) {
        console.log(
          "Lesson ID is missing."
        );

        setQuestions([]);

        return;
      }

    const lesson = await getLesson(lessonId);
    const data = await getLessonQuestions( lessonId );

    setLessonXpReward( lesson?.xp_reward ?? 50 );

    setQuestions(data || []);

    } catch (error) {
      console.log(
        "LESSON ERROR:",
        error
      );

      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOADING SCREEN
  // =====================================

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingEmoji}>
          📚
        </Text>

        <ActivityIndicator
          size="large"
          color="#6C63FF"
        />

        <Text style={styles.loadingTitle}>
          Loading your lesson...
        </Text>

        <Text style={styles.loadingText}>
          Get ready to learn! 🚀
        </Text>
      </View>
    );
  }

  // =====================================
  // NO QUESTIONS
  // =====================================

  if (questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyEmoji}>
          📚
        </Text>

        <Text style={styles.emptyTitle}>
          Oops!
        </Text>

        <Text style={styles.emptyText}>
          We couldn't find any questions
          for this lesson.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =====================================
  // CURRENT QUESTION
  // =====================================

  const question =
    questions[currentQuestion];

  // =====================================
  // ANSWER QUESTION
  // =====================================

  const handleAnswer = (
    answer: string
  ) => {
    // Prevent answering twice
    if (answered || lessonComplete) {
      return;
    }

    const correct =
      answer ===
      question.correct_answer;

    setSelectedAnswer(answer);

    setAnswered(true);

    setIsCorrect(correct);

    setShowFeedback(true);

    // Add XP immediately to visible score
    if (correct) {
      setScore(
        (previous) =>
          previous + 10
      );
    }

    // =================================
    // START POPUP ANIMATION
    // =================================

    feedbackScale.setValue(0);

    Animated.spring(
      feedbackScale,
      {
        toValue: 1,

        friction: 5,

        tension: 80,

        useNativeDriver: true,
      }
    ).start();
  };

  // =====================================
  // NEXT QUESTION / FINISH LESSON
  // =====================================

  const handleNext = async () => {
    // Prevent duplicate saves
    if (savingProgress) {
      return;
    }

    // =================================
    // MORE QUESTIONS
    // =================================

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setShowFeedback(false);

      setCurrentQuestion(
        (previous) =>
          previous + 1
      );

      setSelectedAnswer(null);

      setAnswered(false);

      setIsCorrect(false);

      // Small animation reset
      feedbackScale.setValue(0);

      return;
    }

    // =================================
    // FINAL QUESTION
    // =================================

    if (!childId || !lessonId) {
      console.log(
        "Missing childId or lessonId"
      );

      return;
    }

    try {
      setSavingProgress(true);
   
      const finalScore =
      score +
      (selectedAnswer ===
      question.correct_answer
        ? 10
        : 0);

      console.log("FINAL SCORE:",finalScore);

      // =================================
      // SAVE TO SUPABASE
      // =================================

      const result =
        await saveLessonProgress(
          childId,
          lessonId,
          finalScore
        );

      console.log(
        "LESSON PROGRESS:",
        result
      );

      // =================================
      // SAVE XP AWARDED
      // =================================

      setXpAwarded(
        result.xpAwarded
      );

      // =================================
      // MARK LESSON COMPLETE
      // =================================

      setLessonComplete(true);

      setShowFeedback(true);

      // =================================
      // COMPLETION ANIMATION
      // =================================

      feedbackScale.setValue(0);

      Animated.spring(
        feedbackScale,
        {
          toValue: 1,

          friction: 5,

          tension: 80,

          useNativeDriver: true,
        }
      ).start();
    } catch (error) {
      console.log(
        "SAVE PROGRESS ERROR:",
        error
      );
    } finally {
      setSavingProgress(false);
    }
  };

  // =====================================
  // RETURN TO DASHBOARD
  // =====================================

  const goToDashboard = () => {
    if (!childId) {
      router.replace(
        "/child/dashboard"
      );

      return;
    }

    router.replace({
      pathname:
        "/child/dashboard",

      params: {
        childId,
      },
    });
  };

  // =====================================
  // MAIN SCREEN
  // =====================================

  return (
    <View style={styles.container}>
      {/* =================================
          HEADER
      ================================= */}

      <View style={styles.header}>
        <Text
          style={
            styles.progressText
          }
        >
          Question{" "}
          {currentQuestion + 1}{" "}
          of{" "}
          {questions.length}
        </Text>

        <View
          style={styles.xpBadge}
        >
          <Text
            style={
              styles.xpBadgeText
            }
          >
            ⭐ {score} XP
          </Text>
        </View>
      </View>

      {/* =================================
          PROGRESS BAR
      ================================= */}

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
                ((currentQuestion +
                  1) /
                  questions.length) *
                100
              }%`,
            },
          ]}
        />
      </View>

      {/* =================================
          QUESTION CARD
      ================================= */}

      <View
        style={
          styles.questionCard
        }
      >
        <Text
          style={
            styles.questionEmoji
          }
        >
          🤔
        </Text>

        <Text
          style={styles.question}
        >
          {question.question_text}
        </Text>
      </View>

      {/* =================================
          ANSWERS
      ================================= */}

      <View
        style={styles.answers}
      >
        {question.options.map(
          (option) => {
            const isSelected =
              selectedAnswer ===
              option;

            const isCorrect =
              answered &&
              option ===
                question.correct_answer;

            const isWrong =
              answered &&
              isSelected &&
              !isCorrect;

            return (
              <TouchableOpacity
                key={option}
                activeOpacity={0.8}
                style={[
                  styles.answerButton,

                  isSelected &&
                    styles.selectedAnswer,

                  isCorrect &&
                    styles.correctAnswer,

                  isWrong &&
                    styles.wrongAnswer,
                ]}
                onPress={() =>
                  handleAnswer(
                    option
                  )
                }
                disabled={
                  answered ||
                  savingProgress
                }
              >
                <Text
                  style={[
                    styles.answerText,

                    isSelected &&
                      styles.selectedAnswerText,

                    isCorrect &&
                      styles.correctAnswerText,

                    isWrong &&
                      styles.wrongAnswerText,
                  ]}
                >
                  {option}
                </Text>

                {/* Correct icon */}

                {isCorrect && (
                  <Text
                    style={
                      styles.answerIcon
                    }
                  >
                    ✓
                  </Text>
                )}

                {/* Wrong icon */}

                {isWrong && (
                  <Text
                    style={
                      styles.answerIcon
                    }
                  >
                    ✕
                  </Text>
                )}
              </TouchableOpacity>
            );
          }
        )}
      </View>

      {/* =================================
          FEEDBACK POPUP
      ================================= */}

      {showFeedback && (
        <View
          style={
            styles.feedbackOverlay
          }
        >
          <Animated.View
            style={[
              styles.feedbackCard,

              {
                transform: [
                  {
                    scale:
                      feedbackScale,
                  },
                ],
              },
            ]}
          >
            {/* =========================
                EMOJI
            ========================== */}

            <Text
              style={
                styles.feedbackEmoji
              }
            >
              {lessonComplete
                ? "🏆"
                : isCorrect
                ? "🎉"
                : "😊"}
            </Text>

            {/* =========================
                TITLE
            ========================== */}

            <Text
              style={[
                styles.feedbackTitle,

                {
                  color:
                    lessonComplete
                      ? "#6C63FF"
                      : isCorrect
                      ? "#4CAF50"
                      : "#FF9800",
                },
              ]}
            >
              {lessonComplete
                ? "AMAZING!"
                : isCorrect
                ? "CORRECT!"
                : "GOOD TRY!"}
            </Text>

            {/* =========================
                MESSAGE
            ========================== */}

            <Text
              style={
                styles.feedbackMessage
              }
            >
              {lessonComplete
                ? "You completed the lesson! 🎓"
                : isCorrect
                ? "Amazing! You got it right! ⭐"
                : `The correct answer is ${question.correct_answer}`}
            </Text>

            {/* =========================
                XP FOR CORRECT ANSWER
            ========================== */}

            {!lessonComplete &&
              isCorrect && (
                <Text
                  style={
                    styles.xpReward
                  }
                >
                  +10 XP ⭐
                </Text>
              )}

            {/* =========================
                FINAL LESSON XP
            ========================== */}

            {lessonComplete && (
              <View
                style={
                  styles.finalXpCard
                }
              >
                {xpAwarded > 0 ? (
                  <>
                    <Text
                      style={
                        styles.finalXpText
                      }
                    >
                      +{xpAwarded} XP ⭐
                    </Text>

                    <Text
                      style={
                        styles.finalXpLabel
                      }
                    >
                      XP Earned!
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={
                        styles.finalXpText
                      }
                    >
                      ✓ Completed
                    </Text>

                    <Text
                      style={
                        styles.finalXpLabel
                      }
                    >
                      You've already earned
                      XP for this lesson.
                    </Text>
                  </>
                )}
              </View>
            )}

            {/* =========================
                BUTTON
            ========================== */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.feedbackButton,

                {
                  backgroundColor:
                    lessonComplete
                      ? "#6C63FF"
                      : isCorrect
                      ? "#4CAF50"
                      : "#FF9800",
                },
              ]}
              disabled={
                savingProgress
              }
              onPress={() => {
                if (
                  savingProgress
                ) {
                  return;
                }

                // =====================
                // LESSON COMPLETE
                // =====================

                if (lessonComplete) {
                  setShowFeedback(
                    false
                  );

                  goToDashboard();

                  return;
                }

                // =====================
                // CONTINUE
                // =====================

                handleNext();
              }}
            >
              <Text
                style={
                  styles.feedbackButtonText
                }
              >
                {savingProgress
                  ? "Saving... ⏳"
                  : lessonComplete
                  ? "Back to Dashboard 🏠"
                  : "Continue →"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({
  

  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#F7F8FC",
  },

  center: {
    flex: 1,

    justifyContent:
      "center",

    alignItems:
      "center",
    padding: 24,
    backgroundColor: "#F7F8FC",
  },

  loadingEmoji: {
    fontSize: 65,
    marginBottom: 15,
  },

  loadingTitle: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: "800",

    color: "#22223B",
  },

  loadingText: {
    marginTop: 8,
    color: "#777",
    fontSize: 16,
  },

  emptyEmoji: {
    fontSize: 70,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: "900",
    color: "#22223B",
  },

  emptyText: {
    marginTop: 10,
    color: "#777",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },


  header: {
    flexDirection: "row",

    justifyContent:
      "space-between",
    alignItems: "center",
  },

  progressText: {
    color: "#777",
    fontSize: 15,
    fontWeight: "600",
  },

  xpBadge: {
    backgroundColor: "#FFF4C2",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  xpBadgeText: {
    color: "#D99000",
    fontSize: 15,
    fontWeight: "800",
  },


  progressBackground: {
    height: 10,

    backgroundColor:
      "#E5E5E5",
    borderRadius: 10,
    marginTop: 15,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#6C63FF",
    borderRadius: 10,
  },


  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 30,
    marginTop: 35,
    alignItems: "center",
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  questionEmoji: {
    fontSize: 45,
    marginBottom: 12,
  },

  question: {
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    color: "#22223B",
    lineHeight: 34,
  },


  answers: {
    marginTop: 25,
  },

  answerButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 18,
    paddingVertical: 17,
    paddingHorizontal: 20,
    marginBottom: 13,
    alignItems: "center",
    flexDirection: "row",

    justifyContent:
      "center",
  },

  selectedAnswer: {
    borderColor:
      "#6C63FF",

    backgroundColor:
      "#F1EFFF",
  },

  correctAnswer: {
    borderColor:
      "#4CAF50",

    backgroundColor:
      "#EAF8EC",
  },

  wrongAnswer: {
    borderColor:  "#FF7043",

    backgroundColor: "#FFF0EB",
  },

  answerText: {
    fontSize: 21,
    fontWeight: "700",
    color: "#333",
  },

  selectedAnswerText: {
    color: "#6C63FF",
  },

  correctAnswerText: {
    color: "#4CAF50",
  },

  wrongAnswerText: {
    color: "#FF7043",
  },

  answerIcon: {
    position: "absolute",
    right: 20,
    fontSize: 24,
    fontWeight: "900",
  },

  backButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 17,
    paddingHorizontal: 35,
    borderRadius: 17,
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  feedbackOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(20, 20, 40, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  feedbackCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    elevation: 12,

    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },

  feedbackEmoji: {
    fontSize: 80,
    marginBottom: 8,
  },

  feedbackTitle: {
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
  },

  feedbackMessage: {
    fontSize: 19,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 27,
  },

  xpReward: {
    fontSize: 27,
    fontWeight: "900",
    color: "#6C63FF",
    marginTop: 18,
  },

  finalXpCard: {
    backgroundColor: "#F1EFFF",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 35,
    alignItems: "center",
    marginTop: 20,
  },

  finalXpText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#6C63FF",
  },

  finalXpLabel: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "600",
    color: "#777",
    textAlign: "center",
  },

  feedbackButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 17,
    alignItems: "center",
    marginTop: 25,
  },
  feedbackButtonText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },
});