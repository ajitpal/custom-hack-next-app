import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const trending = searchParams.get('trending');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {
      isActive: true
    };

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (trending === 'true') {
      where.trending = true;
    }

    const products = await prisma.product.findMany({
      where,
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
      orderBy: trending === 'true' 
        ? { trendingScore: 'desc' }
        : { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json({
      products,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        originalPrice: body.originalPrice,
        category: body.category,
        subcategory: body.subcategory,
        brand: body.brand,
        imageUrl: body.imageUrl,
        imageUrls: body.imageUrls || [],
        tags: body.tags || [],
        features: body.features || [],
        specifications: body.specifications || {},
        stockQuantity: body.stockQuantity || 0,
        trending: body.trending || false,
        trendingScore: body.trendingScore || 0
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}