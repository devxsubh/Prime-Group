# Auth flow — surfaces, redirect map, QA checklist, risks

Manual QA reference for **member** and **admin** auth. Paths are relative to the app origin (dev or production).

---

## 1. Surfaces inventory

### Member — pages (UI)

| Path | Role |
|------|------|
| `/sign-up` | Register; `emailRedirectTo` → `/auth/callback?next=/hi` |
| `/sign-in` | Password sign-in; optional `?next=` (safe relative path only); messages `password_reset`, `email_verified` |
| `/hi` | After verify link: client `signOut`, CTA → `/sign-in?message=email_verified` |
| `/forgot-password` | `resetPasswordForEmail` → `/auth/callback?next=/reset-password` |
| `/reset-password` | Needs session from callback; `updateUser` password → `signOut` → `/sign-in?message=password_reset` |
| `/onboarding` | Logged-in wizard; server redirects by profile state |
| `/onboarding/thank-you` | Logged-in; requires basics + `profile_completion_pct >= 80` |
| `/discover`, `/profile`, `/settings`, `/favorites` | **Middleware-protected** + basic profile gate on server |

### Member — route handler

| Path | Role |
|------|------|
| `GET /auth/callback` | `code` → `exchangeCodeForSession`; or `token_hash` + `type` → `verifyOtp`; sets cookies on redirect; `next` sanitized (`/`, disallows `//`); failure → `/sign-in?error=auth_callback_error` |

### Member — middleware

| File | Role |
|------|------|
| `middleware.ts` | Invokes `updateSession` for almost all paths (see matcher) |
| `src/lib/supabase/middleware.ts` | Only runs Supabase for `/ onboarding` prefix **or** `/discover`, `/profile`, `/settings`, `/favorites`; unauthenticated → `/sign-in`; adds `?next=` **only** for those protected prefixes when redirecting |

### Member — notable components / hooks

| File | Role |
|------|------|
| `src/components/auth/auth-form.tsx` | Primary sign-up / sign-in / resend |
| `src/components/hooks/useAuth.ts` | Alternate sign-in/sign-up (keep in sync with form if used elsewhere) |
| `src/lib/profile-basic-gate.ts` | Shared “basic profile complete?” rules |
| `src/components/auth/onboarding-wizard.tsx` | Multi-step save + photos finish → `/onboarding/thank-you` |

### Member — APIs using **default** (member) server session

Uses `createClient()` from `src/lib/supabase/server.ts` and `getUser()` — examples:

- `src/app/api/profile/progress/route.ts`
- `src/app/api/payments/*`
- `src/app/api/credits/*`
- `src/app/api/contact/route.ts` (verify if public or authed)

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
| `/discover`, `/profile`, `/settings`, `/favorites` (any subpath) | `/sign-in?next=<pathname>` (pathname only; **no original query string**) |
| `/onboarding` or `/onboarding/thank-you` | `/sign-in` (**no `next`** — middleware does not treat onboarding as protected for `next`) |
| `/sign-in`, `/sign-up`, `/`, public marketing pages | Normal page (no middleware auth) |

Note: `onboarding/page.tsx` contains `redirect("/sign-in?next=/onboarding")` if no user, but for typical navigation **middleware runs first** and sends guests to `/sign-in` without `next` (see QA tests).

### Authenticated — middleware (protected routes only)

| Condition | You get |
|-----------|---------|
| User + `/discover|/profile|/settings|/favorites` + **basic profile incomplete** | `/onboarding` |
| User + same + **basic profile complete** | Page loads |

Basic fields: `full_name` (≥2 chars), `date_of_birth`, `gender` in `male|female|other`, `contact_number` (≥8 digits after strip), `country`, `city` — see `src/lib/profile-basic-gate.ts`.

### Sign-in (client, after `signInWithPassword` success)

| Condition | You get |
|-----------|---------|
| Basic profile incomplete | `router.push("/onboarding")` |
| Basic complete + safe `next` from page props | `router.push(next)` |
| Basic complete + no / unsafe `next` | `router.push("/discover")` |

### Email verification callback

| Request | You get |
|---------|---------|
| `GET /auth/callback?code=...&next=/hi` (or safe path) | Session cookies on response; redirect to `next` |
| `GET /auth/callback?token_hash=...&type=...&next=...` | Same if `verifyOtp` succeeds |
| Invalid / missing params | `/sign-in?error=auth_callback_error` |
| `next=https://evil.com` or `next=//evil` | Treated as unsafe → redirect target falls back to **`/discover`** (for callback default) — still verify in QA |

Default when `next` missing in callback: **`/discover`** (not `/hi`) — signup uses explicit `next=/hi` in `emailRedirectTo`.

