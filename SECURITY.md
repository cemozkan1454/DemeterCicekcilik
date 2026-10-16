# Security checks — 2026-10-16

The admin screen requires a server-verified Supabase user and an explicit
`is_gallery_admin()` result of `true`. A local session object alone is not
authorization. Database and Storage RLS remain the authorization boundary.
Auth network calls run outside `onAuthStateChange` to avoid the SDK auth lock.

## Dependency update

- Vite 8 and React plugin 6; Node 24 pinned for Cloudflare builds.
- Supabase JS updated within version 2.
- Compatible dependency updates and a patched `postcss-selector-parser` override.
- Browser compilation target kept explicit for existing mobile users.
- Production-only `npm audit --omit=dev`: 0 vulnerabilities at check time.

## Known development-only advisory

`braces@3.0.3`: GHSA-vfj7-8cjw-p6xm (deeply nested patterns can exhaust the stack).
No patched braces version was published at check time. Tailwind 3 brings this
dependency through chokidar/micromatch/fast-glob; npm reports five affected
packages in this chain, representing one underlying advisory.

This dependency processes repository-controlled build patterns, not visitor
uploads, photo names or Supabase responses. Cloudflare serves static output;
neither this Node dependency nor the Vite development server serves visitors.
Do not feed untrusted glob patterns into the build or run builds against
unreviewed source with access to deployment secrets.

Replacing Tailwind 3 with Tailwind 4 removes this chain, but changes CSS behavior
and browser requirements. That migration needs a separate visual and mobile
compatibility review. Do not hide this advisory with a forced dependency override.

Reference: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm

## Verification and remaining dashboard actions

Typecheck, production build and lint passed. Automated Edge tests passed for a
clean session, a forged session rejected by the real auth server, a simulated
non-admin account, failed role verification, and a simulated verified admin
uploading a PNG with an edited name. Simulated cases do not substitute for live
non-admin RLS or real admin login tests.

Supabase still reported `disable_signup=false` during the live check. Disable
public signups in the correct project and save. Keep the Email provider enabled.
Existing users can still sign in. No new SQL is required for this UI check;
`is_gallery_admin()` already exists in the database setup.

A real temporary non-admin account is still needed to finish authenticated RLS
and logout checks. Keep test credentials in `.env.security.local` (gitignored),
never in source, screenshots, audit reports or Git commits.
