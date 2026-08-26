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
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

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

      const { data, error } = await supabase
        .from("children")
        .select("id, name, date_of_birth")
        .eq("parent_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      setChildren(data || []);
    } catch (error) {
      console.log("LOAD CHILDREN ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadChildren();
    }, [])
  );

  const openChildDashboard = (child: Child) => {
    router.push({
      pathname: "/child/dashboard",
      params: {
        childId: child.id,
        childName: child.name,
      },
    });
  };

  const openChildProgress = (child: Child) => {
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
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}

      <Text style={styles.greeting}>
        Good evening 👋
      </Text>

      <Text style={styles.title}>
        Parent Dashboard
      </Text>

      <Text style={styles.subtitle}>
        Track your children's learning journey 🌟
      </Text>

      {/* CHILDREN CARD */}

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>
              Your Children
            </Text>

            <Text style={styles.cardSubtitle}>
              {children.length === 0
                ? "No children added yet"
                : `${children.length} ${
                    children.length === 1
                      ? "child"
                      : "children"
                  }`}
            </Text>
          </View>

          <Text style={styles.cardEmoji}>
            👨‍👩‍👧‍👦
          </Text>
        </View>

        {/* LOADING */}

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size="large"
              color="#6C63FF"
            />

            <Text style={styles.loaderText}>
              Loading children...
            </Text>
          </View>
        ) : children.length === 0 ? (
          /* EMPTY */

          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>
              🧒
            </Text>

            <Text style={styles.emptyTitle}>
              No children yet
            </Text>

            <Text style={styles.emptyText}>
              Add your child to start their
              learning journey.
            </Text>

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() =>
                router.push("/parent/add-child")
              }
            >
              <Text style={styles.buttonText}>
                + Add Child
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* CHILDREN */

          <>
            {children.map((child) => (
              <View
                key={child.id}
                style={styles.childCard}
              >
                {/* CHILD INFO */}

                <View style={styles.childTop}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatar}>
                      🧒
                    </Text>
                  </View>

                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>
                      {child.name}
                    </Text>

                    <Text style={styles.childText}>
                      Ready to learn and grow! 🚀
                    </Text>
                  </View>
                </View>

                {/* ACTIONS */}

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.learningButton}
                    activeOpacity={0.8}
                    onPress={() =>
                      openChildDashboard(child)
                    }
                  >
                    <Text
                      style={
                        styles.learningButtonText
                      }
                    >
                      📚 Learning
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.progressButton}
                    activeOpacity={0.8}
                    onPress={() =>
                      openChildProgress(child)
                    }
                  >
                    <Text
                      style={
                        styles.progressButtonText
                      }
                    >
                      📊 Progress
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* ADD CHILD */}

            <TouchableOpacity
              style={styles.addAnotherButton}
              activeOpacity={0.8}
              onPress={() =>
                router.push("/parent/add-child")
              }
            >
              <Text style={styles.addAnotherText}>
                + Add Another Child
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* LOGOUT */}

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={async () => {
            await supabase.auth.signOut();

            router.replace("/auth/login");
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
    backgroundColor: "#F7F8FC",
  },

  greeting: {
    color: "#777",
    fontSize: 16,
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
    borderRadius: 24,
    marginTop: 30,

    elevation: 4,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.1,

    shadowRadius: 7,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#22223B",
  },

  cardSubtitle: {
    color: "#777",
    fontSize: 14,
    marginTop: 4,
  },

  cardEmoji: {
    fontSize: 40,
  },

  loaderContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },

  loaderText: {
    marginTop: 12,
    color: "#777",
    fontSize: 15,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 35,
  },

  emptyEmoji: {
    fontSize: 70,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#22223B",
    marginTop: 10,
  },

  emptyText: {
    color: "#777",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },

  button: {
    backgroundColor: "#6C63FF",
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 14,
    marginTop: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  childCard: {
    backgroundColor: "#F8F8FC",
    padding: 15,
    borderRadius: 18,
    marginTop: 15,
  },

  childTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EDEBFF",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    fontSize: 38,
  },

  childInfo: {
    flex: 1,
    marginLeft: 14,
  },

  childName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#22223B",
  },

  childText: {
    color: "#777",
    marginTop: 3,
    fontSize: 13,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  learningButton: {
    flex: 1,
    backgroundColor: "#6C63FF",
    paddingVertical: 13,
    borderRadius: 13,
    alignItems: "center",
  },

  learningButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  progressButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 13,
    borderRadius: 13,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },

  progressButtonText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "800",
  },

  addAnotherButton: {
    backgroundColor: "#F1EFFF",
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 18,
    alignItems: "center",
  },

  addAnotherText: {
    color: "#6C63FF",
    fontSize: 16,
    fontWeight: "800",
  },

  logoutButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 25,
    alignItems: "center",
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});