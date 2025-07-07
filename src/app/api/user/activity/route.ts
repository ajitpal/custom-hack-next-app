import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { actionType, productId, metadata } = body;

    if (!actionType) {
      return NextResponse.json({ error: "Action type is required" }, { status: 400 });
    }

    const activityLog = await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        actionType,
        productId: productId || null,
        metadata: metadata || {},
        timestamp: new Date()
      }
    });

    return NextResponse.json({ success: true, activityLog });
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { error: "Failed to log activity" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const actionType = searchParams.get('actionType');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {
      userId: session.user.id
    };

    if (actionType) {
      where.actionType = actionType;
    }

    const activities = await prisma.activityLog.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            category: true,
            brand: true,
            price: true,
            imageUrl: true
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}