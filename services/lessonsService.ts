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

export async function getLesson(
  lessonId: string
) {
  const { data, error } =
    await supabase
      .from("lessons")
      .select(`
        id,
        category_id,
        title,
        description,
        difficulty,
        xp_reward,
        created_at
      `)
      .eq("id", lessonId)
      .single();

  if (error) {
    throw error;
  }

  return data;
}