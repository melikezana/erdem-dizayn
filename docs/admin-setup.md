# Admin Panel Setup

1. Create or open the Supabase project for Erdem Dizayn & Mekanik.
2. Run the SQL files in `supabase/migrations` in order.
3. In Supabase Authentication, create the first admin user manually. The website does not expose public sign-up.
4. Add `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
5. Run `npm run dev`.
6. Visit `/admin/login` and sign in with the Supabase Auth user.

Admin pages use Supabase Auth cookies on the server. Public visitors cannot list projects, appointments, or customer personal data directly because RLS has no public table policies.
