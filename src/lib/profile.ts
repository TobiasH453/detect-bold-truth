// ============================================================================
// MOCK DATA LAYER — UI-only stubs. Anonymous, no accounts.
// ============================================================================

export type ContentType = "photo" | "video" | "text" | "link";
export type Verdict = "likely_ai" | "likely_human" | "uncertain";

export interface Analysis {
  id: string;
  content_type: ContentType;
  input_preview: string;
  score: number;
  verdict: Verdict;
  suspected_model: string;
  created_at: string;
}

const ANALYSES_KEY = "aisore.mock-analyses";

function readAnalyses(): Analysis[] {
  try {
    const raw = window.localStorage.getItem(ANALYSES_KEY);
    return raw ? (JSON.parse(raw) as Analysis[]) : [];
  } catch { return []; }
}
function writeAnalyses(list: Analysis[]) {
  try { window.localStorage.setItem(ANALYSES_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

export async function listAnalyses(): Promise<Analysis[]> {
  return readAnalyses();
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
    content_type: input.contentType,
    input_preview: previewToStore,
    score,
    verdict,
    suspected_model,
    created_at: new Date().toISOString(),
  };
  const all = readAnalyses();
  all.unshift(analysis);
  writeAnalyses(all.slice(0, 200));
  return { ok: true, analysis };
}
