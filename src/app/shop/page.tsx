"use client";

import { useState } from "react";
import { usePersona } from "@/contexts/PersonaContext";
import SearchAndFilters from "@/components/ecommerce/SearchAndFilters";
import ProductGrid from "@/components/ecommerce/ProductGrid";
import { cn } from "@/lib/utils";

export default function ShopPage() {
  const { currentPersona } = usePersona();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);

  const theme = currentPersona?.uiSettings.theme || 'light';
  const fontSize = currentPersona?.uiSettings.fontSize || 'medium';

  return (
    <div className={cn(
      "min-h-screen",
      theme === 'dark' && "bg-gray-900",
      theme === 'high-contrast' && "bg-white"
    )}>
      {/* Header */}
      <div className={cn(
        "bg-white border-b px-4 py-6",
        theme === 'high-contrast' && "border-black border-2",
        theme === 'dark' && "bg-gray-800 border-gray-700"
      )}>
        <div className="max-w-7xl mx-auto">
          <h1 className={cn(
            "text-3xl font-bold text-gray-900",
            fontSize === 'large' && "text-4xl",
            theme === 'high-contrast' && "text-black",
            theme === 'dark' && "text-white"
          )}>
            Shop
          </h1>
          <p className={cn(
            "text-gray-600 mt-2",
            fontSize === 'large' && "text-lg",
            theme === 'dark' && "text-gray-300"
          )}>
            Discover products tailored to your preferences
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto">
        <SearchAndFilters
          onSearch={setSearchQuery}
          onCategoryFilter={setSelectedCategory}
          onPriceFilter={setPriceRange}
          selectedCategory={selectedCategory}
          priceRange={priceRange}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Recommendations Section */}
        {!searchQuery && !selectedCategory && !priceRange && (
          <div className="mb-12">
            <ProductGrid showRecommendations />
          </div>
        )}

        {/* Search Results / All Products */}
        <div className="space-y-6">
          {(searchQuery || selectedCategory || priceRange) && (
            <div className={cn(
              "border-b pb-4",
              theme === 'high-contrast' && "border-black border-2",
              theme === 'dark' && "border-gray-700"
            )}>
              <h2 className={cn(
                "text-xl font-bold text-gray-900",
                fontSize === 'large' && "text-2xl",
                theme === 'high-contrast' && "text-black",
                theme === 'dark' && "text-white"
              )}>
                {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
              </h2>
              {(selectedCategory || priceRange) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Category: {selectedCategory}
                    </span>
                  )}
                  {priceRange && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      Price: ${priceRange.min} - ${priceRange.max}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <ProductGrid
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            priceRange={priceRange}
          />
        </div>
      </div>
    </div>
  );
}