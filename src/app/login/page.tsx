import type { Metadata } from "next";
import { RingField } from "@/components/ring-field";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Blue Rings · Private",
};

/** Private-site gate: the interactive ring field and a single password box. */
export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-paper px-5">
      <RingField className="absolute inset-0 h-full w-full" />
      <div className="relative w-full max-w-xs">
        <LoginForm />
      </div>
    </main>
  );
}
