# Backend Setup

This site uses Next.js App Router route handlers with Supabase PostgreSQL.

## Environment

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` must stay server-only. Do not expose it in client components, config files used by the browser, or public hosting dashboards.

## Database

Run `supabase/migrations/001_initial_schema.sql` in Supabase. It creates:

- `appointments`
- `projects`
- `project_updates`

RLS is enabled on all three tables. The migration intentionally creates no public table policies; public visitors use controlled API routes only.

Optional local/demo data lives in `supabase/seed.sql` and inserts `ERD-24018`.

## Admin Auth

`/admin`, `/admin/projects`, and `/admin/appointments` are present but fail closed. Editable admin functionality remains disabled until Supabase Auth session validation and an administrator allowlist or role claim are configured.

## Rate Limiting

`POST /api/appointments` includes an in-memory IP rate limit and a hidden honeypot field. The in-memory limit is useful as a lightweight foundation, but a durable production limit should be backed by the deployment platform, Redis, Upstash, or another shared store if the app runs across multiple serverless instances.
