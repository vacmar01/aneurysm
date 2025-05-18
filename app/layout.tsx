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
  title: "UIATS Score Calculator",
  description: "Calculate the UIATS score to help determine the best treatment for patients with unruptured intracranial aneurysms.",
  openGraph: {
    title: "UIATS Score Calculator",
    description: "Calculate the UIATS score to help determine the best treatment for patients with unruptured intracranial aneurysms.",
    url: "https://aneurysm.mariusvach.com", // Replace with your actual domain
    siteName: "UIATS Score Calculator",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "UIATS Score Calculator screenshot"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "UIATS Score Calculator",
    description: "Calculate the UIATS score to help determine the best treatment for patients with unruptured intracranial aneurysms.",
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
