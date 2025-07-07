import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// In-memory cart storage for demo (in production, use Redis or database)
const cartStorage = new Map<string, any>();

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = cartStorage.get(session.user.id) || { items: [], total: 0 };
    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
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

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Get current cart
    let cart = cartStorage.get(session.user.id) || { items: [], total: 0 };

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex((item: any) => item.productId === productId);

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }

    // Recalculate total (in a real app, fetch product prices)
    cart.total = cart.items.reduce((sum: number, item: any) => sum + (item.quantity * 50), 0); // Mock price

    // Save cart
    cartStorage.set(session.user.id, cart);

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    let cart = cartStorage.get(session.user.id) || { items: [], total: 0 };

    // Remove item
    cart.items = cart.items.filter((item: any) => item.productId !== productId);

    // Recalculate total
    cart.total = cart.items.reduce((sum: number, item: any) => sum + (item.quantity * 50), 0);

    cartStorage.set(session.user.id, cart);

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}