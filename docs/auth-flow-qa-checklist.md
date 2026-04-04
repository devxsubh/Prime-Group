# Auth flow — surfaces, redirect map, QA checklist, risks

Manual QA reference for **member** and **admin** auth. Paths are relative to the app origin (dev or production).

---

## 0. Document review & audit log

**Last reviewed:** 2026-04-04 — codebase walk-through (middleware, callback, sign-in/up, reset password, `/hi`, API routes, post-login helpers).

### Verified / updated in code (this review)

| Area | What was checked | Outcome |
|------|------------------|---------|
| Post-login redirects | Scattered logic in middleware, client sign-in, and `/auth/callback` | **Centralized** in `getPostLoginRedirect(user, { next, basicProfile })` (`src/lib/post-login-redirect.ts`). Callback recomputes `Location` after session + profile load. Protected path list shared via `isProtectedMemberPath` in middleware. |
| Open `next` / defaults | `sanitizeNextPath` vs optional next | Still from `src/lib/safe-next-path.ts`; post-login uses `sanitizeOptionalNextPath` inside `getPostLoginRedirect`. Invalid `next` + incomplete profile → `/onboarding` (callback previously could land on `/discover` first). |
| API auth | “Public vs authed” ambiguity | **Documented and enforced explicitly** in `src/lib/api-route-access.ts`. `/api/contact` = public, validated body + **service-role** insert (no reliance on member cookie). `/api/payments/verify` = **public_hmac** (Razorpay signature, no session). Member credit/payment APIs use `requireUserWithBasicProfile`. |
| Admin UPI confirm | Who can POST `/api/payments/confirm-upi` | **Issue found:** handler used **member** `createClient()` while admin UI uses **admin** cookies → admins often got 401. **Fixed:** `requireAdminApiUser()` (admin cookie + `users.role`). |
| Clock skew / flaky tokens | Callback + reset password | **Mitigations added:** bounded retry on `exchangeCodeForSession` / `verifyOtp` for transient errors (`src/lib/auth/auth-callback-errors.ts`); sign-in banner `error=auth_timing`; reset-password `refreshSession` + clearer `updateUser` errors. |
| `/hi` | Email-verify landing vs OAuth | **Prior fix retained in code:** conditional session handling for password vs OAuth-style users (see `src/app/(auth)/hi/page.tsx`). |

### Issues still open (track in backlog / QA)

| ID | Issue | Severity |
|----|--------|----------|
| O1 | Guest opening `/onboarding` or `/onboarding/thank-you`: middleware sends `/sign-in` **without** `?next=…`, so return path after sign-in may not restore onboarding intent | P1 |
| O2 | Middleware `?next=` uses **pathname only** — original query string on protected URLs is not preserved | P1 |
| O3 | `AuthForm` “Remember me” not wired to Supabase persistence | P2 |
| O4 | `useAuth.ts` still duplicates `emailRedirectTo` pattern vs `auth-form.tsx` — drift risk | P2 |
| O5 | Admin `fixed-login` is sensitive — ensure env secrecy, rate limiting, monitoring in production | P3 |

---

## 1. Surfaces inventory

### Member — pages (UI)

| Path | Role |
|------|------|
| `/sign-up` | Register; `emailRedirectTo` → `/auth/callback?next=/hi` |
| `/sign-in` | Password sign-in; optional `?next=` (safe relative path only); messages `password_reset`, `email_verified`; errors `auth_callback_error`, **`auth_timing`**, `reset_link_expired`, `recovery_wrong_account` |
| `/hi` | Post–email-verify landing; may `signOut` or keep session depending on path (password vs OAuth-style); successful callback adds **`?pg_verified=1`** — if there is **no session** on load, copy explains “verification succeeded, please sign in” (cookie blocked); CTA → `/sign-in?message=email_verified` |
| `/forgot-password` | `resetPasswordForEmail` → `/auth/callback?next=/reset-password` |
| `/reset-password` | Needs session from callback; `updateUser` password → `signOut` → `/sign-in?message=password_reset` |
| `/onboarding` | Logged-in wizard; server redirects by profile state |
| `/onboarding/thank-you` | Logged-in; requires basics + `profile_completion_pct >= 80` |
| `/discover` | **Public** listing (browse without sign-in) |
| `/discover/[id]` | **Middleware-protected** (sign-in + basic profile) — full profile detail |
| `/profile`, `/settings`, `/favorites` | **Middleware-protected** + basic profile gate on server |

