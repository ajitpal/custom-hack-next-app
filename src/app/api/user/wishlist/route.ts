import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// In-memory wishlist storage for demo (in production, add to database schema)
const wishlistStorage = new Map<string, string[]>();

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlist = wishlistStorage.get(session.user.id) || [];
    
    // Get product details for wishlist items
    const products = await prisma.product.findMany({
      where: {
        id: { in: wishlist }
      },
      include: {
        productReviews: {
          select: { rating: true },
          take: 1
        }
      }
    });

    return NextResponse.json({ wishlist: products });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    let wishlist = wishlistStorage.get(session.user.id) || [];

    if (wishlist.includes(productId)) {
      // Remove from wishlist
      wishlist = wishlist.filter(id => id !== productId);
    } else {
      // Add to wishlist
      wishlist.push(productId);
    }

    wishlistStorage.set(session.user.id, wishlist);

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        actionType: wishlist.includes(productId) ? 'wishlist_add' : 'wishlist_remove',
        productId,
        metadata: {
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      wishlist,
      inWishlist: wishlist.includes(productId)
    });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist" },
      { status: 500 }
    );
  }
}