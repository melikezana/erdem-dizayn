import "server-only";

import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/auth-server";
import { SupabaseConfigurationError } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string;
};

export type AdminAccess =
  | {
      allowed: true;
      user: AdminUser;
    }
  | {
      allowed: false;
      reason: "configuration" | "unauthenticated";
      message: string;
    };

export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? "admin",
  };
});

export async function requireAdminAccess(): Promise<AdminAccess> {
  try {
    const user = await getAdminUser();

    if (!user) {
      return {
        allowed: false,
        reason: "unauthenticated",
        message: "Bu alan için admin oturumu gerekiyor.",
      };
    }

    return { allowed: true, user };
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      return {
        allowed: false,
        reason: "configuration",
        message:
          "Supabase ortam değişkenleri eksik. Admin panelini kullanmak için .env.local dosyasını tamamlayın.",
      };
    }

    throw error;
  }
}

export const ADMIN_AUTH_SETUP_STEPS = [
  "Supabase Authentication içinde ilk admin kullanıcısını oluşturun.",
  "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY ve SUPABASE_SERVICE_ROLE_KEY değerlerini ekleyin.",
  "Migration dosyalarını Supabase projenize uygulayın.",
  "Admin işlemleri yalnızca server tarafında doğrulanmış oturumla çalışır.",
] as const;
