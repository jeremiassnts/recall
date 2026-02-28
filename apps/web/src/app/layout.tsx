import type { Metadata } from "next";
import { QueryProvider } from "@/components/QueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recall — Track your job applications",
  description: "Track your job applications with clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
