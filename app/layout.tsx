import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rizmi.dev"),
  title: "Mohamed Rashard | Software Engineer & AI Architect",
  description: "Portfolio of Mohamed Rashard Rizmi, a Software Engineer and AI Architect specializing in Next.js, Python, and custom Machine Learning systems in Colombo, Sri Lanka.",
  keywords: [
    "Software Engineer Sri Lanka", 
    "AI Architect Remote", 
    "Next.js Developer", 
    "React Full Stack Engineer",
    "Machine Learning Engineer Colombo",
    "Freelance AI Architect",
    "Gemini API integration"
  ],
  authors: [{ name: "Mohamed Rashard Rizmi", url: "https://rizmi.dev" }],
  icons: {
    icon: "/mrrlogo.png",
    shortcut: "/mrrlogo.png",
    apple: "/mrrlogo.png",
  },
  openGraph: {
    title: "Mohamed Rashard | Software Engineer & AI Architect",
    description: "Architecting Intelligence through High-Performance Neural Code.",
    url: "https://rizmi.dev",
    siteName: "MRR Portfolio",
    locale: "en_US",
    type: "website",
    images: [{
      url: "/mrrlogo.png",
      width: 1200,
      height: 630,
      alt: "Mohamed Rashard Rizmi Portfolio Logo",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Rashard | AI & Full-Stack Architect",
    description: "Building production-grade AI ecosystems and high-performance web applications.",
    images: ["/mrrlogo.png"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mohamed Rashard Rizmi",
    "jobTitle": "Software Engineer & AI Architect",
    "url": "https://rizmi.dev",
    "image": "https://rizmi.dev/mrrlogo.png",
    "sameAs": [
      "https://github.com/mohrashard",
      "https://www.linkedin.com/in/mohamedrashard",
      "https://www.instagram.com/moh.rashard/",
      "https://www.tiktok.com/@moh.rashard"
    ],
    "knowsAbout": [
      "Next.js 15",
      "React",
      "Python",
      "FastAPI",
      "Machine Learning",
      "XGBoost",
      "LangChain",
      "TensorFlow",
      "Gemini API",
      "GSAP",
      "Tailwind CSS"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Colombo",
      "addressCountry": "Sri Lanka"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${syne.variable} ${dmMono.variable} antialiased bg-[#060608]`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}