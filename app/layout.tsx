"use client";
import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";
import ThemeToggle from "../components/ThemeToggle";
import Head from "next/head";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>MarginGate - Smart Money Crypto Analysis Tool | Price Action Education</title>
        <meta name="description" content="Educational crypto analysis tool using smart money concepts and price action. Learn FVG, BOS, CHoCH patterns in volatile cryptocurrencies. Free educational platform for leverage trading analysis - not financial advice." />
        <meta name="keywords" content="smart money concepts, price action analysis, FVG analysis, BOS analysis, CHoCH analysis, leverage trading education, volatile crypto analysis, institutional trading patterns, crypto education tool, smart money trading, price action education, crypto volatility analysis" />
        <meta name="author" content="MarginGate" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://margingate.com" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="MarginGate - Free Crypto Trading Signals" />
        <meta property="og:description" content="Professional crypto trading signals and technical analysis tools - completely free for all traders. Get real-time alerts and market insights." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://margingate.com" />
        <meta property="og:site_name" content="MarginGate" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MarginGate - Free Crypto Trading Signals" />
        <meta name="twitter:description" content="Get professional crypto trading signals for free. Real-time technical analysis and market alerts." />
        
        {/* Structured Data for Search Engines */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "MarginGate",
            "description": "Educational cryptocurrency analysis tool using smart money concepts and price action for volatile crypto analysis",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Smart money analysis",
              "Price action education",
              "FVG, BOS, CHoCH patterns",
              "Volatile crypto analysis", 
              "Educational trading concepts",
              "Risk management education"
            ]
          })
        }} />
      </Head>
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 