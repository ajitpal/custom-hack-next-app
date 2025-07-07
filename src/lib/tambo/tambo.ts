/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import FirecrawlForm from "@/components/firecrawl/form";
import Resend from "@/components/resend";
import ProductRecommendations from "@/components/tambo/ProductRecommendations";
import ShoppingAssistant from "@/components/tambo/ShoppingAssistant";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "search-products",
    description: "Search for products based on user query, category, or price range",
    tool: async (query: string, category?: string, maxPrice?: number) => {
      try {
        const params = new URLSearchParams();
        if (query) params.append('search', query);
        if (category) params.append('category', category);
        if (maxPrice) params.append('maxPrice', maxPrice.toString());
        params.append('limit', '8');

        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();
        
        return {
          products: data.products,
          count: data.products.length,
          message: `Found ${data.products.length} products ${query ? `for "${query}"` : ''}${category ? ` in ${category}` : ''}`
        };
      } catch (error) {
        return { error: "Failed to search products", products: [] };
      }
    },
    toolSchema: z.function()
      .args(
        z.string().describe("Search query"),
        z.string().optional().describe("Product category"),
        z.number().optional().describe("Maximum price")
      )
      .returns(z.object({
        products: z.array(z.any()),
        count: z.number(),
        message: z.string(),
        error: z.string().optional()
      }))
  },
  {
    name: "get-recommendations",
    description: "Get personalized product recommendations for the user",
    tool: async (limit: number = 6) => {
      try {
        const response = await fetch(`/api/products/recommendations?limit=${limit}`);
        const data = await response.json();
        
        return {
          recommendations: data.recommendations,
          count: data.recommendations.length,
          message: `Here are ${data.recommendations.length} personalized recommendations for you`
        };
      } catch (error) {
        return { error: "Failed to get recommendations", recommendations: [] };
      }
    },
    toolSchema: z.function()
      .args(z.number().optional().describe("Number of recommendations"))
      .returns(z.object({
        recommendations: z.array(z.any()),
        count: z.number(),
        message: z.string(),
        error: z.string().optional()
      }))
  },
  {
    name: "add-to-cart",
    description: "Add a product to the user's shopping cart",
    tool: async (productId: string, quantity: number = 1) => {
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity })
        });
        
        if (response.ok) {
          const cart = await response.json();
          return {
            success: true,
            message: `Added ${quantity} item(s) to cart`,
            cartTotal: cart.total,
            cartItemCount: cart.items.length
          };
        } else {
          return { success: false, message: "Failed to add item to cart" };
        }
      } catch (error) {
        return { success: false, message: "Error adding item to cart" };
      }
    },
    toolSchema: z.function()
      .args(
        z.string().describe("Product ID"),
        z.number().optional().describe("Quantity to add")
      )
      .returns(z.object({
        success: z.boolean(),
        message: z.string(),
        cartTotal: z.number().optional(),
        cartItemCount: z.number().optional()
      }))
  },
  {
    name: "get-user-preferences",
    description: "Get the user's shopping preferences and history",
    tool: async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          return {
            preferences: data.user.preferences,
            loyaltyTier: data.user.loyaltyTier,
            totalSpent: data.user.totalSpent,
            accessibilityNeeds: data.user.accessibilityNeeds,
            message: "Retrieved user preferences successfully"
          };
        } else {
          return { message: "Could not retrieve user preferences" };
        }
      } catch (error) {
        return { message: "Error retrieving user preferences" };
      }
    },
    toolSchema: z.function()
      .args()
      .returns(z.object({
        preferences: z.any().optional(),
        loyaltyTier: z.string().optional(),
        totalSpent: z.number().optional(),
        accessibilityNeeds: z.array(z.string()).optional(),
        message: z.string()
      }))
  }
];

/**
 * components
 *
 * This array contains all the components that are registered for use by Tambo within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "product-recommendations",
    description: "Display personalized product recommendations in a grid layout",
    component: ProductRecommendations,
    propsSchema: z.object({
      limit: z.number().optional().default(6),
      category: z.string().optional(),
      title: z.string().optional().default("Recommended for You")
    }),
  },
  {
    name: "shopping-assistant",
    description: "Interactive shopping assistant with product search and filtering",
    component: ShoppingAssistant,
    propsSchema: z.object({
      initialQuery: z.string().optional(),
      showFilters: z.boolean().optional().default(true)
    }),
  },
  {
    name: "firecrawl",
    description: "A form to enter a url and scrape a website using firecrawl and return the results",
    component: FirecrawlForm,
    propsSchema: z.object({
      defaultUrl: z.string().optional().default("")
    }),
  },
  {
    name: "resend",
    description: "A form to send an email using Resend",
    component: Resend,
    propsSchema: z.object({
      defaultName: z.string().optional(),
      defaultEmail: z.string().optional(),
    }),
  },
];