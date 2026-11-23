"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, SESSION_DAYS, safeEqual, tokenFor } from "@/lib/auth-token";

export type LoginState = { error: string | null };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = process.env.SITE_PASSWORD;
  if (!password) {
    return { error: "The site password hasn't been set up yet (SITE_PASSWORD)." };
  }

  const attempt = String(formData.get("password") ?? "");
  const [given, expected] = await Promise.all([tokenFor(attempt), tokenFor(password)]);

  if (!safeEqual(given, expected)) {
    // Slow down guessing a little.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: "That password isn't right." };
  }

  (await cookies()).set(AUTH_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  redirect("/");
}

export async function logout() {
  (await cookies()).delete(AUTH_COOKIE);
  redirect("/login");
}