### Member — route handler

| Path | Role |
|------|------|
| `GET /auth/callback` | `code` → `exchangeCodeForSession` (or `token_hash` + `type` → `verifyOtp`); **bounded retry** on transient errors; **duplicate link open:** if exchange fails with “already used” / stale PKCE class errors but `getUser()` already has a session (first request won), **same success redirect** as first hit (`authCallbackFailureMayBeDuplicateHit`); cookies on redirect; **success `Location`** from `getPostLoginRedirect` + profile row; failure → `auth_callback_error`, **`auth_timing`**, `reset_link_expired`, or `email_verified` per case; `next` for failure uses `sanitizeNextPath` |

### Member — middleware

| File | Role |
|------|------|
| `middleware.ts` | Invokes `updateSession` for almost all paths (see matcher) |
| `src/lib/supabase/middleware.ts` | Runs Supabase for `/onboarding` or protected paths: **`/discover/<id>`** (not `/discover` listing), `/profile`, `/settings`, `/favorites`; **`/api/*` is not gated here**; unauthenticated → `/sign-in` + `next` when applicable |

### Member — notable components / hooks

| File | Role |
|------|------|
| `src/components/auth/auth-form.tsx` | Primary sign-up / sign-in / resend |
| `src/components/hooks/useAuth.ts` | Alternate sign-in/sign-up (keep in sync with form if used elsewhere) |
| `src/lib/profile-basic-gate.ts` | Shared “basic profile complete?” rules |
| `src/lib/post-login-redirect.ts` | **`getPostLoginRedirect`**, `DEFAULT_POST_LOGIN_PATH`, `isProtectedMemberPath` |
| `src/lib/api-route-access.ts` | API public vs protected policy + `requireAdminApiUser` |
| `src/lib/auth/auth-callback-errors.ts` | Callback retry + timing-related UX helpers |
| `src/components/auth/onboarding-wizard.tsx` | Multi-step save + photos finish → `/onboarding/thank-you` |

### Member — API access (explicit tiers)

**Source of truth:** `src/lib/api-route-access.ts` (table in file header). Do not assume middleware or RLS alone.

| Tier | Examples | Enforcement |
|------|----------|-------------|
| **public** | `POST /api/contact`, `GET /api/settings/payment-method`, `POST /api/auth/resend-verification` | No member session; service role and/or anon client + validation / rate limits |
| **public_hmac** | `POST /api/payments/verify` | Razorpay HMAC + service role (client calls after checkout) |
| **member_onboarded** | `/api/credits/*`, `/api/payments/create-order`, `/api/payments/status`, `/api/profile/progress` | `requireUserWithBasicProfile()` |
| **admin** | `/api/admin/*` (except `fixed-login`), `POST /api/payments/confirm-upi` | Admin cookie + `requireAdminApiUser()` or per-route role checks |
| **public_secret** | `POST /api/admin/fixed-login` | Env-fixed credentials |

### Admin — pages

| Path | Role |
|------|------|
| `/admin/login` | POST `/api/admin/fixed-login` with `credentials: include`; then `replace /admin` |
| `/admin` and nested | `admin/layout.tsx`: admin browser client session + `GET /api/admin/me` for `isAdmin` |

### Admin — APIs (isolated **admin** cookies)

| Path | Role |
|------|------|
| `POST /api/admin/fixed-login` | Validates body vs env; `createAdminServerClient().signInWithPassword`; optional service-role repair |
| `GET /api/admin/me` | Admin cookie session; `users.role` → `isAdmin` |
| `GET/POST /api/admin/access` | Admin role gate + manage admins |
| `GET /api/admin/access/users` | Admin listing |
| `GET/PATCH … /api/admin/profiles`, `settings`, `auth-users` | Service role after admin `getUser` + role check |

### Sign-out entry points (member vs admin)

| Location | Cookie/key |
|----------|------------|
| `src/app/(auth)/hi/page.tsx` | Default member client → member session cleared |
| `src/components/profile/settings-client.tsx` | Member |
| `src/app/(admin)/admin/components/Sidebar.tsx` | **Admin** client (`createAdminBrowserClient`) |
| `src/app/(admin)/admin/layout.tsx` | Admin client when not admin |

---

## 2. Redirect map (“if this → then that”)

### Unauthenticated visitor

