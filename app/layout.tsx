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
  icons: [
    {
      rel: "icon",
      url: "/brand/menufaktur-icon-cream-on-burgundy.svg",
      type: "image/svg+xml",
    },
    { rel: "icon", url: "/favicon.ico", sizes: "32x32" },
  ],
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
