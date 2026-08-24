import { supabase } from "../lib/supabase";

export async function getLessonQuestions(
  lessonId: string
) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("lesson_id", lessonId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data;
}