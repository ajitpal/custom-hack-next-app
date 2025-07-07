"use client";

import { useState, useEffect } from "react";
import { usePersona } from "@/contexts/PersonaContext";
import { ShoppingCart, Heart, Star } from "lucide-react";
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

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onViewProduct?: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart, onViewProduct }: ProductCardProps) {
  const { currentPersona } = usePersona();
  const [dynamicPrice, setDynamicPrice] = useState(product.price);
  const [discount, setDiscount] = useState(0);
  const [discountReason, setDiscountReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDynamicPricing();
  }, [product.id, currentPersona]);

  const fetchDynamicPricing = async () => {
    try {
      const response = await fetch('/api/autumn/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          basePrice: product.price
        })
      });

      if (response.ok) {
        const pricing = await response.json();
        setDynamicPrice(pricing.finalPrice);
        setDiscount(pricing.discount);
        setDiscountReason(pricing.discountReason);
      }
    } catch (error) {
      console.error('Error fetching dynamic pricing:', error);
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart?.(product.id);
      
      // Log activity
      await fetch('/api/user/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'add_to_cart',
          productId: product.id,
          metadata: { price: dynamicPrice, originalPrice: product.price }
        })
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProduct = async () => {
    await onViewProduct?.(product.id);
    
    // Log activity
    await fetch('/api/user/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionType: 'view',
        productId: product.id,
        metadata: { category: product.category, brand: product.brand }
      })
    });
  };

  const averageRating = product.productReviews?.length 
    ? product.productReviews.reduce((sum, review) => sum + review.rating, 0) / product.productReviews.length
    : product.rating || 0;

  const isAccessibilityFocused = currentPersona?.preferences.accessibilityNeeds.length > 0;
  const fontSize = currentPersona?.uiSettings.fontSize || 'medium';
  const theme = currentPersona?.uiSettings.theme || 'light';

  return (
    <div 
      className={cn(
        "group relative bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200",
        theme === 'high-contrast' && "border-black border-2",
        theme === 'dark' && "bg-gray-800 border-gray-700"
      )}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
          Save ${discount.toFixed(2)}
        </div>
      )}

      {/* Product Image */}
      <div 
        className="aspect-square bg-gray-100 relative cursor-pointer"
        onClick={handleViewProduct}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
              <span className="text-sm">No Image</span>
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors",
            isAccessibilityFocused && "p-3"
          )}
          aria-label="Add to wishlist"
        >
          <Heart className={cn("w-4 h-4", isAccessibilityFocused && "w-5 h-5")} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <div className={cn(
            "text-xs text-gray-500 mb-1",
            fontSize === 'large' && "text-sm",
            theme === 'high-contrast' && "text-black font-semibold"
          )}>
            {product.brand}
          </div>
        )}

        {/* Product Name */}
        <h3 
          className={cn(
            "font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-primary",
            fontSize === 'small' && "text-sm",
            fontSize === 'medium' && "text-base",
            fontSize === 'large' && "text-lg",
            theme === 'high-contrast' && "text-black",
            theme === 'dark' && "text-white"
          )}
          onClick={handleViewProduct}
        >
          {product.name}
        </h3>

        {/* Rating */}
        {averageRating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-3 h-3",
                    star <= averageRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                    isAccessibilityFocused && "w-4 h-4"
                  )}
                />
              ))}
            </div>
            <span className={cn(
              "text-xs text-gray-500",
              fontSize === 'large' && "text-sm"
            )}>
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn(
            "font-bold text-gray-900",
            fontSize === 'small' && "text-base",
            fontSize === 'medium' && "text-lg",
            fontSize === 'large' && "text-xl",
            theme === 'high-contrast' && "text-black",
            theme === 'dark' && "text-white"
          )}>
            ${dynamicPrice.toFixed(2)}
          </span>
          
          {product.originalPrice && product.originalPrice !== dynamicPrice && (
            <span className={cn(
              "text-sm text-gray-500 line-through",
              fontSize === 'large' && "text-base"
            )}>
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Discount Reason */}
        {discountReason && (
          <div className={cn(
            "text-xs text-green-600 mb-3",
            fontSize === 'large' && "text-sm",
            theme === 'high-contrast' && "text-green-800 font-semibold"
          )}>
            {discountReason}
          </div>
        )}

        {/* Category Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className={cn(
            "inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs",
            fontSize === 'large' && "text-sm px-3",
            theme === 'high-contrast' && "bg-gray-200 text-black border border-gray-400",
            theme === 'dark' && "bg-gray-700 text-gray-300"
          )}>
            {product.category}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50",
            fontSize === 'large' && "py-3 text-lg",
            isAccessibilityFocused && "border-2 border-black focus:outline-none focus:ring-4 focus:ring-primary/50"
          )}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className={cn("w-4 h-4", fontSize === 'large' && "w-5 h-5")} />
          {isLoading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}