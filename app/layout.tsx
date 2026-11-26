import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { ClientScripts } from "./components/ClientScripts";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const FAVICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%2308080a'/><text x='16' y='22' text-anchor='middle' font-family='-apple-system,Segoe UI,sans-serif' font-size='18' font-weight='600' fill='%23f4f4f5' letter-spacing='-1'>K</text></svg>";

const TITLE = "Kalp Joshi";
const DESCRIPTION =
  "Kalp Joshi builds websites and apps and studies computer science at the University of Manitoba in Winnipeg.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kalpkj.github.io"),
  title: TITLE,
  description: DESCRIPTION,
  icons: { icon: FAVICON },
  openGraph: {
    type: "website",
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Kalp Joshi" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Scroll reveals only hide content once we know JS is running. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="scroll-prog" id="prog" aria-hidden="true" />
        <Header />
        {children}
        <ClientScripts />
      </body>
    </html>
  );
}
