"use server";

import { prisma } from "@/lib/prisma";

export async function getMovies() {
  try {
    const moviesData = await prisma.movie.findMany();
    return moviesData;
  } catch (error) {
    console.error("Get movies data error:", error);
    throw error;
  }
}
