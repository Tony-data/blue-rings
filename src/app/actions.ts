"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, SESSION_DAYS, safeEqual, tokenFor } from "@/lib/auth-token";

/** `tries` changes on every failed attempt so the form can replay its "shake". */
export type LoginState = { error: string | null; tries: number };

export async function login(prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = process.env.SITE_PASSWORD;
  if (!password) {
    return { error: "The site password hasn't been set up yet (SITE_PASSWORD).", tries: prev.tries + 1 };
  }

  const attempt = String(formData.get("password") ?? "");
  const [given, expected] = await Promise.all([tokenFor(attempt), tokenFor(password)]);

  if (!safeEqual(given, expected)) {
    // Slow down guessing a little.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: "That password isn't right.", tries: prev.tries + 1 };
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
