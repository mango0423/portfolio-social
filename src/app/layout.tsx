import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio | Creative Developer",
  description: "A personal portfolio showcasing creative development work with modern design",
  keywords: ["portfolio", "developer", "creative", "web development"],
  authors: [{ name: "Developer" }],
  openGraph: {
    title: "Portfolio | Creative Developer",
    description: "A personal portfolio showcasing creative development work",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased bg-[var(--color-background)] text-[var(--color-text-primary)]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
