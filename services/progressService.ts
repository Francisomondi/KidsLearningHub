import { supabase } from "../lib/supabase";


// =====================================
// SAVE LESSON PROGRESS
// Awards XP only the FIRST time
// =====================================

export async function saveLessonProgress(
  childId: string,
  lessonId: string,
  xp: number
) {
  // Check whether this lesson
  // has already been completed
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

  // ---------------------------------
  // Already completed
  // ---------------------------------

  if (existing?.completed) {
    return {
      data: existing,
      alreadyCompleted: true,
      xpAwarded: 0,
    };
  }

  // ---------------------------------
  // Existing record but not completed
  // ---------------------------------

  if (existing) {
    const { data, error } =
      await supabase
        .from("child_progress")
        .update({
          xp,
          completed: true,
          completed_at:
            new Date().toISOString(),
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return {
      data,
      alreadyCompleted: false,
      xpAwarded: xp,
    };
  }

  // ---------------------------------
  // First time completing lesson
  // ---------------------------------

  const { data, error } =
    await supabase
      .from("child_progress")
      .insert({
        child_id: childId,
        lesson_id: lessonId,
        xp,
        completed: true,
        completed_at:
          new Date().toISOString(),
      })
      .select()
      .single();

  if (error) {
    throw error;
  }

  return {
    data,
    alreadyCompleted: false,
    xpAwarded: xp,
  };
}


// =====================================
// GET CHILD TOTAL XP
// =====================================

export async function getChildTotalXP(
  childId: string
) {
  const { data, error } =
    await supabase
      .from("child_progress")
      .select("xp")
      .eq("child_id", childId)
      .eq("completed", true);

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


// =====================================
// CHECK IF LESSON IS COMPLETED
// =====================================

export async function isLessonCompleted(
  childId: string,
  lessonId: string
) {
  const { data, error } =
    await supabase
      .from("child_progress")
      .select("completed")
      .eq("child_id", childId)
      .eq("lesson_id", lessonId)
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.completed === true;
}


// =====================================
// GET LEVEL
// =====================================

export function calculateLevel(
  xp: number
) {
  return Math.floor(xp / 100) + 1;
}


// =====================================
// GET LEVEL PROGRESS
// =====================================

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