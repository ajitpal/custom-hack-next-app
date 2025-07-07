import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        api: "running"
      }
    };

    return NextResponse.json(health);
  } catch (error) {
    console.error("Health check failed:", error);
    
    const health = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "disconnected",
        api: "running"
      },
      error: error instanceof Error ? error.message : "Unknown error"
    };

    return NextResponse.json(health, { status: 500 });
  }
}