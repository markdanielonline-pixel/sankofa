import "./globals.css"
import Header from "./components/Header"
import Footer from "./components/Footer"

export const metadata = {
  title: "Sankofa Publishers",
  description: "Legacy Restored. Narrative Rewritten."
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

        {children}

        <Footer />

      </body>
    </html>
  )
}