import { z } from "zod";

export const CitySchema = z.object({
  id: z.string(),
  identifier: z.string(),
  name: z.string(),
  cp: z.number(),
  country: z.string(),
  region: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type City = z.infer<typeof CitySchema>;
