"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { usePersona } from "@/contexts/PersonaContext";
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

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
  priceRange?: { min: number; max: number };
  showRecommendations?: boolean;
}

export default function ProductGrid({ 
  searchQuery, 
  selectedCategory, 
  priceRange,
  showRecommendations = false 
}: ProductGridProps) {
  const { currentPersona } = usePersona();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, priceRange, showRecommendations]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let url = '/api/products';
      const params = new URLSearchParams();

      if (showRecommendations) {
        url = '/api/products/recommendations';
        params.append('limit', '12');
      } else {
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory) params.append('category', selectedCategory);
        if (priceRange?.min) params.append('minPrice', priceRange.min.toString());
        if (priceRange?.max) params.append('maxPrice', priceRange.max.toString());
        params.append('limit', '20');
      }

      const response = await fetch(`${url}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(showRecommendations ? data.recommendations : data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
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
        // Show success feedback (in a real app, you might use a toast)
        console.log('Added to cart successfully');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleViewProduct = async (productId: string) => {
    // In a real app, navigate to product detail page
    console.log('Viewing product:', productId);
  };

  const fontSize = currentPersona?.uiSettings.fontSize || 'medium';
  const theme = currentPersona?.uiSettings.theme || 'light';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
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
    );
  }

  if (error) {
    return (
      <div className={cn(
        "text-center py-12",
        theme === 'dark' && "text-white"
      )}>
        <div className={cn(
          "text-red-600 mb-4",
          fontSize === 'large' && "text-lg"
        )}>
          {error}
        </div>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={cn(
        "text-center py-12",
        theme === 'dark' && "text-white"
      )}>
        <div className={cn(
          "text-gray-600 mb-4",
          fontSize === 'large' && "text-lg",
          theme === 'dark' && "text-gray-300"
        )}>
          No products found matching your criteria.
        </div>
        <p className={cn(
          "text-sm text-gray-500",
          fontSize === 'large' && "text-base",
          theme === 'dark' && "text-gray-400"
        )}>
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showRecommendations && (
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
            Recommended for You
          </h2>
          <p className={cn(
            "text-sm text-gray-600 mt-1",
            fontSize === 'large' && "text-base",
            theme === 'dark' && "text-gray-300"
          )}>
            Based on your preferences and shopping history
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProduct}
          />
        ))}
      </div>
    </div>
  );
}