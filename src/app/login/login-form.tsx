"use client";

import { useActionState, useState, type SyntheticEvent } from "react";
import { login, type LoginState } from "../actions";

const initial: LoginState = { error: null, tries: 0 };
const DOT = "•";

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
      {/* a new key after each failed try remounts the box: empty, focused, and shaking */}
      <PasswordBox key={state.tries} shake={state.error !== null} pending={pending} invalid={state.error !== null} />
      <button type="submit" className="sr-only">
        Enter
      </button>
      <p id="login-error" role="alert" className="sr-only">
        {state.error ?? ""}
      </p>
    </form>
  );
}

/**
 * The real input is kept for typing, focus and password managers, but its
 * own text and caret are hidden. An overlay draws the dots and a blue caret
 * at the same spot, so the caret always blinks and lines up in every browser.
 */
function PasswordBox({ shake, pending, invalid }: { shake: boolean; pending: boolean; invalid: boolean }) {
  const [caret, setCaret] = useState({ len: 0, pos: 0 });

  const sync = (e: SyntheticEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    setCaret({ len: el.value.length, pos: el.selectionStart ?? el.value.length });
  };

  return (
    <div className={`relative ${shake ? "login-shake" : ""} ${pending ? "animate-pulse" : ""}`}>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        readOnly={pending}
        autoComplete="current-password"
        aria-invalid={invalid || undefined}
        aria-describedby="login-error"
        onChange={sync}
        onSelect={sync}
        onKeyUp={sync}
        onClick={sync}
        className="login-input block h-16 w-full rounded-none border-0 bg-white px-6 text-center text-2xl tracking-[0.3em] text-transparent caret-transparent shadow-[0_24px_60px_-34px_rgba(14,23,30,0.4)] outline-none selection:bg-blue/20"
      />
      <div
        aria-hidden
        className="login-overlay pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden px-6 text-2xl tracking-[0.3em] whitespace-pre text-ink"
      >
        <span>{DOT.repeat(caret.pos)}</span>
        <span className="login-caret">
          {/* re-keyed on every change so the caret stays solid while typing, then blinks */}
          <span key={`${caret.len}-${caret.pos}`} className="login-caret-bar" />
        </span>
        <span>{DOT.repeat(Math.max(0, caret.len - caret.pos))}</span>
      </div>
    </div>
  );
}
