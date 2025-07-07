import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const trendingProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        trending: true
      },
      include: {
        productReviews: {
          select: {
            rating: true,
            content: true,
            author: true,
            createdAt: true
          },
          take: 3,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { trendingScore: 'desc' },
      take: limit
    });

    return NextResponse.json({
      products: trendingProducts,
      count: trendingProducts.length
    });
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending products" },
      { status: 500 }
    );
  }
}