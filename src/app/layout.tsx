import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://palmpolish.com"),
  title: "Palm Polish — Florida's Mobile Detailing Marketplace",
  description:
    "Sunshine-state shine. Book a mobile detailer, earn from your driveway, or list your bay — Palm Polish connects owners, detailers and hosts across Florida.",
  openGraph: {
    title: "Palm Polish — Florida's Mobile Detailing Marketplace",
    description:
      "Sunshine-state shine. Book a mobile detailer, earn from your driveway, or list your bay.",
    url: "https://palmpolish.com",
    siteName: "Palm Polish",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}<Script src="https://cyberadspace.com/chat/widget.js" data-brand="palm-polish" strategy="afterInteractive" /></body>
    </html>
  );
}