| You open | You get |
|---------|---------|
| `/discover` (listing only) | Normal page (not auth-gated) |
| `/discover/<id>`, `/profile`, `/settings`, `/favorites` (as configured) | `/sign-in?next=<pathname>` (pathname only; **no original query string**) |
| `/onboarding` or `/onboarding/thank-you` | `/sign-in` (**no `next`** — middleware does not treat onboarding as protected for `next`) |
| `/sign-in`, `/sign-up`, `/`, public marketing pages | Normal page (no middleware auth) |

Note: `onboarding/page.tsx` contains `redirect("/sign-in?next=/onboarding")` if no user, but for typical navigation **middleware runs first** and sends guests to `/sign-in` without `next` (see QA tests).

### Authenticated — middleware (protected routes only)

| Condition | You get |
|-----------|---------|
| User + **`/discover/<id>`** or `/profile|/settings|/favorites` + **basic profile incomplete** | `/onboarding` |
| User + same + **basic profile complete** | Page loads |

Basic fields: `full_name` (≥2 chars), `date_of_birth`, `gender` in `male|female|other`, `contact_number` (≥8 digits after strip), `country`, `city` — see `src/lib/profile-basic-gate.ts`.

### Sign-in (client, after `signInWithPassword` success)

Uses **`getPostLoginRedirect(user, { next: nextParam, basicProfile: profile })`** (same rules as callback).

| Condition | You get |
|-----------|---------|
| Basic profile incomplete + `next` not in bypass list (e.g. `/favorites`) | `/onboarding` |
| Basic profile incomplete + `next` in bypass list (`/hi`, `/reset-password`, `/onboarding`, `/checkout`, auth paths, …) | Sanitized `next` |
| Basic complete + safe `next` | That path |
| Basic complete + no / unsafe `next` | `/discover` |

### Email verification callback

| Request | You get |
|---------|---------|
| `GET /auth/callback?code=...&next=/hi` (or safe path) | Session cookies; **`Location`** = `getPostLoginRedirect` destination + **`pg_verified=1`** (hint for landing UIs if cookies are dropped) |
| `GET /auth/callback?token_hash=...&type=...&next=...` | Same if `verifyOtp` succeeds |
| Transient / clock-skew class errors | **Retry** once after short delay; then failure UX as below |
| Invalid / missing params | `/sign-in?error=auth_callback_error` |
| JWT / timing-style failure after retries | `/sign-in?error=auth_timing` |
| `next=https://evil.com` or `next=//evil` | Unsafe `next` dropped inside `getPostLoginRedirect`; incomplete → `/onboarding`, complete → `/discover` |

Default when `next` missing / invalid: **incomplete profile → `/onboarding`**, **complete → `/discover`** — signup email still sets explicit `next=/hi` in `emailRedirectTo`.

### `/hi` page

| Step | Behavior |
|------|----------|
| Load | May `signOut()` (e.g. password verify flow) or **retain session** (OAuth / no `email_confirmed_at`); **`pg_verified=1` + no session** → “Verification succeeded” / please sign in (Safari-style cookie drop); see `hi-content.tsx` |
| CTA | Link to `/sign-in?message=email_verified` |

### Onboarding server (`/onboarding`)

| Condition | Redirect |
|-----------|----------|
| No user | (middleware) `/sign-in` without `next` *(see mismatch note above)* |
| `profile_status === "active"` | `/discover` |
| Basic complete + `profile_completion_pct >= 80` | `/onboarding/thank-you` |
| Basic complete + `pct < 80` | `/discover` |
| Else | Show wizard |

### Thank-you (`/onboarding/thank-you`)

| Condition | Redirect |
|-----------|----------|
| No user | `/sign-in?next=/onboarding/thank-you` (middleware: actually `/sign-in` **without** next — same class of issue) |
| `profile_status === "active"` | `/discover` |
| Basic incomplete **or** `pct < 80` | `/onboarding` |

### Forgot / reset password

| Step | URL |
|------|-----|
| Forgot submit | Email with link → `/auth/callback?next=/reset-password` |
| Callback success | Session established → `/reset-password` |
| Reset submit success | `signOut` → `/sign-in?message=password_reset` |
| `/reset-password` without session | Client sends to `/sign-in?next=/reset-password` |

### Admin layout

| Path + state | Result |
|--------------|--------|
| `/admin/login` + admin session + `isAdmin` | Replace → `/admin` |
| `/admin/login` + no admin | Stay on login |
| `/admin/*` (not login) + no user | Replace → `/admin/login` |
| `/admin/*` + user but not admin | `signOut` admin session → `/admin/login` |

