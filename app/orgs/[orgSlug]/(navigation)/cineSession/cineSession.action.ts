/* eslint-disable no-console */
"use server";

import { prisma } from "@/lib/prisma";

export async function getCineSessions() {
  try {
    const cineSessionsData = await prisma.cineSession.findMany({
      include: {
        movie: true,
        hall: true,
        cinema: true,
        reservations: true,
      },
    });
    return cineSessionsData;
  } catch (error) {
    console.error("Get cineSessions data error: ", error);
    throw error;
  }
}
