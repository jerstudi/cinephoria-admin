import { z } from "zod";
import { CinemaSchema } from "../cinema/data/schema";
import { CitySchema } from "../city/data/schema";
import { HallSchema } from "../halls/data/schema";

export const HallsSchema = z.object({
  cities: z.array(CitySchema),
  hall: z.array(HallSchema),
  cinema: z.array(CinemaSchema),
});

export type Halls = z.infer<typeof HallsSchema>;