### `/hi` page

| Step | Behavior |
|------|----------|
| Load | `signOut()` on member client (clear link-granted session) |
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

### C. Sign-in & `next`

| # | Setup | Do | Expect | Watch |
|---|--------|-----|--------|--------|
| C1 | Verified + basic incomplete | Sign in from `/sign-in` | `/onboarding` | Sent to `/discover` wrongly |
| C2 | Verified + basic complete | Sign in | `/discover` or safe `next` | Wrong default |
| C3 | — | Open `/sign-in?next=/favorites`, sign in | After success → `/favorites` | Open redirect if `next=//evil.com` |
| C4 | — | Open `/sign-in?next=https://evil.com` | Should **not** navigate off-site | Browser leaves origin |

### D. Middleware & deep links

| # | Setup | Do | Expect | Watch |
|---|--------|-----|--------|--------|
| D1 | Logged out | Open `/discover` | `/sign-in?next=/discover` | Missing `next` |
| D2 | Logged out | Open `/profile/edit` | `/sign-in?next=/profile/edit` | Query on original URL **not** preserved in `next` |
| D3 | Logged in, basics incomplete | Open `/discover` | Redirect to `/onboarding` | Can browse other non-protected pages incorrectly |
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

### G. Admin

| # | Setup | Do | Expect | Watch |
|---|--------|-----|--------|--------|
| G1 | Valid `ADMIN_FIXED_*` env | `/admin/login` POST | `200`, cookies set, `/admin` loads | 500 if env missing |
| G2 | Wrong password | POST | 401, no access | Error leaks internals |
| G3 | Member logged in on main site | Open `/admin` | Must **not** use member cookie for admin (isolate) | Accidental `isAdmin` |
| G4 | Auth user without `users.role` admin | Admin session edge case | Redirect login after `/api/admin/me` | API 403 vs UI |
| G5 | `GET /api/admin/auth-users` without admin cookie | curl/fetch | 401/403 | Data leak |

### H. Security & perf spot-checks

| # | Setup | Do | Expect | Watch |
|---|--------|-----|--------|--------|
| H1 | — | `/auth/callback?next=//evil.com` | Redirect stays same-site policy | Open redirect |
| H2 | Logged in | Load page using `/img/signin.avif` | Reasonable (note: `.avif` **not** in middleware exclude list) | Extra middleware/auth work on static images |
| H3 | Two tabs | Sign out in one | Other tab behavior | Stale UI |

---

## 4. Priority risks & follow-up fixes (backlog)

| Priority | Risk | Suggested fix |
|----------|------|----------------|
| P1 | Guest hitting `/onboarding` or `/onboarding/thank-you` gets `/sign-in` **without** `next`, so return path after sign-in may ignore onboarding intent | In `src/lib/supabase/middleware.ts`, when `!user` and path starts with `/onboarding`, set `next` to full safe path (e.g. pathname only `/onboarding` or `/onboarding/thank-you`) same as protected routes |
| P1 | `next` on sign-in redirect from middleware uses **pathname only** — query lost | Optionally append encoded `search` or full path if product needs it |
| P2 | Callback default `next` is `/discover` when param missing — fine for generic verify, but document | Ensure all emails set explicit `next` where needed |
| P2 | `AuthForm` “Remember me” is not wired to Supabase persistence | Either remove label or implement session persistence explicitly |
| P2 | `useAuth.ts` duplicates sign-up redirect URL — drift vs `auth-form.tsx` | Single source for `emailRedirectTo` / `getSiteUrl()` if introduced |
| P3 | Admin `fixed-login` + service-role repair is powerful — protect env + rate limit in production | Infra / WAF / monitoring |
| P3 | `/api/admin/me` returns `200` with `isAdmin: false` for some errors — client treats as non-admin | OK for UX; document for API consumers |

---

## 5. File index (quick navigation)

- Callback: `src/app/(auth)/auth/callback/route.ts`
- Middleware: `middleware.ts`, `src/lib/supabase/middleware.ts`
- Gate: `src/lib/profile-basic-gate.ts`
- Forms: `src/components/auth/auth-form.tsx`
- Onboarding: `src/app/(onboarding)/onboarding/page.tsx`, `thank-you/page.tsx`, `src/components/auth/onboarding-wizard.tsx`
- Hi: `src/app/(auth)/hi/page.tsx`
- Admin layout/login: `src/app/(admin)/admin/layout.tsx`, `login/page.tsx`
- Admin API: `src/app/api/admin/fixed-login/route.ts`, `me/route.ts`, `access/route.ts`, …
