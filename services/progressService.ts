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

export async function getChildTotalXP(
  childId: string
) {
  const { data, error } =
    await supabase
      .from("child_progress")
      .select("xp")
      .eq("child_id", childId);

  if (error) {
    throw error;
  }

  const totalXP =
    data?.reduce(
      (total, item) =>
        total + (item.xp || 0),
      0
    ) || 0;

  return totalXP;
}

export function calculateLevel(
  xp: number
) {
  return Math.floor(xp / 100) + 1;
}

export function getLevelProgress(
  xp: number
) {
  const level =
    calculateLevel(xp);

  const currentLevelXP =
    (level - 1) * 100;

  const nextLevelXP =
    level * 100;

  const xpIntoLevel =
    xp - currentLevelXP;

  const xpNeeded =
    nextLevelXP - currentLevelXP;

  const progress =
    xpIntoLevel / xpNeeded;

  return {
    level,
    currentLevelXP,
    nextLevelXP,
    xpIntoLevel,
    xpNeeded,
    progress,
  };
}