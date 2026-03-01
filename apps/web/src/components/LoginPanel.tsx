"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { GoogleIcon } from "./GoogleIcon";
import { ThemeToggle } from "./ThemeToggle";

export function LoginPanel() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section className="flex flex-col justify-center">
      <ThemeToggle className="absolute top-4 right-4" />
      <div className="flex flex-col justify-center max-w-md mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white text-left">Hi, Welcome to Recall!</h1>
        <p className="text-md text-neutral-500 dark:text-neutral-300 mt-1 text-left">Track your job applications with clarity and focus in what matters most.</p>
        <a
          href="/auth/login?connection=google-oauth2&prompt=login"
          onClick={() => setIsLoading(true)}
          aria-disabled={isLoading}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors"
        >
          {!isLoading && <><GoogleIcon className="w-4 h-4" /> Login with Google</>}
          {isLoading && <LoaderCircle className="w-4 h-4 animate-spin" />}
        </a>
      </div>
    </section>
  );
}
