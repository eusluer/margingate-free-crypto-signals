"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-800">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[length:20px_20px] opacity-60" />
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div 
            className="transform transition-all duration-1000 ease-out"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Currently Active</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                MarginGate
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-700 dark:text-slate-300">
                Free Crypto Trading Signals & Technical Analysis Platform
              </h2>
              
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                Free algorithmic crypto trading signals for all traders
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full backdrop-blur-sm">
                  <span className="text-2xl">⚡</span>
                  <span className="text-sm font-medium">Instant Signals</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full backdrop-blur-sm">
                  <span className="text-2xl">📊</span>
                  <span className="text-sm font-medium">Price Action Analysis</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full backdrop-blur-sm">
                  <span className="text-2xl">🔔</span>
                  <span className="text-sm font-medium">Smart Alerts</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-10">
                <button
                  onClick={() => router.push("/login")}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg mr-4"
                >
                  <span className="relative z-10">Get Free Access</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                
                <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="text-green-500">✓</span>
                  <span>Completely free platform</span>
                  <span className="mx-2">•</span>
                  <span className="text-green-500">✓</span>
                  <span>No hidden fees</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Features Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                Professional Crypto Analysis Tools - Completely Free
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
Professional-grade analysis tools available to everyone for free
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">🔔</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Free Crypto Trading Alerts & Price Action Signals</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Get free crypto trading signals with LONG/SHORT entry points. Our advanced price action analysis identifies profitable trading opportunities in Bitcoin, Ethereum, and top altcoins automatically.</p>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">• BOS/CHoCH analysis • Trigger levels • Risk management</div>
              </div>
              
              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">FVG, BOS & CHoCH Technical Analysis</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Access professional Fair Value Gap (FVG), Break of Structure (BOS), and Change of Character (CHoCH) analysis completely free. Get technical signals across 30m and 4h timeframes for better trading decisions.</p>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">• Fair Value Gap • Structure breaks • Character changes</div>
              </div>
              
              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Real-time RSI Momentum Tracking</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Monitor cryptocurrency momentum with our free RSI indicator maps. Identify overbought and oversold conditions across multiple timeframes to time your crypto trades perfectly.</p>
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">• Momentum tracking • Overbought/oversold • Multiple timeframes</div>
              </div>
              
              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Detailed Cryptocurrency Market Analysis</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Get detailed cryptocurrency analysis for Bitcoin, Ethereum, and popular altcoins. Real-time price tracking, trend analysis, volume data, and interactive charts - all completely free.</p>
                <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">• Detailed coin analysis • Mini charts • Trend indicators</div>
              </div>
              
              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Live Market Data & Real-time Updates</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Catch market changes instantly with millisecond-fast data transfer. 60-second automatic updates.</p>
                <div className="text-sm text-red-600 dark:text-red-400 font-medium">• Real-time data • Auto updates • Low latency</div>
              </div>
              
              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">User Guide</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Learn to use the platform with maximum efficiency through step-by-step guides and glossary of terms.</p>
                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">• Detailed guides • Terms glossary • Pro tips</div>
              </div>
            </div>
          </div>
        </section>

        {/* Free Access CTA Section */}
        <section className="relative py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Join Thousands of Traders Using Free Crypto Signals
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join thousands of traders using our completely free crypto trading signals platform.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto mb-8">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-white mb-2">100%</div>
                <div className="text-blue-100 text-lg">FREE FOREVER</div>
              </div>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-green-400">✓</span>
                  <span>Unlimited trading signals</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-green-400">✓</span>
                  <span>Professional FVG, BOS, CHoCH analysis</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-green-400">✓</span>
                  <span>Real-time RSI momentum tracking</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-green-400">✓</span>
                  <span>Detailed cryptocurrency analysis</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-green-400">✓</span>
                  <span>Live market data feeds</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-green-400">✓</span>
                  <span>Mobile-friendly dashboard</span>
                </div>
              </div>
              
              <button
                onClick={() => router.push("/login")}
                className="w-full px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg mb-4"
              >
                Get Free Access Now
              </button>
              
              <div className="text-blue-100 text-sm">
                No credit card required - Always free
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-blue-100 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-400">🔒</span>
                <span>Secure registration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">⚡</span>
                <span>Instant access</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">💯</span>
                <span>Always free</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="relative py-20 px-4 bg-slate-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Everything you need to know about our free crypto trading signals platform
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  Is MarginGate really completely free?
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Yes! MarginGate is 100% free forever. We provide professional crypto trading signals, technical analysis tools, RSI tracking, and price action alerts at no cost. No hidden fees, no premium subscriptions - just free access to professional trading tools.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  What are FVG, BOS, and CHoCH in crypto trading?
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  FVG (Fair Value Gap) identifies price gaps in charts that often get filled. BOS (Break of Structure) shows when important support/resistance levels are broken, indicating trend continuation. CHoCH (Change of Character) signals potential trend reversals. Our platform analyzes these automatically for Bitcoin, Ethereum, and major altcoins.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  How accurate are your free crypto trading signals?
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Our signals use advanced price action analysis and technical indicators. While no trading signal is 100% accurate, our algorithms analyze market structure, momentum, and key levels to provide high-quality alerts. Remember to always do your own research and manage risk properly.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  Which cryptocurrencies do you cover?
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We provide signals and analysis for major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), and top altcoins. Our platform covers the most liquid and actively traded pairs to ensure you get reliable signals for profitable trading opportunities.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  Do I need to register to use MarginGate?
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Yes, free registration is required to access your dashboard and trading signals. This helps us provide personalized alerts and maintain the platform. Registration is quick, secure, and doesn't require any payment information.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  How often are trading signals updated?
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Our platform provides real-time analysis with signals updated every 60 seconds. Market conditions change rapidly in crypto, so we ensure you get the latest technical analysis, RSI levels, and price action alerts as soon as they develop.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <footer className="relative py-8 px-4 bg-slate-900 dark:bg-black">
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} MarginGate. All rights reserved. | Free Crypto Trading Signals | Technical Analysis Tools
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 