"use client";

import { useState, useEffect } from "react";
import { usePersona } from "@/contexts/PersonaContext";
import ProductCard from "@/components/ecommerce/ProductCard";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand?: string;
  imageUrl?: string;
  tags: string[];
  rating?: number;
  reviewCount: number;
  productReviews?: { rating: number }[];
}

interface ShoppingAssistantProps {
  initialQuery?: string;
  showFilters?: boolean;
}

const CATEGORIES = [
  "Electronics", "Clothing", "Books", "Home Decor", "Sports Equipment",
  "Beauty Products", "Automotive", "Travel Gear", "Kitchen & Dining", "Toys & Games"
];

export default function ShoppingAssistant({ 
  initialQuery = "",
  showFilters = true 
}: ShoppingAssistantProps) {
  const { currentPersona } = usePersona();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const theme = currentPersona?.uiSettings.theme || 'light';
  const fontSize = currentPersona?.uiSettings.fontSize || 'medium';

  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery]);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (priceRange?.min) params.append('minPrice', priceRange.min.toString());
      if (priceRange?.max) params.append('maxPrice', priceRange.max.toString());
      params.append('limit', '12');

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to search products');

      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (response.ok) {
        console.log('Added to cart successfully');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange(null);
    setSearchQuery("");
  };

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (priceRange ? 1 : 0);

  return (
    <div className={cn(
      "space-y-6",
      theme === 'dark' && "text-white"
    )}>
      {/* Search Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className={cn(
              "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary",
              fontSize === 'large' && "text-lg py-4",
              theme === 'dark' && "bg-gray-700 border-gray-600 text-white"
            )}
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSearch}
            className={cn(
              "px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90",
              fontSize === 'large' && "px-8 py-3 text-lg"
            )}
          >
            Search
          </button>

          {showFilters && (
            <button
              onClick={() => setFiltersVisible(!filtersVisible)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50",
                theme === 'dark' && "border-gray-600 hover:bg-gray-700"
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          )}

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && filtersVisible && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-2">Categories</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(
                    selectedCategory === category ? null : category
                  )}
                  className={cn(
                    "px-3 py-2 text-sm border rounded-lg transition-colors",
                    selectedCategory === category
                      ? "bg-primary text-white border-primary"
                      : "border-gray-300 hover:border-primary"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-semibold mb-2">Price Range</h4>
            <div className="flex gap-4 items-center">
              <input
                type="number"
                placeholder="Min"
                className="w-24 px-3 py-2 border border-gray-300 rounded"
                onChange={(e) => setPriceRange(prev => ({
                  min: parseInt(e.target.value) || 0,
                  max: prev?.max || 1000
                }))}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                className="w-24 px-3 py-2 border border-gray-300 rounded"
                onChange={(e) => setPriceRange(prev => ({
                  min: prev?.min || 0,
                  max: parseInt(e.target.value) || 1000
                }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div>
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white border rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (searchQuery || selectedCategory || priceRange) && (
          <div className="text-center py-8">
            <div className="text-gray-600 mb-4">No products found matching your search.</div>
            <p className="text-sm text-gray-500">Try adjusting your search terms or filters.</p>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={cn(
                "text-lg font-semibold",
                fontSize === 'large' && "text-xl"
              )}>
                Found {products.length} products
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewProduct={(id) => console.log('View product:', id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}