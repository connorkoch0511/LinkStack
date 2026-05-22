import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'LinkStack — Your links, one page',
  description: 'Create a beautiful link-in-bio page in seconds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <body className="min-h-full bg-[#0a0a0f] text-slate-100">{children}</body>
      </html>
    </ClerkProvider>
  )
}
