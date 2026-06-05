import { prisma } from "@/db";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  req: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const { slug } = await params;

    if (!slug || slug.trim() === "") {
      return NextResponse.json(
        { message: "Invalid or missing slug" },
        { status: 400 },
      );
    }

    const sanitizedSlug = slug.trim().toLowerCase();

    const event = await prisma.event.findUnique({
      where: { slug: sanitizedSlug },
    });

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${sanitizedSlug}' not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 },
    );
  } catch (e) {
    console.error("Error fetching event by slug:", e);
    return NextResponse.json(
      { message: "Failed to fetch event" },
      { status: 500 },
    );
  }
}
