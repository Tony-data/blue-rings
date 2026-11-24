"use client";

import { useActionState, useState, type SyntheticEvent } from "react";
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
 * own text and caret are hidden. An overlay draws one small blue ring per
 * character (echoing the ring field) and a blinking blue caret between them.
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
        className="login-input block h-16 w-full rounded-none border-0 bg-paper px-6 text-center text-2xl tracking-[0.3em] text-transparent caret-transparent outline-none selection:bg-blue/20"
      />
      <div
        aria-hidden
        className="login-overlay pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden px-6 text-2xl"
        // rings shrink when a long password would no longer fit (272px is the box's inner width)
        style={{ "--ring-unit": `${Math.min(18, 272 / Math.max(1, caret.len))}px` } as React.CSSProperties}
      >
        {Array.from({ length: caret.len + 1 }, (_, i) =>
          i === caret.pos ? (
            <span key="caret" className="login-caret">
              {/* re-keyed on every change so the caret stays solid while typing, then blinks */}
              <span key={`${caret.len}-${caret.pos}`} className="login-caret-bar" />
            </span>
          ) : (
            // one ring per typed character; keys stay stable so only new rings "pop" in
            <span key={`r${i < caret.pos ? i : i - 1}`} className="login-ring" />
          ),
        )}
      </div>
    </div>
  );
}
