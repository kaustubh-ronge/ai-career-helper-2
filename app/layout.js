import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { HeaderServer } from "@/components/HeaderComponents/header-server";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "CivicCoach - AI Career Assistant",
  description: "Your AI-powered career companion for interviews, cover letters, and roadmaps.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={inter.className}
        >
          <HeaderServer />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster  />
        </body>
      </html>
    </ClerkProvider>
  );
}
