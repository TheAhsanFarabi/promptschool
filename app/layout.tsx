import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PromptSchool — Learn to prompt, level by level",
  description:
    "A gamified way for beginners to learn prompt engineering. Climb a skill tree of real techniques and practice each one with live AI feedback.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body bg-bg text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
