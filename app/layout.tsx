import type { Metadata } from "next"
import { Roboto, Roboto_Condensed } from "next/font/google"
import "./globals.css"

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

const robotoCondensed = Roboto_Condensed({
  weight: ["300"],
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  display: "swap",
})

export const metadata: Metadata = {
  title: "menufaktur — Kochschule Frankfurt-Bornheim",
  description:
    "Seit 2007 begeistert menufaktur in Frankfurt-Bornheim Menschen fürs gemeinsame Kochen. Kurse buchen und Gutscheine kaufen.",
  // Icons come from the file-based convention: app/favicon.ico, app/icon.png
  // and app/apple-icon.png. Do not add an `icons` array here — declaring both
  // makes Next emit conflicting <link> tags.
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body
        className={`${roboto.variable} ${robotoCondensed.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
