import { z } from "zod";
import { CineSessionSchema } from "../../../cineSession-navigation/data/schema";

export const CinemaSchema = z.object({
  id: z.string(),
  idx: z.number(),
  identifier: z.string(),
  name: z.string(),
  city: z.string(),
  cineSessions: z.array(z.lazy(() => CineSessionSchema)), // Relation
  // reservation: z.array(z.lazy(() => ReservationSchema)), // Relation
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Cinema = z.infer<typeof CinemaSchema>;
