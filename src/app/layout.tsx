import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/opening.css";
import "@/styles/hero.css";
import "@/styles/about.css";
import "@/styles/ambient.css";
import "@/styles/education.css";
import "@/styles/navigation.css";
import "@/styles/skills.css";
import "@/styles/projects.css";
import "@/styles/contact.css";
import "@/styles/responsive-refinements.css";
import "@/styles/system-pages.css";
import "@/styles/hiring-refinements.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadataTitle = "Jericho Salvador | Frontend & Full-stack Web Developer";
const metadataDescription =
  "Jericho Salvador's web and mobile projects, frontend and full-stack development experience, and internship portfolio. Based in Pasig City, Philippines.";
const socialPreviewImage =
  "/opengraph-image";
const socialPreviewAlt =
  "Jericho Paul Salvador — Web Developer, Frontend and Full-stack";

function getMetadataBase() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const url = configuredUrl || (vercelHost ? `https://${vercelHost}` : "");

  if (!url) {
    return new URL("https://jcoportfolio.vercel.app");
  }

  try {
    return new URL(url);
  } catch {
    return undefined;
  }
}

const metadataBase = getMetadataBase();

export const metadata: Metadata = {
  metadataBase,
  title: metadataTitle,
  description: metadataDescription,
  applicationName: "Jericho Salvador Portfolio",
  authors: [{ name: "Jericho Salvador" }],
  creator: "Jericho Salvador",
  keywords: [
    "Jericho Salvador",
    "web developer",
    "full-stack developer",
    "developer internship",
    "frontend developer",
    "UI/UX designer",
    "Next.js portfolio",
  ],
  alternates: metadataBase ? { canonical: metadataBase } : undefined,
  openGraph: {
    description: metadataDescription,
    images: [
      {
        alt: socialPreviewAlt,
        height: 630,
        type: "image/png",
        url: socialPreviewImage,
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: "Jericho Salvador Portfolio",
    title: metadataTitle,
    type: "website",
    url: metadataBase,
  },
  twitter: {
    card: "summary_large_image",
    description: metadataDescription,
    images: [
      {
        alt: socialPreviewAlt,
        url: socialPreviewImage,
      },
    ],
    title: metadataTitle,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  initialScale: 1,
  themeColor: "#080807",
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
