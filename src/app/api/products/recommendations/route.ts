import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    let recommendations = [];

    if (session?.user?.id) {
      // Get personalized recommendations for logged-in users
      recommendations = await getPersonalizedRecommendations(session.user.id, limit);
    } else {
      // Get trending products for anonymous users
      recommendations = await getTrendingProducts(limit);
    }

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

async function getPersonalizedRecommendations(userId: string, limit: number) {
  try {
    // Get user preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userPreferences: true,
        activityLogs: {
          where: { actionType: 'view' },
          take: 50,
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!user || !user.userPreferences.length) {
      return getTrendingProducts(limit);
    }

    const preferences = user.userPreferences[0];
    const viewedCategories = user.activityLogs
      .map(log => log.metadata?.category)
      .filter(Boolean);

    // Build recommendation query
    const where: any = {
      isActive: true,
      OR: []
    };

    // Add category-based recommendations
    if (preferences.categoryInterests.length > 0) {
      where.OR.push({
        category: { in: preferences.categoryInterests }
      });
    }

    // Add price range filter
    if (preferences.priceRangeMin || preferences.priceRangeMax) {
      const priceFilter: any = {};
      if (preferences.priceRangeMin) priceFilter.gte = preferences.priceRangeMin;
      if (preferences.priceRangeMax) priceFilter.lte = preferences.priceRangeMax;
      where.price = priceFilter;
    }

    // Add brand preferences
    if (preferences.brandPreferences.length > 0) {
      where.OR.push({
        brand: { in: preferences.brandPreferences }
      });
    }

    // Add viewed categories
    if (viewedCategories.length > 0) {
      where.OR.push({
        category: { in: viewedCategories }
      });
    }

    // If no OR conditions, fall back to trending
    if (where.OR.length === 0) {
      delete where.OR;
      where.trending = true;
    }

    const recommendations = await prisma.product.findMany({
      where,
      include: {
        productReviews: {
          select: { rating: true },
          take: 1
        }
      },
      orderBy: [
        { trending: 'desc' },
        { trendingScore: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });

    // Log recommendation request
    await prisma.activityLog.create({
      data: {
        userId,
        actionType: 'recommendations_viewed',
        metadata: {
          count: recommendations.length,
          timestamp: new Date().toISOString()
        }
      }
    });

    return recommendations;
  } catch (error) {
    console.error("Error getting personalized recommendations:", error);
    return getTrendingProducts(limit);
  }
}

async function getTrendingProducts(limit: number) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      trending: true
    },
    include: {
      productReviews: {
        select: { rating: true },
        take: 1
      }
    },
    orderBy: { trendingScore: 'desc' },
    take: limit
  });
}