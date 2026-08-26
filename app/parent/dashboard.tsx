import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { useCallback, useState } from "react";

import { useFocusEffect } from "@react-navigation/native";

import { supabase } from "../../lib/supabase";

type Child = {
  id: string;
  name: string;
  date_of_birth: string | null;
};

export default function ParentDashboard() {
  const [children, setChildren] =
    useState<Child[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadChildren = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("children")
        .select(
          "id, name, date_of_birth"
        )
        .eq("parent_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      setChildren(data || []);
    } catch (error) {
      console.log(
        "LOAD CHILDREN ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadChildren();
    }, [])
  );

  const openChildDashboard = (
    child: Child
  ) => {
    router.push({
      pathname: "/child/dashboard",
      params: {
        childId: child.id,
        childName: child.name,
      },
    });
  };

  const openChildProgress = (
    child: Child
  ) => {
    router.push({
      pathname: "/parent/child-progress",
      params: {
        childId: child.id,
        childName: child.name,
      },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      {/* =========================
          HEADER
      ========================== */}

      <Text style={styles.greeting}>
        Good evening 👋
      </Text>

      <Text style={styles.title}>
        Parent Dashboard
      </Text>

      <Text style={styles.subtitle}>
        Track your child's learning
        journey 🚀
      </Text>

      {/* =========================
          CHILDREN CARD
      ========================== */}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Your Children 👨‍👩‍👧‍👦
        </Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#6C63FF"
            />

            <Text
              style={styles.loadingText}
            >
              Loading children...
            </Text>
          </View>
        ) : children.length === 0 ? (
          <>
            {/* =====================
                NO CHILDREN
            ====================== */}

            <View
              style={
                styles.emptyContainer
              }
            >
              <Text
                style={styles.emptyEmoji}
              >
                🧒
              </Text>

              <Text
                style={styles.emptyTitle}
              >
                No children yet
              </Text>

              <Text
                style={styles.cardText}
              >
                Add your first child to
                start tracking their
                learning journey.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() =>
                router.push(
                  "/parent/add-child"
                )
              }
            >
              <Text
                style={styles.buttonText}
              >
                + Add Child
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* =====================
                CHILD LIST
            ====================== */}

            {children.map((child) => (
              <View
                key={child.id}
                style={styles.childWrapper}
              >
                {/* CHILD CARD */}

                <TouchableOpacity
                  style={styles.childCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    openChildDashboard(
                      child
                    )
                  }
                >
                  <View
                    style={
                      styles.avatarCircle
                    }
                  >
                    <Text
                      style={
                        styles.avatar
                      }
                    >
                      🧒
                    </Text>
                  </View>

                  <View
                    style={styles.childInfo}
                  >
                    <Text
                      style={
                        styles.childName
                      }
                    >
                      {child.name}
                    </Text>

                    <Text
                      style={
                        styles.childText
                      }
                    >
                      Tap to open learning
                    </Text>
                  </View>

                  <Text
                    style={styles.arrow}
                  >
                    →
                  </Text>
                </TouchableOpacity>

                {/* =================
                    PROGRESS BUTTON
                ================== */}

                <TouchableOpacity
                  style={
                    styles.progressButton
                  }
                  activeOpacity={0.8}
                  onPress={() =>
                    openChildProgress(
                      child
                    )
                  }
                >
                  <Text
                    style={
                      styles.progressButtonEmoji
                    }
                  >
                    📊
                  </Text>

                  <View
                    style={
                      styles.progressButtonInfo
                    }
                  >
                    <Text
                      style={
                        styles.progressButtonTitle
                      }
                    >
                      View Learning Progress
                    </Text>

                    <Text
                      style={
                        styles.progressButtonText
                      }
                    >
                      XP, levels & completed
                      lessons
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.progressArrow
                    }
                  >
                    →
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* =====================
                ADD ANOTHER CHILD
            ====================== */}

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() =>
                router.push(
                  "/parent/add-child"
                )
              }
            >
              <Text
                style={styles.buttonText}
              >
                + Add Another Child
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* =========================
            LOGOUT
        ========================== */}

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={async () => {
            try {
              await supabase.auth.signOut();

              router.replace(
                "/auth/login"
              );
            } catch (error) {
              console.log(
                "LOGOUT ERROR:",
                error
              );
            }
          }}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 70,
    paddingBottom: 40,
    backgroundColor: "#F7F8FC",
  },

  greeting: {
    color: "#777",
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    marginTop: 5,
    color: "#22223B",
  },

  subtitle: {
    color: "#777",
    fontSize: 15,
    marginTop: 5,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 22,
    marginTop: 30,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#22223B",
  },

  loadingContainer: {
    alignItems: "center",
    paddingVertical: 35,
  },

  loadingText: {
    marginTop: 12,
    color: "#777",
    fontWeight: "600",
  },

  emptyContainer: {
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 5,
  },

  emptyEmoji: {
    fontSize: 65,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#22223B",
    marginTop: 10,
  },

  cardText: {
    color: "#777",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 21,
  },

  childWrapper: {
    marginTop: 15,
  },

  childCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FC",
    padding: 15,
    borderRadius: 16,
  },

  avatarCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#EDEBFF",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    fontSize: 34,
  },

  childInfo: {
    flex: 1,
    marginLeft: 13,
  },

  childName: {
    fontSize: 19,
    fontWeight: "800",
    color: "#22223B",
  },

  childText: {
    color: "#777",
    marginTop: 3,
    fontSize: 13,
  },

  arrow: {
    fontSize: 25,
    color: "#6C63FF",
    fontWeight: "800",
  },

  progressButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1EFFF",
    padding: 14,
    borderRadius: 15,
    marginTop: 8,
  },

  progressButtonEmoji: {
    fontSize: 28,
  },

  progressButtonInfo: {
    flex: 1,
    marginLeft: 10,
  },

  progressButtonTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#4B43B5",
  },

  progressButtonText: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },

  progressArrow: {
    fontSize: 22,
    fontWeight: "800",
    color: "#6C63FF",
  },

  button: {
    backgroundColor: "#6C63FF",
    padding: 15,
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },

  logoutButton: {
    backgroundColor: "#FF6B6B",
    padding: 14,
    borderRadius: 14,
    marginTop: 25,
    alignItems: "center",
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
});