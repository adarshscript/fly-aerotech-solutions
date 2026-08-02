import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fly Aerotech Solutions",
    template: "%s | Fly Aerotech Solutions",
  },
  description:
    "Fly Aerotech Solutions — software development, web development, training and internships based in Vadodara, Gujarat.",
  applicationName: "Fly Aerotech Solutions",
  keywords: [
    "software development",
    "web development",
    "training",
    "internship",
    "Vadodara",
    "Gujarat",
    "technology consulting",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  metadataBase: new URL("https://flyaerotechsolutions.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://flyaerotechsolutions.com",
    siteName: "Fly Aerotech Solutions",
    title: "Fly Aerotech Solutions",
    description:
      "Software development, web development, training and internships based in Vadodara, Gujarat.",
  },
};

export const viewport: Viewport = {
  themeColor: "#081730",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-white text-slate-700 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
