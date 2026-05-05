import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Analysis = Database["public"]["Tables"]["analyses"]["Row"];
export type ContentType = Database["public"]["Enums"]["content_type"];

export const CREDIT_COST: Record<ContentType, number> = {
  photo: 2,
  video: 10,
  text: 2,
  link: 2,
};

export async function fetchProfile(userId: string): Promise<Profile | null> {
  // Try reset path first (server-side function), fall back to plain select.
  const { data: resetData } = await supabase.rpc("maybe_reset_credits", { _user_id: userId });
  if (resetData) return resetData as unknown as Profile;
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data;
}

export async function setPlan(userId: string, plan: "free" | "pro"): Promise<Profile | null> {
  const credits = plan === "pro" ? 300 : 30;
  const reset = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("profiles")
    .update({ plan, credits_remaining: credits, credits_reset_at: reset })
    .eq("id", userId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}
