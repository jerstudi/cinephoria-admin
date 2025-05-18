/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MovieSchema } from "@/features/cinephoria/movie-navigation/movies/data/schema";
import { z } from "zod";
import { CinemaSchema } from "../../halls-navigation/cinema/data/schema";
import { HallSchema } from "../../halls-navigation/halls/data/schema";

export const CineSessionSchema = z.object({
  id: z.string(),
  idx: z.number(),
  identifier: z.string(),
  movieId: z.string(),
  sessionStart: z.coerce.date(),
  sessionEnd: z.coerce.date(),
  date: z.coerce.date(),
  cineId: z.string(),
  hallId: z.string(),
  note: z.number(),
  pricing: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  movie: z.lazy((): z.ZodType<any> => MovieSchema).optional(), // Relation vers Movie
  cinema: z.lazy((): z.ZodType<any> => CinemaSchema), // Relation vers Cinema
  hall: z.lazy((): z.ZodType<any> => HallSchema), // Relation vers Hall
});

export type CineSession = z.infer<typeof CineSessionSchema>;