---

## 3. Manual QA checklist

Use **Setup / Do / Expect / Watch** for each row.

### A. Sign-up

| # | Setup | Do | Expect | Watch |
|---|--------|-----|--------|--------|
| A1 | Fresh email | Submit `/sign-up` | Success message + resend row | Duplicate email message if reused |
| A2 | Email already registered | Submit same email | Handled (identities check or Supabase error) | Confusing UX if message generic |
| A3 | After A1 | Open inbox, click confirm link | Land on `next` from link (e.g. `/hi`): verified story; session may exist until `/hi` runs | Stuck on callback error → `auth_callback_error` |

### B. Email verification & `/hi`

| # | Setup | Do | Expect | Watch |
|---|--------|-----|--------|--------|
| B1 | From A3 | Observe `/hi` | “Preparing…” then Sign in CTA | Flash of wrong page |
| B2 | On `/hi` | Wait, then click Sign in | `/sign-in?message=email_verified` + green banner | Session still active (should be signed out) |
| B3 | Unconfirmed | Try sign-in | Error + resend for “email not confirmed” style | No way to resend |
| B5 | Safari / strict cookies | After verify, land on `/hi?pg_verified=1` with cookies blocked | Title “Verification succeeded”, sign-in CTA + short cookie note; param stripped from URL | User thinks verify failed |
| B4 | — | Open `/sign-in?error=auth_timing` | Amber banner: device clock / try link again | Generic error only |

### C. Sign-in & `next`

| # | Setup | Do | Expect | Watch |
|---|--------|-----|--------|--------|
| C1 | Verified + basic incomplete | Sign in from `/sign-in` | `/onboarding` | Sent to `/discover` wrongly |
| C2 | Verified + basic complete | Sign in | `/discover` or safe `next` | Wrong default |
| C3 | Basic **complete** | Open `/sign-in?next=/favorites`, sign in | After success → `/favorites` | Open redirect if `next=//evil.com` |
| C3b | Basic **incomplete** | Same with `next=/favorites` | **`/onboarding`** (not favorites until basics done) | Drift vs middleware |
| C4 | — | Open `/sign-in?next=https://evil.com` | Should **not** navigate off-site | Browser leaves origin |

### D. Middleware & deep links

| # | Setup | Do | Expect | Watch |
|---|--------|-----|--------|--------|
| D1 | Logged out | Open `/discover` | Listing loads (no redirect) | Wrongly forced to sign-in |
| D1b | Logged out | Open `/discover/<profileId>` | `/sign-in?next=/discover/<id>` | Anonymous can read full profile |
| D2 | Logged out | Open `/profile/edit` | `/sign-in?next=/profile/edit` | Query on original URL **not** preserved in `next` |
| D3 | Logged in, basics incomplete | Open `/discover` listing | Stays on listing (public) | — |
| D3b | Logged in, basics incomplete | Open `/discover/<id>` | Redirect to `/onboarding` | Sees full profile without basics |
| D4 | Logged out | Open `/onboarding` | `/sign-in` **without** `?next=/onboarding` | After sign-in, user goes default path not onboarding |

### E. Onboarding & thank-you

| # | Setup | Do | Expect | Watch |
|---|--------|-----|--------|--------|
| E1 | New user mid-wizard | Complete step 0 (basics) | Data persists; step advances | DB errors |
| E2 | Basic complete, pct &lt; 80 | Visit `/onboarding` | Redirect `/discover` | Loop |
| E3 | Basic complete, pct ≥ 80, not active | Visit `/onboarding` | `/onboarding/thank-you` | Wrong threshold |
| E4 | Thank-you eligibility | Visit `/onboarding/thank-you` with low pct | Back to `/onboarding` | Exposed thank-you |

### F. Forgot / reset password

| # | Setup | Do | Expect | Watch |
|---|--------|-----|--------|--------|
| F1 | Known account | `/forgot-password` submit | Success message | Email not received (config) |
| F2 | From email link | Land on `/reset-password` | Form visible | No session → bounce to sign-in |
| F3 | Set password | Submit new password | `/sign-in?message=password_reset` | Still logged in with old session elsewhere |
| F4 | Wrong device clock / flaky JWT | Open reset link, land on form, submit | Clear error suggesting time/refresh/new link if session invalid | Opaque Supabase message |

### G. Admin

