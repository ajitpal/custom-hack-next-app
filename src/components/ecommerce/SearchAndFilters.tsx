"use client";

import { useState, useEffect } from "react";
import { usePersona } from "@/contexts/PersonaContext";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchAndFiltersProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string | null) => void;
  onPriceFilter: (range: { min: number; max: number } | null) => void;
  selectedCategory?: string | null;
  priceRange?: { min: number; max: number } | null;
}

const CATEGORIES = [
  "Electronics",
  "Clothing", 
  "Books",
  "Home Decor",
  "Sports Equipment",
  "Beauty Products",
  "Automotive",
  "Travel Gear",
  "Kitchen & Dining",
  "Toys & Games"
];

const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $250", min: 100, max: 250 },
  { label: "$250+", min: 250, max: 10000 }
];

export default function SearchAndFilters({
  onSearch,
  onCategoryFilter,
  onPriceFilter,
  selectedCategory,
  priceRange
}: SearchAndFiltersProps) {
  const { currentPersona } = usePersona();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [customPriceRange, setCustomPriceRange] = useState({ min: "", max: "" });

  const fontSize = currentPersona?.uiSettings.fontSize || 'medium';
  const theme = currentPersona?.uiSettings.theme || 'light';
  const isAccessibilityFocused = currentPersona?.preferences.accessibilityNeeds.length > 0;

  useEffect(() => {
    // Auto-suggest categories based on user preferences
    if (currentPersona?.preferences.categories.length > 0) {
      const userCategories = currentPersona.preferences.categories;
      // Could implement auto-filtering logic here
    }
  }, [currentPersona]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      onCategoryFilter(null);
    } else {
      onCategoryFilter(category);
    }
  };

  const handlePriceRangeClick = (range: { min: number; max: number }) => {
    if (priceRange?.min === range.min && priceRange?.max === range.max) {
      onPriceFilter(null);
    } else {
      onPriceFilter(range);
    }
  };

  const handleCustomPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const min = parseFloat(customPriceRange.min) || 0;
    const max = parseFloat(customPriceRange.max) || 10000;
    onPriceFilter({ min, max });
  };

  const clearAllFilters = () => {
    onCategoryFilter(null);
    onPriceFilter(null);
    setSearchQuery("");
    onSearch("");
  };

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (priceRange ? 1 : 0);

  return (
    <div className={cn(
      "bg-white border-b p-4",
      theme === 'high-contrast' && "border-black border-2",
      theme === 'dark' && "bg-gray-800 border-gray-700"
    )}>
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="relative">
          <Search className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5",
            isAccessibilityFocused && "w-6 h-6"
          )} />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              fontSize === 'large' && "py-3 text-lg",
              theme === 'high-contrast' && "border-black border-2",
              theme === 'dark' && "bg-gray-700 border-gray-600 text-white",
              isAccessibilityFocused && "focus:ring-4"
            )}
          />
        </div>
      </form>

      {/* Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
            fontSize === 'large' && "py-3 text-lg",
            theme === 'high-contrast' && "border-black border-2",
            theme === 'dark' && "border-gray-600 hover:bg-gray-700 text-white"
          )}
        >
          <Filter className={cn("w-4 h-4", fontSize === 'large' && "w-5 h-5")} />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className={cn(
              "flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800",
              fontSize === 'large' && "text-base",
              theme === 'dark' && "text-gray-300 hover:text-white"
            )}
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-4 space-y-6">
          {/* Categories */}
          <div>
            <h3 className={cn(
              "font-semibold text-gray-900 mb-3",
              fontSize === 'large' && "text-lg",
              theme === 'high-contrast' && "text-black",
              theme === 'dark' && "text-white"
            )}>
              Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category;
                const isPreferred = currentPersona?.preferences.categories.includes(category);
                
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                      "px-3 py-2 text-sm border rounded-lg transition-colors text-left",
                      fontSize === 'large' && "py-3 text-base",
                      isSelected 
                        ? "bg-primary text-white border-primary" 
                        : "border-gray-300 hover:border-primary hover:bg-primary/5",
                      isPreferred && !isSelected && "border-primary/50 bg-primary/10",
                      theme === 'high-contrast' && "border-2",
                      theme === 'dark' && !isSelected && "border-gray-600 hover:border-primary text-white"
                    )}
                  >
                    {category}
                    {isPreferred && (
                      <span className="ml-1 text-xs">★</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className={cn(
              "font-semibold text-gray-900 mb-3",
              fontSize === 'large' && "text-lg",
              theme === 'high-contrast' && "text-black",
              theme === 'dark' && "text-white"
            )}>
              Price Range
            </h3>
            
            {/* Quick Price Ranges */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
              {PRICE_RANGES.map((range, index) => {
                const isSelected = priceRange?.min === range.min && priceRange?.max === range.max;
                
                return (
                  <button
                    key={index}
                    onClick={() => handlePriceRangeClick(range)}
                    className={cn(
                      "px-3 py-2 text-sm border rounded-lg transition-colors",
                      fontSize === 'large' && "py-3 text-base",
                      isSelected 
                        ? "bg-primary text-white border-primary" 
                        : "border-gray-300 hover:border-primary hover:bg-primary/5",
                      theme === 'high-contrast' && "border-2",
                      theme === 'dark' && !isSelected && "border-gray-600 hover:border-primary text-white"
                    )}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Price Range */}
            <form onSubmit={handleCustomPriceSubmit} className="flex gap-2 items-end">
              <div className="flex-1">
                <label className={cn(
                  "block text-xs text-gray-600 mb-1",
                  fontSize === 'large' && "text-sm",
                  theme === 'dark' && "text-gray-300"
                )}>
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={customPriceRange.min}
                  onChange={(e) => setCustomPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary",
                    fontSize === 'large' && "py-3",
                    theme === 'high-contrast' && "border-black border-2",
                    theme === 'dark' && "bg-gray-700 border-gray-600 text-white"
                  )}
                />
              </div>
              <div className="flex-1">
                <label className={cn(
                  "block text-xs text-gray-600 mb-1",
                  fontSize === 'large' && "text-sm",
                  theme === 'dark' && "text-gray-300"
                )}>
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  value={customPriceRange.max}
                  onChange={(e) => setCustomPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className={cn(
                    "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary",
                    fontSize === 'large' && "py-3",
                    theme === 'high-contrast' && "border-black border-2",
                    theme === 'dark' && "bg-gray-700 border-gray-600 text-white"
                  )}
                />
              </div>
              <button
                type="submit"
                className={cn(
                  "px-4 py-2 bg-primary text-white rounded hover:bg-primary/90",
                  fontSize === 'large' && "py-3 px-6"
                )}
              >
                Apply
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}