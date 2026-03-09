import "./globals.css"
import Header from "./components/Header"
import ConditionalFooter from "./components/ConditionalFooter"

export const metadata = {
  title: "Sankofa Publishers",
  description: "Legacies Restored. Narratives Rewritten.",
  metadataBase: new URL("https://sankofapublishers.com"),
  icons: {
    icon: [
      { url: "/favicon.ico",          sizes: "any" },
      { url: "/favicon.png",          type: "image/png", sizes: "32x32" },
      { url: "/favicon-192.png",      type: "image/png", sizes: "192x192" },
      { url: "/favicon-512.png",      type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Sankofa Publishers",
    description: "Legacies Restored. Narratives Rewritten.",
    url: "https://sankofapublishers.com",
    siteName: "Sankofa Publishers",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sankofa Publishers",
    description: "Legacies Restored. Narratives Rewritten.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ paddingTop: "72px" }}>
          {children}
        </main>
        <ConditionalFooter />
      </body>
    </html>
  )
}
