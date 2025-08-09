"use client";
import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";
import ThemeToggle from "../components/ThemeToggle";
import Head from "next/head";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>MarginGate - Free Crypto Trading Signals & Technical Analysis</title>
        <meta name="description" content="Get professional crypto trading signals for free. Real-time FVG, BOS, CHoCH analysis, RSI tracking, and price action alerts. No cost, no limits - perfect for all traders." />
        <meta name="keywords" content="crypto trading signals, free trading signals, FVG analysis, BOS analysis, CHoCH analysis, RSI tracking, price action, cryptocurrency analysis, trading alerts, technical analysis, crypto signals free, bitcoin signals, ethereum signals, trading indicators" />
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
            "description": "Free crypto trading signals and technical analysis platform",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Free trading signals",
              "Technical analysis",
              "RSI tracking", 
              "Price action alerts",
              "Real-time data"
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