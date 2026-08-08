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

Run the SQL files in `supabase/migrations/` in order. They create:

- `appointments`
- `projects`
- `project_updates`
- `project_code_sequences`

RLS is enabled on all application tables. The migration intentionally creates no public table policies; public visitors use controlled API routes only.

Project codes are generated server-side by `public.create_project(...)` with the format `ERD-YYNNN`. The RPC does not accept a `project_code` argument, updates a per-year sequence atomically, uppercases the generated code, and relies on the database `UNIQUE` constraint on `projects.project_code` for collision safety.

Optional local/demo data lives in `supabase/seed.sql` and inserts `ERD-24018`.

## Admin Auth

`/admin`, `/admin/projects`, and `/admin/appointments` are present but fail closed. Editable admin functionality remains disabled until Supabase Auth session validation and an administrator allowlist or role claim are configured.

## Rate Limiting

`POST /api/appointments` includes an in-memory IP rate limit and a hidden honeypot field. The in-memory limit is useful as a lightweight foundation, but a durable production limit should be backed by the deployment platform, Redis, Upstash, or another shared store if the app runs across multiple serverless instances.
