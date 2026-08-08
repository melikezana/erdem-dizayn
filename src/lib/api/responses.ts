import { NextResponse } from "next/server";
import type { ApiError, ApiSuccess } from "@/types/api";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data }, { status });
}

export function apiError(
  code: string,
  message: string,
  status: number,
  details?: Record<string, string[]>
) {
  const body: ApiError = {
    ok: false,
    error: details ? { code, message, details } : { code, message },
  };

  return NextResponse.json(body, { status });
}