| # | Setup | Do | Expect | Watch |
|---|--------|-----|--------|--------|
| G1 | Valid `ADMIN_FIXED_*` env | `/admin/login` POST | `200`, cookies set, `/admin` loads | 500 if env missing |
| G2 | Wrong password | POST | 401, no access | Error leaks internals |
| G3 | Member logged in on main site | Open `/admin` | Must **not** use member cookie for admin (isolate) | Accidental `isAdmin` |
| G4 | Auth user without `users.role` admin | Admin session edge case | Redirect login after `/api/admin/me` | API 403 vs UI |
| G5 | `GET /api/admin/auth-users` without admin cookie | curl/fetch | 401/403 | Data leak |
| G6 | Admin logged in via `/admin/login` | Confirm UPI payment in revenue UI | `POST /api/payments/confirm-upi` succeeds (admin cookie) | 401 if handler used wrong cookie (regression) |

### H. Security & perf spot-checks

| # | Setup | Do | Expect | Watch |
|---|--------|-----|--------|--------|
| H1 | — | `/auth/callback?next=//evil.com` | Redirect stays same-site policy | Open redirect |
| H2 | Logged in | Load page using `/img/signin.avif` | Reasonable (note: `.avif` **not** in middleware exclude list) | Extra middleware/auth work on static images |
| H3 | Two tabs | Sign out in one | Other tab behavior | Stale UI |
| H4 | Callback under load / flaky network | Complete OAuth or email link once | Eventually succeeds or clear error (retry path) | Infinite spinner |
| H5 | curl `POST /api/contact` with JSON body | No member cookie | 200/400/500 per validation + DB; **not** 401 from missing session | Accidental member-session coupling |

---

## 4. Priority risks & follow-up fixes (backlog)

| Priority | Risk | Status / suggested fix |
|----------|------|-------------------------|
| P1 | Guest hitting `/onboarding` or `/onboarding/thank-you` gets `/sign-in` **without** `next` | **Open** — add `?next=/onboarding` (safe pathname) in `src/lib/supabase/middleware.ts` when redirecting unauthenticated onboarding URLs |
| P1 | Middleware `next` uses **pathname only** — query lost | **Open** — product decision: optionally encode original `search` |
| ~~P1~~ | ~~`/api/payments/confirm-upi` used member cookie~~ | **Resolved** — `requireAdminApiUser()` |
| ~~P2~~ | ~~API routes “public vs authed” unclear~~ | **Resolved** — `src/lib/api-route-access.ts` + contact service-role insert |
| P2 | `AuthForm` “Remember me” not wired to Supabase persistence | **Open** — remove label or implement |
| P2 | `useAuth.ts` duplicates `emailRedirectTo` vs `auth-form.tsx` | **Open** — single helper constant |
| P2 | Callback / reset password flaky on clock skew | **Mitigated** — retries + `auth_timing` + reset-password refresh + copy (not a full guarantee) |
| P3 | Admin `fixed-login` + service-role repair is powerful | **Open** — env secrecy, rate limit, monitoring |
| P3 | `/api/admin/me` returns `200` with `isAdmin: false` for some errors | **Documented** — intentional for UX |

---

## 5. File index (quick navigation)

- Callback: `src/app/(auth)/auth/callback/route.ts`
- Callback errors / retry: `src/lib/auth/auth-callback-errors.ts`
- Middleware: `middleware.ts`, `src/lib/supabase/middleware.ts`
- Post-login redirect: `src/lib/post-login-redirect.ts`
- Safe `next`: `src/lib/safe-next-path.ts`
- Gate: `src/lib/profile-basic-gate.ts`, `src/lib/api-require-basic-profile.ts`
- API policy: `src/lib/api-route-access.ts`
- Forms: `src/components/auth/auth-form.tsx`
- Onboarding: `src/app/(onboarding)/onboarding/page.tsx`, `thank-you/page.tsx`, `src/components/auth/onboarding-wizard.tsx`
- Hi: `src/app/(auth)/hi/page.tsx`, `hi-content.tsx`
- Post-auth landing hint: `src/lib/auth/post-auth-landing.ts`
- Reset password: `src/app/(auth)/reset-password/page.tsx`
- Sign-in: `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- Admin layout/login: `src/app/(admin)/admin/layout.tsx`, `login/page.tsx`
- Admin API: `src/app/api/admin/fixed-login/route.ts`, `me/route.ts`, `access/route.ts`, …
- Payments: `src/app/api/payments/verify/route.ts`, `confirm-upi/route.ts`, …
