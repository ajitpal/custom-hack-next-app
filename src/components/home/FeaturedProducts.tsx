"use client";

import { usePersona } from "@/contexts/PersonaContext";
import ProductGrid from "@/components/ecommerce/ProductGrid";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const { currentPersona } = usePersona();
  
  const theme = currentPersona?.uiSettings.theme || 'light';
  const fontSize = currentPersona?.uiSettings.fontSize || 'medium';

  return (
    <section className={cn(
      "py-16 px-4",
      theme === 'dark' && "bg-gray-800",
      theme === 'high-contrast' && "bg-gray-50"
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className={cn(
              "font-bold text-gray-900 mb-4",
              fontSize === 'small' && "text-2xl",
              fontSize === 'medium' && "text-3xl", 
              fontSize === 'large' && "text-4xl",
              theme === 'high-contrast' && "text-black",
              theme === 'dark' && "text-white"
            )}>
              Recommended Just for You
            </h2>
            <p className={cn(
              "text-gray-600 max-w-2xl",
              fontSize === 'small' && "text-base",
              fontSize === 'medium' && "text-lg",
              fontSize === 'large' && "text-xl",
              theme === 'dark' && "text-gray-300"
            )}>
              Discover products that match your interests, budget, and preferences. 
              Our AI learns from your behavior to show you exactly what you're looking for.
            </p>
          </div>

          <Link
            href="/shop"
            className={cn(
              "hidden sm:inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors",
              fontSize === 'large' && "px-8 py-4 text-lg",
              theme === 'high-contrast' && "border-black border-2 text-black",
              theme === 'dark' && "border-gray-600 text-gray-300 hover:bg-gray-700"
            )}
          >
            View All
            <ArrowRight className={cn("w-4 h-4", fontSize === 'large' && "w-5 h-5")} />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <ProductGrid showRecommendations />
        </div>

        {/* Mobile View All Button */}
        <div className="sm:hidden text-center">
          <Link
            href="/shop"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors",
              fontSize === 'large' && "px-8 py-4 text-lg"
            )}
          >
            View All Products
            <ArrowRight className={cn("w-4 h-4", fontSize === 'large' && "w-5 h-5")} />
          </Link>
        </div>
      </div>
    </section>
  );
}