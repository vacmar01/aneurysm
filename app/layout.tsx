import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Aneurysm Risk Calculator",
  description: "Calculate overall aneurysm risk (treatment and conservative rupture risk) with UIATS and PHASES scores.",
  openGraph: {
    title: "Aneurysm Risk Calculator",
    description: "Calculate overall aneurysm risk (treatment and conservative rupture risk) with UIATS and PHASES scores.",
    url: "https://aneurysm.mariusvach.com", // Replace with your actual domain
    siteName: "Aneurysm Risk Calculator",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Aneurysm Risk Calculator screenshot"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Aneurysm Risk Calculator",
    description: "Calculate overall aneurysm risk (treatment and conservative rupture risk) with UIATS and PHASES scores.",
    images: ["/og.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
