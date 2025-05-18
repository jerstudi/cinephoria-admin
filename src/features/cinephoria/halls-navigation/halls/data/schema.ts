import { z } from "zod";
import { CineSessionSchema } from "../../../cineSession-navigation/data/schema";

export const HallSchema = z.object({
  id: z.string(),
  idx: z.number(),
  identifier: z.string(),
  hallNumber: z.number(),
  type: z.string(),
  capacity: z.number(),
  disabled_places: z.number(),
  cineSessions: z.array(z.lazy(() => CineSessionSchema)), // Relation
  // reservation: z.array(z.lazy(() => ReservationSchema)), // Relation
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Hall = z.infer<typeof HallSchema>;
