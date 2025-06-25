import { supabase } from "./supabase";

export async function createAdminUser(email: string, password: string) {
  // Ini untuk membuat user admin secara manual
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "admin",
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function checkIsAdmin(userId: string) {
  const { data, error } = await supabase
    .from("admin_users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    return false;
  }

  return data?.role === "admin";
}
