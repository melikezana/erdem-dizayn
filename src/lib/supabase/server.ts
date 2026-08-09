import "server-only";

import { createClient } from "@supabase/supabase-js";
import {
  getSupabaseServiceRoleConfig,
  SupabaseConfigurationError,
} from "@/lib/supabase/config";

export { SupabaseConfigurationError };

export function createServiceRoleSupabaseClient() {
  const { supabaseUrl, serviceRoleKey } = getSupabaseServiceRoleConfig();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
