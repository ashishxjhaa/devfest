"use server";

import { prisma } from "@/db";

export const createBooking = async ({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}) => {
  try {
    await prisma.booking.create({
      data: {
        eventId,
        email,
      },
    });

    return { success: true };
  } catch (error) {
    console.log("create booking failed", error);
    return { success: false };
  }
};
