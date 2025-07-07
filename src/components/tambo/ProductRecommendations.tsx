"use client";

import { useState, useEffect } from "react";
import { usePersona } from "@/contexts/PersonaContext";
import ProductCard from "@/components/ecommerce/ProductCard";
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

interface ProductRecommendationsProps {
  limit?: number;
  category?: string;
  title?: string;
}

export default function ProductRecommendations({ 
  limit = 6, 
  category,
  title = "Recommended for You"
}: ProductRecommendationsProps) {
  const { currentPersona } = usePersona();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = currentPersona?.uiSettings.theme || 'light';
  const fontSize = currentPersona?.uiSettings.fontSize || 'medium';

  useEffect(() => {
    fetchRecommendations();
  }, [limit, category]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (category) params.append('category', category);

      const response = await fetch(`/api/products/recommendations?${params}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');

      const data = await response.json();
      setProducts(data.recommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
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

  const handleViewProduct = async (productId: string) => {
    console.log('Viewing product:', productId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className={cn(
          "text-xl font-bold",
          fontSize === 'large' && "text-2xl",
          theme === 'dark' && "text-white"
        )}>
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(limit)].map((_, index) => (
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchRecommendations}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-4">No recommendations available at the moment.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className={cn(
        "text-xl font-bold",
        fontSize === 'large' && "text-2xl",
        theme === 'dark' && "text-white"
      )}>
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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