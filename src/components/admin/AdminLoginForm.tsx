"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, LoaderCircle, LogIn } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type AdminLoginFormProps = {
  isConfigured: boolean;
};

export function AdminLoginForm({ isConfigured }: AdminLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const nextPath = searchParams.get("next");
  const redirectPath =
    nextPath && nextPath.startsWith("/admin") && nextPath !== "/admin/login"
      ? nextPath
      : "/admin";

  const supabase = useMemo(() => {
    if (!isConfigured) {
      return null;
    }

    try {
      return createBrowserSupabaseClient();
    } catch {
      return null;
    }
  }, [isConfigured]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || isPending) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setError("");
    setIsPending(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsPending(false);

    if (loginError) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    router.replace(redirectPath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {!isConfigured && (
        <div
          role="alert"
          className="flex gap-3 rounded-lg border border-[#9A5C2F]/30 bg-[#F6F2EA] p-4 text-sm leading-6 text-[#102B49]/76"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#9A5C2F]" />
          <p>
            Supabase ortam değişkenleri eksik. Admin girişi için .env.local
            dosyasını tamamlayın.
          </p>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-[#9A3D2F]/20 bg-[#FFF7F4] px-4 py-3 text-sm font-semibold text-[#8A2E24]"
        >
          {error}
        </p>
      )}

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
          E-posta
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={!isConfigured || isPending}
          className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm font-semibold text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/70">
          Şifre
        </span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={!isConfigured || isPending}
          className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm font-semibold text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <button
        type="submit"
        disabled={!isConfigured || isPending}
        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102B49] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F] disabled:cursor-not-allowed disabled:bg-[#102B49]/55"
      >
        {isPending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        <span>{isPending ? "Giriş yapılıyor" : "Giriş Yap"}</span>
      </button>
    </form>
  );
}
