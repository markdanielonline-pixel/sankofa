import "./globals.css"
import "./site.css"
import { Fraunces, Inter } from "next/font/google"
import Header from "./components/Header"
import ConditionalFooter from "./components/ConditionalFooter"

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" })
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" })

const DESC =
  "An independent publishing house for authors of Black, African and diasporic stories. No publishing fee for accepted books. You keep your copyright. Free submissions, answered within seven days."

export const metadata = {
  title: {
    default: "Sankofa Publishers | Independent Publishing With No Publishing Fee",
    template: "%s | Sankofa Publishers",
  },
  description: DESC,
  metadataBase: new URL("https://sankofapublishers.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Sankofa Publishers",
    description: DESC,
    url: "https://sankofapublishers.com",
    siteName: "Sankofa Publishers",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sankofa Publishers",
    description: DESC,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Header />
        <main style={{ paddingTop: "72px" }}>{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  )
}
