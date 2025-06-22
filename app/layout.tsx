import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { DevelopmentStatus } from "@/components/development-status"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SecKav - One-Click Security & Compliance for Indian APIs",
  description:
    "Your API. Your Data. Our Protection. Plug-and-play platform that protects your APIs, detects risks, and auto-reports DPDP compliance.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <DevelopmentStatus />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
