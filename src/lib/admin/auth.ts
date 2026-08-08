import "server-only";

export type AdminAccess =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      reason: string;
    };

export async function requireAdminAccess(): Promise<AdminAccess> {
  return {
    allowed: false,
    reason:
      "Admin authentication is intentionally disabled until Supabase Auth session validation is configured.",
  };
}

export const ADMIN_AUTH_SETUP_STEPS = [
  "Enable Supabase Auth for the project.",
  "Add a server-side session helper that validates the authenticated user.",
  "Add an allowlist or role claim for Erdem Dizayn administrators.",
  "Create narrow authenticated admin policies or keep all mutations behind service-role route handlers.",
] as const;
