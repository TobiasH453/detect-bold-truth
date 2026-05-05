// ============================================================================
// MOCK DATA LAYER — UI-only stubs. Replace with real backend calls.
// ============================================================================
// All functions return hardcoded sample data. Analyses are kept in-memory
// (and localStorage) so the UI flows feel real for design review.
// ============================================================================

export type ContentType = "photo" | "video" | "text" | "link";
export type Plan = "free" | "pro";
export type Verdict = "likely_ai" | "likely_human" | "uncertain";

export interface Profile {
  id: string;
  email: string;
  plan: Plan;
  credits_remaining: number;
  credits_reset_at: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  content_type: ContentType;
  input_preview: string;
  score: number;
  verdict: Verdict;
  suspected_model: string;
  credits_spent: number;
  created_at: string;
}

export const CREDIT_COST: Record<ContentType, number> = {
  photo: 4,
  video: 10,
  text: 2,
  link: 2,
};

// ---- in-memory + localStorage persistence (mock only) ----------------------

const PROFILE_KEY = "aisore.mock-profile";
const ANALYSES_KEY = "aisore.mock-analyses";

const defaultProfile = (id: string, email: string): Profile => ({
  id,
  email,
  plan: "free",
  credits_remaining: 30,
  credits_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
});

function readProfile(): Profile | null {
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch { return null; }
}
function writeProfile(p: Profile) {
  try { window.localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}
function readAnalyses(): Analysis[] {
  try {
    const raw = window.localStorage.getItem(ANALYSES_KEY);
    return raw ? (JSON.parse(raw) as Analysis[]) : [];
  } catch { return []; }
}
function writeAnalyses(list: Analysis[]) {
  try { window.localStorage.setItem(ANALYSES_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

// ---- public mock API -------------------------------------------------------

export async function fetchProfile(userId: string, email = "you@example.com"): Promise<Profile> {
  let p = readProfile();
  if (!p || p.id !== userId) {
    p = defaultProfile(userId, email);
    writeProfile(p);
  }
  return p;
}

export async function setPlan(userId: string, plan: Plan): Promise<Profile> {
  const credits = plan === "pro" ? 300 : 30;
  const reset = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const current = (await fetchProfile(userId));
  const updated: Profile = { ...current, plan, credits_remaining: credits, credits_reset_at: reset };
  writeProfile(updated);
  return updated;
}

export async function listAnalyses(userId: string): Promise<Analysis[]> {
  return readAnalyses().filter((a) => a.user_id === userId);
}

export async function getAnalysis(id: string): Promise<Analysis | null> {
  return readAnalyses().find((a) => a.id === id) ?? null;
}

const MODELS: Record<ContentType, string[]> = {
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

export interface AnalyzeInput {
  userId: string;
  contentType: ContentType;
  preview?: string;
  text?: string;
}

export type AnalyzeResult =
  | { ok: true; analysis: Analysis }
  | { ok: false; error: string };

export async function analyzeMock(input: AnalyzeInput): Promise<AnalyzeResult> {
  if (input.contentType === "text") {
    const words = (input.text ?? "").trim().split(/\s+/).filter(Boolean).length;
    if (words === 0) return { ok: false, error: "Empty text" };
    if (words > 1000) return { ok: false, error: "Text exceeds 1000 words" };
  }

  const cost = CREDIT_COST[input.contentType];
  const profile = await fetchProfile(input.userId);
  if (profile.credits_remaining < cost) {
    return { ok: false, error: "Not enough credits" };
  }
  writeProfile({ ...profile, credits_remaining: profile.credits_remaining - cost });

  await new Promise((r) => setTimeout(r, 1200));

  const seed = hashStr((input.text ?? "") + "|" + (input.preview ?? "") + "|" + input.contentType + "|" + Date.now());
  const score = seed % 101;
  const verdict: Verdict = score >= 70 ? "likely_ai" : score <= 30 ? "likely_human" : "uncertain";
  const modelList = MODELS[input.contentType];
  const suspected_model = modelList[seed % modelList.length];
  const previewToStore = input.contentType === "text"
    ? (input.text ?? "").slice(0, 280)
    : (input.preview ?? "").slice(0, 280);

  const analysis: Analysis = {
    id: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    user_id: input.userId,
    content_type: input.contentType,
    input_preview: previewToStore,
    score,
    verdict,
    suspected_model,
    credits_spent: cost,
    created_at: new Date().toISOString(),
  };
  const all = readAnalyses();
  all.unshift(analysis);
  writeAnalyses(all.slice(0, 200));
  return { ok: true, analysis };
}
