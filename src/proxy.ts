import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  getSupabaseBrowserConfig,
  SupabaseConfigurationError,
} from "@/lib/supabase/config";

type PendingCookie = {
  name: string;
  value: string;
  options: Parameters<NextResponse["cookies"]["set"]>[2];
};

const ADMIN_LOGIN_PATH = "/admin/login";

function isAdminLogin(pathname: string) {
  return pathname === ADMIN_LOGIN_PATH;
}

function getLoginRedirectUrl(request: NextRequest) {
  const redirectUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (nextPath !== ADMIN_LOGIN_PATH) {
    redirectUrl.searchParams.set("next", nextPath);
  }

  return redirectUrl;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  let pendingCookies: PendingCookie[] = [];
  let pendingHeaders: Record<string, string> = {};

  const applyAuthCookies = (target: NextResponse) => {
    pendingCookies.forEach(({ name, value, options }) => {
      target.cookies.set(name, value, options);
    });
    Object.entries(pendingHeaders).forEach(([key, value]) => {
      target.headers.set(key, value);
    });
  };

  try {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseBrowserConfig();
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          pendingCookies = cookiesToSet;
          pendingHeaders = headers;

          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });
          applyAuthCookies(response);
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !isAdminLogin(request.nextUrl.pathname)) {
      const redirectResponse = NextResponse.redirect(getLoginRedirectUrl(request));
      applyAuthCookies(redirectResponse);
      return redirectResponse;
    }

    if (user && isAdminLogin(request.nextUrl.pathname)) {
      const redirectResponse = NextResponse.redirect(new URL("/admin", request.url));
      applyAuthCookies(redirectResponse);
      return redirectResponse;
    }

    return response;
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      if (!isAdminLogin(request.nextUrl.pathname)) {
        return NextResponse.redirect(getLoginRedirectUrl(request));
      }

      return response;
    }

    throw error;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
