export class SupabaseConfigurationError extends Error {
  constructor(message = "Missing Supabase environment variables.") {
    super(message);
    this.name = "SupabaseConfigurationError";
  }
}

export function getSupabaseBrowserConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new SupabaseConfigurationError(
      "Missing Supabase public environment variables."
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

export function getSupabaseServiceRoleConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new SupabaseConfigurationError(
      "Missing Supabase server environment variables."
    );
  }

  return { supabaseUrl, serviceRoleKey };
}
