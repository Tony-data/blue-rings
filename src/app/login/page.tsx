import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Blue Rings · Private",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      <Image
        src="/brand/background.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-paper/55" aria-hidden />

      <div className="relative w-full max-w-sm rounded-2xl border border-line bg-surface/95 p-8 shadow-[0_24px_60px_-30px_rgba(14,23,30,0.45)] backdrop-blur-sm">
        <Image src="/brand/mark.png" alt="" width={56} height={48} className="h-12 w-auto" />
        <h1 className="display mt-6 text-4xl leading-none text-blue">Blue Rings</h1>
        <p className="mt-1 text-sm text-slate">This site is private. Enter the password to continue.</p>
        <LoginForm />
      </div>
    </main>
  );
}
