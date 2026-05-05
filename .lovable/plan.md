# AIsore — AI Detection App MVP

**AIsore** (pronounced *eyesore*) is a mobile-first, fully responsive consumer app that detects whether photos, videos, or text are AI-generated. The name and the eye-star logo drive the visual identity.

## Visual Direction

Modern, confident, slightly editorial — not strict Neo-Brutalism. Bold where it matters (CTAs, scores, the logo), quiet everywhere else.

- **Palette:** pure black (#000), pure white (#FFF), vivid orange (#FC6736) as the single accent — used sparingly for emphasis, not flooded across surfaces
- **Surfaces:** mostly white with deep black for headers/results; subtle off-white (#F7F6F2) for secondary cards
- **Borders & shadows:** crisp 1px borders, soft modern shadows on cards, with optional sharper shadow accents on key CTAs (a nod to the bolder original direction without leaning fully brutalist)
- **Typography:** geometric sans for UI (Inter or similar), a tighter display sans for hero numbers and the wordmark — uppercase + tracked for short labels
- **Iconography:** thin-stroke line icons; the eye-star mark used as the app icon and as a watermark/loading motif
- **Motion:** subtle — fades, soft scale on tap, a slow pulse on the eye-star during analysis
- **Logo:** orange + black eye-star, used in headers and as the primary loading animation

## Screens

**Auth (Login / Sign up)**
- Centered card on white, large eye-star logo, "AIsore" wordmark, tagline "See what's real."
- Email + password (Lovable Cloud)

**Home / Detect**
- Top bar: AIsore mark + credit pill (`28 / 30`) + plan badge
- Greeting + short prompt
- Three primary tiles: **Photo · 2**, **Video · 10**, **Text · 2** — clean cards with icon, label, and credit cost
- "Paste a link" input below the tiles, auto-detects type

**Upload / Input flow** (one screen per type)
- Photo: tap-to-pick / drag-drop, preview thumbnail
- Video: same, with 30-second client validation
- Text: textarea with live word counter (`347 / 1000`), blocks over 1000
- Link: paste field, auto type-detect
- Sticky bottom CTA: "Analyze · 2 credits", disabled when not enough

**Analyzing screen**
- Eye-star logo gently pulsing center-screen, short status text

**Result**
- Hero block: large confidence score (`87 / 100`) on a black background with orange accent ring
- Verdict label: **Likely AI** / **Likely Human** / **Uncertain**
- Suspected model card (e.g. "Midjourney v6", "GPT-4o", "Sora") with model logo placeholder
- Preview of analyzed content
- Actions: "Analyze another", "Share result"

**History**
- Clean list: thumbnail, type icon, score chip (orange if AI, black if human), date
- Tap → full result

**Account / Plan**
- Email, plan, credits remaining, monthly reset date
- "Upgrade to Pro — $3.99/mo" → instantly flips to Pro, grants 300 credits, confirmation toast
- Pro users see "Cancel plan" → drops back to Free
- Log out

**Navigation**
- Mobile: bottom tab bar (Detect / History / Account) — clean white with thin top border
- Desktop: same destinations as a top nav inside a centered max-width layout (~480–560px for the app shell so the mobile-feel is preserved on big screens, with generous surrounding whitespace)

## Detection Logic (mocked)

- Server function simulates ~1.5s processing
- Returns `{ score: 0–100, verdict, suspectedModel, contentType }`
- Suspected model picked from a curated list per type (images: Midjourney / DALL·E / SDXL / Flux; text: GPT-4o / Claude / Gemini; video: Sora / Runway / Veo)
- Score deterministically derived from a hash of input so re-analyzing the same content is consistent

## Credits & Plan Rules

- Free: 30 credits/month · Pro: 300 credits/month
- Photo/Text = 2, Video = 10
- Credits decremented atomically server-side; insufficient credits → clear error + upgrade prompt
- Limits enforced both client-side (UX) and server-side (security)
- Auto-reset when `credits_reset_at` has passed

## Data Model (Lovable Cloud)

- `profiles` — user_id, email, plan (`free` | `pro`), credits_remaining, credits_reset_at
- `analyses` — id, user_id, content_type, input_preview, score, verdict, suspected_model, credits_spent, created_at
- RLS so users only see their own data
- Auto-create profile on signup via trigger

## Out of Scope for MVP

- Real AI detection (mocked)
- Real payments (upgrade is a button flip)
- Email verification, password reset, social auth

## Technical Notes

- TanStack Start, file-based routes: `/login`, `/signup`, `/` (detect), `/detect/photo`, `/detect/video`, `/detect/text`, `/result/$id`, `/history`, `/account`
- Auth + DB via Lovable Cloud (email/password)
- Server functions: `analyzeContent`, `upgradeToPro`, `downgradeToFree`, `getCredits`
- Photo/video stored in a private `uploads` storage bucket, RLS-scoped to owner
- Logo asset already saved at `src/assets/aisore-logo.png`
