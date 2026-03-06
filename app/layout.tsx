import "./globals.css"
import Header from "./components/Header"
import Footer from "./components/Footer"

export const metadata = {
  title: "Sankofa Publishers",
  description: "Legacies Restored. Narratives Rewritten.",
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
  metadataBase: new URL("https://sankofapublishers.com"),
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
        <Footer />
      </body>
    </html>
  )
}
