import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { productId, basePrice, userId } = await request.json();

    if (!productId || !basePrice) {
      return NextResponse.json(
        { error: "Product ID and base price are required" },
        { status: 400 }
      );
    }

    // Mock dynamic pricing logic (in production, integrate with Autumn API)
    let finalPrice = basePrice;
    let discountReason = null;
    let loyaltyDiscount = 0;
    let accessibilityDiscount = 0;

    if (session?.user) {
      // Loyalty tier discounts
      const loyaltyTier = (session.user as any).loyaltyTier || 'bronze';
      switch (loyaltyTier) {
        case 'gold':
          loyaltyDiscount = 0.15;
          break;
        case 'silver':
          loyaltyDiscount = 0.10;
          break;
        case 'bronze':
          loyaltyDiscount = 0.05;
          break;
      }

      // Accessibility discounts
      const accessibilityNeeds = (session.user as any).accessibilityNeeds || [];
      if (accessibilityNeeds.length > 0) {
        accessibilityDiscount = 0.10;
        discountReason = 'Accessibility support discount';
      }

      // Time-based discounts (mock)
      const hour = new Date().getHours();
      let timeDiscount = 0;
      if (hour >= 2 && hour <= 6) {
        timeDiscount = 0.05;
        discountReason = 'Night owl discount';
      }

      // Apply highest discount
      const totalDiscount = Math.max(loyaltyDiscount, accessibilityDiscount, timeDiscount);
      finalPrice = basePrice * (1 - totalDiscount);
      
      if (totalDiscount > 0 && !discountReason) {
        discountReason = `${loyaltyTier.charAt(0).toUpperCase() + loyaltyTier.slice(1)} member discount`;
      }
    }

    // Regional pricing (mock)
    const region = 'US'; // In production, detect from IP or user settings
    const regionMultiplier = region === 'US' ? 1 : 0.85; // Example: 15% discount for non-US
    finalPrice *= regionMultiplier;

    const response = {
      productId,
      originalPrice: basePrice,
      finalPrice: Math.round(finalPrice * 100) / 100,
      discount: Math.round((basePrice - finalPrice) * 100) / 100,
      discountPercentage: Math.round(((basePrice - finalPrice) / basePrice) * 100),
      discountReason,
      currency: 'USD',
      region,
      priceBreakdown: {
        basePrice,
        loyaltyDiscount: loyaltyDiscount * basePrice,
        accessibilityDiscount: accessibilityDiscount * basePrice,
        regionAdjustment: (regionMultiplier - 1) * basePrice
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error calculating dynamic pricing:", error);
    return NextResponse.json(
      { error: "Failed to calculate pricing" },
      { status: 500 }
    );
  }
}