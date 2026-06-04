import { prisma } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  overview: z.string().min(1).max(500),
  venue: z.string().min(1),
  location: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  mode: z.enum(["online", "offline", "hybrid"]),
  audience: z.string().min(1),
  organizer: z.string().min(1),
  agenda: z.array(z.string()).min(1),
  tags: z.array(z.string()).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("image") as File;
    if (!file)
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 },
      );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(buffer);
    });

    const imageUrl = (uploadResult as { secure_url: string }).secure_url;

    const raw = {
      ...Object.fromEntries(formData.entries()),
      agenda: JSON.parse(formData.get("agenda") as string),
      tags: JSON.parse(formData.get("tags") as string),
    };

    const parsed = eventSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const slug = parsed.data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const createdEvent = await prisma.event.create({
      data: { ...parsed.data, slug, image: imageUrl },
    });

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      { message: "Events fetched successfully", events },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "Event fetching failed",
      },
      { status: 500 },
    );
  }
}
