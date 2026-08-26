import { supabase } from "../lib/supabase";

// =====================================
// SAVE LESSON PROGRESS
// Awards XP ONLY the first time
// =====================================

export async function saveLessonProgress(
  childId: string,
  lessonId: string,
  xp: number
) {
  if (!childId) {
    throw new Error("Child ID is missing.");
  }

  if (!lessonId) {
    throw new Error("Lesson ID is missing.");
  }

  // Make sure XP is always a valid number
  const safeXP = Math.max(
    0,
    Math.floor(Number(xp) || 0)
  );

  // =====================================
  // CHECK EXISTING PROGRESS
  // =====================================

  const {
    data: existing,
    error: findError,
  } = await supabase
    .from("child_progress")
    .select("*")
    .eq("child_id", childId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (findError) {
    throw findError;
  }

  // =====================================
  // ALREADY COMPLETED
  // DO NOT AWARD XP AGAIN
  // =====================================

  if (existing?.completed === true) {
    return {
      data: existing,
      alreadyCompleted: true,
      xpAwarded: 0,
    };
  }

  // =====================================
  // EXISTING RECORD BUT NOT COMPLETED
  // =====================================

  if (existing) {
    const {
      data,
      error,
    } = await supabase
      .from("child_progress")
      .update({
        xp: safeXP,
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
      xpAwarded: safeXP,
    };
  }

  // =====================================
  // FIRST TIME COMPLETING LESSON
  // =====================================

  const {
    data,
    error,
  } = await supabase
    .from("child_progress")
    .insert({
      child_id: childId,
      lesson_id: lessonId,
      xp: safeXP,
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
    xpAwarded: safeXP,
  };
}

// =====================================
// GET CHILD TOTAL XP
// =====================================

export async function getChildTotalXP(
  childId: string
) {
  if (!childId) {
    return 0;
  }

  const {
    data,
    error,
  } = await supabase
    .from("child_progress")
    .select("xp_earned")
    .eq("child_id", childId)
    .eq("completed", true);

  if (error) {
    throw error;
  }

  const totalXP =
    (data || []).reduce(
      (total, item) => {
        const itemXP =
          Number(item.xp_earned) || 0;

        return total + itemXP;
      },
      0
    );

  return totalXP;
}

// =====================================
// CHECK IF LESSON IS COMPLETED
// =====================================

export async function isLessonCompleted(
  childId: string,
  lessonId: string
) {
  if (!childId || !lessonId) {
    return false;
  }

  const {
    data,
    error,
  } = await supabase
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
  const safeXP =
    Math.max(0, Number(xp) || 0);

  return Math.floor(safeXP / 100) + 1;
}

// =====================================
// GET LEVEL PROGRESS
// =====================================

export function getLevelProgress(
  xp: number
) {
  const safeXP =
    Math.max(0, Number(xp) || 0);

  const level =
    calculateLevel(safeXP);

  const currentLevelXP =
    (level - 1) * 100;

  const nextLevelXP =
    level * 100;

  const xpIntoLevel =
    safeXP - currentLevelXP;

  const xpNeeded =
    nextLevelXP - currentLevelXP;

  const progress =
    Math.min(
      1,
      Math.max(
        0,
        xpIntoLevel / xpNeeded
      )
    );

  return {
    level,
    currentLevelXP,
    nextLevelXP,
    xpIntoLevel,
    xpNeeded,
    progress,
  };
}