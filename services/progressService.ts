import { supabase } from "../lib/supabase";

export async function saveLessonProgress(
  childId: string,
  lessonId: string,
  xp: number
) {
  const { data: existing, error: findError } =
    await supabase
      .from("child_progress")
      .select("*")
      .eq("child_id", childId)
      .eq("lesson_id", lessonId)
      .maybeSingle();

  if (findError) {
    throw findError;
  }

  if (existing) {
    const { data, error } =
      await supabase
        .from("child_progress")
        .update({
          xp,
          completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return data;
  }

  const { data, error } =
    await supabase
      .from("child_progress")
      .insert({
        child_id: childId,
        lesson_id: lessonId,
        xp,
        completed: true,
      })
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}