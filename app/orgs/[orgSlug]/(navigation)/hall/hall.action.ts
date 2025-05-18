/* eslint-disable no-console */
"use server";

import { prisma } from "@/lib/prisma";

export async function getCities() {
  try {
    const citiesData = await prisma.city.findMany();
    return citiesData;
  } catch (error) {
    console.error("Get cities data error: ", error);
    throw error;
  }
}

export async function getHall() {
  try {
    const hallData = await prisma.hall.findMany({
      include: {
        cineSession: true,
      },
    });
    return hallData;
  } catch (error) {
    console.error("Get hall data error: ", error);
    throw error;
  }
}

export async function getCinema() {
  try {
    const cinemaData = await prisma.cinema.findMany({
      include: {
        cineSessions: true,
      },
    });
    return cinemaData;
  } catch (error) {
    console.error("Get cinema data error: ", error);
    throw error;
  }
}

export async function retrieveAllFromHallsData() {
  const cities = await getCities();
  const hall = await getHall();
  const cinema = await getCinema();

  const allData = {
    cities: cities,
    hall: hall.map((h) => ({
      ...h,
      cineSessions: h.cineSession,
    })),
    cinema: cinema,
  };
  return allData;
}
