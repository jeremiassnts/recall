import { QueryProvider } from "@/components/QueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Montserrat } from 'next/font/google';
import "./globals.css";

const font = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={font.className}>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
