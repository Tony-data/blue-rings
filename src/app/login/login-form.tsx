"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

const initial: LoginState = { error: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className="mt-6 space-y-3">
      <label htmlFor="password" className="eyebrow block text-muted">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? "login-error" : undefined}
        className="block w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/20"
      />
      {state.error && (
        <p id="login-error" role="alert" className="text-sm text-slate">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="pill pill--solid w-full justify-center disabled:opacity-60"
      >
        {pending ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
