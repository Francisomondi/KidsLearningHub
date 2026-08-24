import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
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

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.greeting}>
        Good evening 👋
      </Text>

      <Text style={styles.title}>
        Parent Dashboard
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Your Children
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            style={styles.loader}
          />
        ) : children.length === 0 ? (
          <>
            <Text style={styles.cardText}>
              You haven't added a child yet.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push("/parent/add-child")
              }
            >
              <Text style={styles.buttonText}>
                + Add Child
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {children.map((child) => (
              <TouchableOpacity
                key={child.id}
                style={styles.childCard}
                onPress={() =>
                  router.push({
                    pathname: "/child/dashboard",
                    params: {
                      childId: child.id,
                      childName: child.name,
                    },
                  })
                }
              >
                <Text style={styles.avatar}>
                  🧒
                </Text>

                <View>
                  <Text style={styles.childName}>
                    {child.name}
                  </Text>

                  <Text style={styles.childText}>
                    Tap to view learning
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push("/parent/add-child")
              }
            >
              <Text style={styles.buttonText}>
                + Add Another Child
              </Text>
            </TouchableOpacity>
          </>

          
        )}

        <TouchableOpacity
          style={styles.logoutButton}
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
    fontWeight: "800",
    marginTop: 5,
    color: "#22223B",
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    marginTop: 30,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  cardText: {
    color: "#777",
    marginTop: 8,
  },

  loader: {
    marginTop: 25,
  },

  button: {
    backgroundColor: "#6C63FF",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  childCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FC",
    padding: 15,
    borderRadius: 14,
    marginTop: 15,
  },

  avatar: {
    fontSize: 40,
    marginRight: 15,
  },

  childName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#22223B",
  },

  childText: {
    color: "#777",
    marginTop: 3,
  },

  logoutButton: {
    backgroundColor: "#FF6B6B",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
  },
});