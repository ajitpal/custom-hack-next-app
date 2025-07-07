"use client";

import { usePersona } from "@/contexts/PersonaContext";
import { AuroraText } from "@/components/magicui/aurora-text";
import { ArrowRight, Sparkles, Zap, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Hero() {
  const { currentPersona } = usePersona();
  
  const theme = currentPersona?.uiSettings.theme || 'light';
  const fontSize = currentPersona?.uiSettings.fontSize || 'medium';
  const isAccessibilityFocused = currentPersona?.preferences.accessibilityNeeds.length > 0;

  return (
    <section className={cn(
      "relative overflow-hidden py-20 px-4",
      theme === 'dark' && "bg-gray-900",
      theme === 'high-contrast' && "bg-white"
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className={cn(
          "font-bold mb-6",
          fontSize === 'small' && "text-4xl",
          fontSize === 'medium' && "text-5xl",
          fontSize === 'large' && "text-6xl",
          theme === 'high-contrast' && "text-black",
          theme === 'dark' && "text-white"
        )}>
          Welcome to{" "}
          <AuroraText colors={["#6600ff", "#69e300", "#80ffce"]}>
            ShopAI
          </AuroraText>
        </h1>

        {/* Subtitle */}
        <p className={cn(
          "text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed",
          fontSize === 'small' && "text-lg",
          fontSize === 'medium' && "text-xl",
          fontSize === 'large' && "text-2xl",
          theme === 'dark' && "text-gray-300"
        )}>
          Your personalized AI shopping assistant that adapts to your needs, preferences, and accessibility requirements. 
          Discover products tailored just for you with intelligent recommendations and dynamic pricing.
        </p>

        {/* Feature Highlights */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {[
            { icon: Sparkles, text: "AI-Powered Recommendations" },
            { icon: Zap, text: "Dynamic Pricing" },
            { icon: Globe, text: "Multi-language Support" }
          ].map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border",
                fontSize === 'large' && "px-6 py-3",
                theme === 'high-contrast' && "border-black border-2 bg-gray-100",
                theme === 'dark' && "bg-gray-800/50 border-gray-700"
              )}
            >
              <feature.icon className={cn(
                "w-4 h-4 text-primary",
                fontSize === 'large' && "w-5 h-5"
              )} />
              <span className={cn(
                "text-sm font-medium",
                fontSize === 'large' && "text-base",
                theme === 'high-contrast' && "text-black",
                theme === 'dark' && "text-white"
              )}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className={cn(
              "inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold",
              fontSize === 'large' && "px-10 py-5 text-lg",
              isAccessibilityFocused && "focus:outline-none focus:ring-4 focus:ring-primary/50"
            )}
          >
            Start Shopping
            <ArrowRight className={cn("w-4 h-4", fontSize === 'large' && "w-5 h-5")} />
          </Link>

          <Link
            href="/tambo"
            className={cn(
              "inline-flex items-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold",
              fontSize === 'large' && "px-10 py-5 text-lg",
              theme === 'high-contrast' && "border-black border-2 text-black",
              theme === 'dark' && "border-gray-600 text-gray-300 hover:bg-gray-700",
              isAccessibilityFocused && "focus:outline-none focus:ring-4 focus:ring-primary/50"
            )}
          >
            Try AI Assistant
          </Link>
        </div>

        {/* Persona Indicator */}
        {currentPersona && (
          <div className={cn(
            "mt-8 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm",
            fontSize === 'large' && "text-base px-6 py-3"
          )}>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Personalized for: {currentPersona.name}
          </div>
        )}
      </div>
    </section>
  );
}