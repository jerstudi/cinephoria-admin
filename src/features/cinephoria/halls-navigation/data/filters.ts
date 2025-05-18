import type { Cinema } from "../cinema/data/schema";
import type { City } from "../city/data/schema";
import type { Hall } from "../halls/data/schema";
import type { Halls } from "./schema";

export const citiesDataTableFilter = (data: Halls): City[] => {
  return data.cities;
};

export const cinemaDataTableFilter = (data: Halls): Cinema[] => {
  return data.cinema;
};

export const hallDataTableFilter = (data: Halls): Hall[] => {
  return data.hall;
};
