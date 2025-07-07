import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        userProfile: true,
        userPreferences: true,
        persona: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        languagePreference: user.languagePreference,
        accessibilityNeeds: user.accessibilityNeeds,
        loyaltyTier: user.loyaltyTier,
        totalSpent: user.totalSpent,
        profile: user.userProfile,
        preferences: user.userPreferences,
        persona: user.persona
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { profile, preferences, user: userData } = body;

    // Update user basic info
    if (userData) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: userData.name,
          languagePreference: userData.languagePreference,
          accessibilityNeeds: userData.accessibilityNeeds
        }
      });
    }

    // Update user profile
    if (profile) {
      await prisma.userProfile.upsert({
        where: { userId: session.user.id },
        update: profile,
        create: {
          userId: session.user.id,
          ...profile
        }
      });
    }

    // Update user preferences
    if (preferences) {
      await prisma.userPreference.upsert({
        where: { userId: session.user.id },
        update: preferences,
        create: {
          userId: session.user.id,
          ...preferences
        }
      });
    }

    // Log profile update
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        actionType: "profile_updated",
        metadata: {
          updatedFields: Object.keys(body),
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}