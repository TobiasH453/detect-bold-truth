import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getRequestHeader } from "@tanstack/react-start/server";
import type { Database } from "@/integrations/supabase/types";

const inputSchema = z.object({
  contentType: z.enum(["photo", "video", "text", "link"]),
  preview: z.string().max(2000).optional().default(""),
  // For text we send the actual text so we can validate word count + hash it
  text: z.string().max(20000).optional(),
});

const COST: Record<"photo" | "video" | "text" | "link", number> = {
  photo: 2,
  video: 10,
  text: 2,
  link: 2,
};

const MODELS = {
  photo: ["Midjourney v6", "DALL·E 3", "Stable Diffusion XL", "Flux.1", "Adobe Firefly"],
  video: ["Sora", "Runway Gen-3", "Google Veo", "Kling AI", "Pika 1.5"],
  text: ["GPT-4o", "Claude 3.5 Sonnet", "Gemini 2.5 Pro", "Llama 3.1", "Mistral Large"],
  link: ["GPT-4o", "Midjourney v6", "Sora"],
};

function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

export const analyzeContent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL!;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const auth = getRequestHeader("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return { ok: false as const, error: "Not authenticated" };
    }
    const token = auth.replace("Bearer ", "");
    const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: claims } = await supabase.auth.getClaims(token);
    const userId = claims?.claims?.sub;
    if (!userId) return { ok: false as const, error: "Not authenticated" };

    // text word-count check
    if (data.contentType === "text") {
      const words = (data.text ?? "").trim().split(/\s+/).filter(Boolean).length;
      if (words === 0) return { ok: false as const, error: "Empty text" };
      if (words > 1000) return { ok: false as const, error: "Text exceeds 1000 words" };
    }

    const cost = COST[data.contentType];

    // Atomic credit spend
    const { data: spent, error: spendErr } = await supabase.rpc("spend_credits", {
      _user_id: userId,
      _amount: cost,
    });
    if (spendErr || !spent) {
      return { ok: false as const, error: "Not enough credits" };
    }

    // simulate processing delay
    await new Promise((r) => setTimeout(r, 1200));

    // Deterministic mock score from input
    const seed = hashStr((data.text ?? "") + "|" + (data.preview ?? "") + "|" + data.contentType);
    const score = seed % 101; // 0..100
    const verdict =
      score >= 70 ? "likely_ai" : score <= 30 ? "likely_human" : "uncertain";
    const modelList = MODELS[data.contentType];
    const suspectedModel = modelList[seed % modelList.length];

    const previewToStore =
      data.contentType === "text"
        ? (data.text ?? "").slice(0, 280)
        : (data.preview ?? "").slice(0, 280);

    const { data: inserted, error: insErr } = await supabase
      .from("analyses")
      .insert({
        user_id: userId,
        content_type: data.contentType,
        input_preview: previewToStore,
        score,
        verdict,
        suspected_model: suspectedModel,
        credits_spent: cost,
      })
      .select()
      .single();

    if (insErr || !inserted) {
      return { ok: false as const, error: "Failed to save result" };
    }

    return { ok: true as const, analysis: inserted };
  });
