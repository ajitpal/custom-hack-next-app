import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LingoProvider } from "@/components/common/lingo-provider";
import AppLocaleSwitcher from "@/components/common/app-locale-switcher";
import { AutumnProvider } from "autumn-js/react";
import { PersonaProvider } from "@/contexts/PersonaContext";
import Navigation from "@/components/layout/Navigation";
import { ErrorBoundaryWrapper } from "@/components/common/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CustomStack",
  description: "This is CustomStack for your CustomHack project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LingoProvider>
      <PersonaProvider>
        <AutumnProvider>
          <html>
            <body
              className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
            >
              <ErrorBoundaryWrapper>
                <Navigation />
                <main>
                  {children}
                </main>
                <AppLocaleSwitcher />
              </ErrorBoundaryWrapper>
            </body>
          </html>
        </AutumnProvider>
      </PersonaProvider>
    </LingoProvider>
  );
}
