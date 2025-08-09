"use client";
import React, { useState } from "react";

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
  tips?: string[];
}

const guideSteps: GuideStep[] = [
  {
    id: "alarms",
    title: "Trading Alarms",
    description: "Track price action based entry opportunities",
    icon: "🔔",
    details: [
      "Go to the Alarms tab to view active trading opportunities",
      "Check trend direction on LONG/SHORT cards",
      "Compare current price with trigger level",
      "Click 'View Detailed Analysis' button for detailed analysis",
      "Learn stop-loss levels from risk management section"
    ],
    tips: [
      "Green bordered cards show alarms close to trigger",
      "Understand market conditions by reading price action descriptions",
      "Review detail pages to learn BOS and CHoCH terms"
    ]
  },
  {
    id: "signals",
    title: "Technical Signals",
    description: "Interpret FVG, BOS and CHoCH analyses",
    icon: "📊",
    details: [
      "Check coin name and timeframe on signal cards",
      "FVG (Fair Value Gap): Track green number for gap areas",
      "BOS (Break of Structure): Follow blue number for break points",
      "CHoCH (Change of Character): Observe purple number for trend changes",
      "Analyze momentum condition with RSI value",
      "Compare different timeframes with 30m/4h options"
    ],
    tips: [
      "High FVG count indicates strong trend continuation",
      "BOS breakouts show important level tests",
      "CHoCH signals are early indicators of trend change"
    ]
  },
  {
    id: "coins",
    title: "Coin List",
    description: "Track real-time price and trend data",
    icon: "💰",
    details: [
      "Switch between Cards/List view",
      "Filter specific coins using the search box",
      "Quickly understand trend direction from mini charts",
      "Read price change percentages from colored indicators",
      "View volume information in compact format",
      "Understand momentum condition from trend indicators"
    ],
    tips: [
      "Green colors show uptrend, red colors show downtrend",
      "Mini charts show last 15 periods of data",
      "High volume values indicate strong movement potential"
    ]
  },
  {
    id: "rsi",
    title: "RSI Map",
    description: "Track momentum with visual RSI analysis",
    icon: "🎯",
    details: [
      "View RSI map by selecting 4h, 2h, 30m, 15m timeframes",
      "Understand RSI levels from coin point colors",
      "Green points are oversold (buying opportunity), red points are overbought",
      "Hover over coins to see detailed RSI information",
      "Track general market condition from bottom statistics panel",
      "Observe above 70 overbought, below 30 oversold zones"
    ],
    tips: [
      "Coins in oversold zone may offer potential buying opportunities",
      "Analyze trend strength by comparing different timeframes",
      "Coins in normal zone (30-70) show stable movement"
    ]
  },
  {
    id: "analysis",
    title: "Coin Analysis",
    description: "Individual coin examination and detailed analysis",
    icon: "🔍",
    details: [
      "Select the coin you want to analyze from the dropdown menu",
      "Perform quick coin filtering with the search box",
      "Select frequently used coins from the popular coins section",
      "View RSI values across all timeframes from the RSI Analysis card",
      "Examine 4h and 30m charts from the Price Movement card",
      "Track coin-specific opportunities from the Active Alarms card",
      "View FVG, BOS, CHoCH details from the Technical Signals card"
    ],
    tips: [
      "You can return to the main selection screen with the back arrow button",
      "Perform comprehensive analysis by evaluating different cards together",
      "Catch timing by comparing RSI levels with alarms"
    ]
  }
];

const termDefinitions = [
  { term: "FVG (Fair Value Gap)", definition: "Gap areas formed in price charts. These gaps tend to be filled in the future." },
  { term: "BOS (Break of Structure)", definition: "Breaking of important support/resistance levels. Strong signal of trend continuation." },
  { term: "CHoCH (Change of Character)", definition: "Change in trend character. Indicator of transition from uptrend to downtrend or vice versa." },
  { term: "RSI (Relative Strength Index)", definition: "Momentum oscillator between 0-100. Above 70 shows overbought, below 30 shows oversold." },
  { term: "Price Action", definition: "Pure analysis of price movements. The art of reading only price data without using indicators." },
  { term: "Support/Resistance", definition: "Support level is where price is supported from below, resistance level is where price is pressured from above." }
];

export default function UserGuide() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"guide" | "terms">("guide");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            How to Use?
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Step-by-step guide and fundamental concepts to effectively use the MarginGate platform
          </p>
        </div>
        
        {/* Section Toggle */}
        <div className="flex justify-center mt-6">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            <button
              onClick={() => setActiveSection("guide")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeSection === "guide"
                  ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              📖 User Guide
            </button>
            <button
              onClick={() => setActiveSection("terms")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeSection === "terms"
                  ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              📝 Terms Dictionary
            </button>
          </div>
        </div>
      </div>

      {activeSection === "guide" ? (
        <>
          {/* Guide Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guideSteps.map((step, index) => (
              <div
                key={step.id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{step.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    View Details
                  </span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      activeStep === step.id ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Expanded Step Details */}
          {activeStep && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-8">
              {(() => {
                const step = guideSteps.find(s => s.id === activeStep);
                if (!step) return null;
                
                return (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl">{step.icon}</div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {step.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Steps */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          📋 Step-by-Step Guide
                        </h3>
                        <div className="space-y-3">
                          {step.details.map((detail, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tips */}
                      {step.tips && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            💡 Professional Tips
                          </h3>
                          <div className="space-y-3">
                            {step.tips.map((tip, index) => (
                              <div key={index} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-lg">
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                  {tip}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </>
      ) : (
        /* Terms Dictionary */
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            📝 Terms Dictionary
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {termDefinitions.map((item, index) => (
              <div key={index} className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">
                  {item.term}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              ⚠️ Important Warning
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This platform is for analysis and information purposes only. Always do your own research and don't neglect your risk management when making investment decisions. 
              Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}