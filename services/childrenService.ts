import { supabase } from "../lib/supabase";

export async function addChild(
  name: string,
  dateOfBirth: string
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const { data, error } = await supabase
    .from("children")
    .insert({
      parent_id: user.id,
      name,
      date_of_birth: dateOfBirth || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}