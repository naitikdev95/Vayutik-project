import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Vayutik - Discover the Best Software & Apps",
    template: "%s | Vayutik"
  },
  description: "Discover, rate, and install the best software, apps, SaaS products, and web tools. Your personalized marketplace for digital products.",
  keywords: ["software marketplace", "apps", "SaaS", "web tools", "product reviews", "software discovery"],
  authors: [{ name: "Vayutik" }],
  creator: "Vayutik",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Vayutik",
    title: "Vayutik - Discover the Best Software & Apps",
    description: "Discover, rate, and install the best software, apps, SaaS products, and web tools.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vayutik - Discover the Best Software & Apps",
    description: "Discover, rate, and install the best software, apps, SaaS products, and web tools.",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: 'oklch(0.12 0.01 260)',
              border: '1px solid oklch(0.25 0.01 260)',
              color: 'oklch(0.98 0 0)',
            },
          }}
        />
      </body>
    </html>
  )
}
