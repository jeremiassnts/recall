"use client";

import { GoogleIcon } from "./GoogleIcon";

export function LoginPanel() {

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 bg-neutral-50 dark:bg-gray-900 p-10 rounded-md border-[1px] border-neutral-100 dark:border-gray-800">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Hi, Welcome to Recall!
        </h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-300">
          Track your job applications with clarity. Let's get started!
        </p>
        <a
          href="/auth/login?returnTo=/dashboard&connection=google-oauth2&prompt=login"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors"
        >
          <GoogleIcon className="w-4 h-4" /> Login with Google
        </a>
      </div>
    </div>
  );
}
