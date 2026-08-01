import type { Metadata, Viewport } from "next";
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

const metadataTitle = "Jericho Salvador | Creative Developer";
const metadataDescription =
  "A cinematic creative developer portfolio built with Next.js, Motion, and Three.js.";
const socialPreviewImage =
  "/assets/social/jericho-salvador-social-preview.jpg";
const socialPreviewAlt =
  "JPSalvador constellation signature above Jericho Paul Salvador, Creative Developer";

function getMetadataBase() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const url = configuredUrl || (vercelHost ? `https://${vercelHost}` : "");

  if (!url) {
    return undefined;
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
    "creative developer",
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
        type: "image/jpeg",
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
        {children}
      </body>
    </html>
  );
}
