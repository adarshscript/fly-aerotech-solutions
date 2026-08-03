import { cache } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransitionLoader from "@/components/ui/PageTransitionLoader";
import { getCompany } from "@/lib/content";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const getCompanyCached = cache(getCompany);

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyCached();
  const name = company?.name ?? "Fly Aerotech Solutions";
  const title = company?.seo?.title || name;
  const description =
    company?.seo?.description ||
    "Software development, web development, training and internships based in Vadodara, Gujarat.";
  const favicon = company?.favicon || "/favicon.png";

  return {
    title: {
      default: title,
      template: `%s | ${name}`,
    },
    description,
    applicationName: name,
    keywords: company?.seo?.keywords?.length
      ? company.seo.keywords
      : ["software development", "web development", "training", "internship", "Vadodara", "Gujarat"],
    icons: {
      icon: favicon,
      apple: favicon,
    },
    metadataBase: new URL(company?.website || "https://flyaerotechsolutions.com"),
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: company?.website || "https://flyaerotechsolutions.com",
      siteName: name,
      title,
      description,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#081730",
  colorScheme: "light",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const company = await getCompanyCached();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} overflow-x-clip`}>
      <body className="flex min-h-screen flex-col overflow-x-clip bg-white text-slate-700 antialiased">
        <PageTransitionLoader />
        <Navbar company={company} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
