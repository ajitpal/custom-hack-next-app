import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      interests,
      accessibilityNeeds,
      languagePreference,
      priceRange,
      shoppingFrequency,
      preferredCategories
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Update user profile
    await prisma.userProfile.update({
      where: { userId },
      data: {
        interests,
        onboardingCompleted: true,
      }
    });

    // Update user preferences
    await prisma.userPreference.update({
      where: { userId },
      data: {
        categoryInterests: preferredCategories,
        priceRangeMin: priceRange.min,
        priceRangeMax: priceRange.max,
        shoppingHabits: {
          frequency: shoppingFrequency,
          interests
        }
      }
    });

    // Update user language and accessibility settings
    await prisma.user.update({
      where: { id: userId },
      data: {
        languagePreference,
        accessibilityNeeds
      }
    });

    // Log onboarding completion
    await prisma.activityLog.create({
      data: {
        userId,
        actionType: "onboarding_completed",
        metadata: {
          interests,
          accessibilityNeeds,
          languagePreference,
          preferredCategories,
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}