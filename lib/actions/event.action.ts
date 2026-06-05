"use server";

import { prisma } from "@/db";

export const getSimilarEventBySlug = async (slug: string) => {
  try {
    const event = await prisma.event.findFirst({ where: { slug } });

    if (!event) return [];

    return await prisma.event.findMany({
      where: {
        id: {
          not: event.id,
        },
        tags: {
          hasSome: event.tags,
        },
      },
    });
  } catch (e) {
    return [];
  }
};
