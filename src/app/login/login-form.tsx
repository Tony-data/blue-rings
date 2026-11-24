"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

const initial: LoginState = { error: null, tries: 0 };

/**
 * Just a box with a blinking cursor. Enter submits; a wrong password shakes
 * the box and clears it. The label and error are kept for screen readers.
 */
export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className="w-full">
      <label htmlFor="password" className="sr-only">
        Password
      </label>
      <input
        // a new key after each failed try remounts the box: empty, focused, and shaking
        key={state.tries}
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        readOnly={pending}
        autoComplete="current-password"
        aria-invalid={state.error ? true : undefined}
        aria-describedby="login-error"
        className={`block h-16 w-full rounded-2xl border bg-surface/95 px-6 text-center text-2xl tracking-[0.35em] text-ink caret-blue shadow-[0_24px_60px_-30px_rgba(14,23,30,0.45)] backdrop-blur-sm outline-none transition-[border-color,box-shadow] duration-300 focus:ring-4 focus:ring-blue/15 ${
          pending ? "animate-pulse border-blue" : "border-line focus:border-blue"
        } ${state.error ? "login-shake" : ""}`}
      />
      <button type="submit" className="sr-only">
        Enter
      </button>
      <p id="login-error" role="alert" className="sr-only">
        {state.error ?? ""}
      </p>
    </form>
  );
}
