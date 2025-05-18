import { z } from "zod";

export const MovieSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  title: z.string().min(1, " Title is required"),
  poster: z.string(),
  description: z.string(),
  actors: z.string(),
  directors: z.string(),
  musicComposer: z.string(),
  synopsis: z.string(),
  movieDate: z
    .number()
    .min(1900, "L'année doit être supérieure à 1900")
    .max(new Date().getFullYear(), "L'année ne peut pas être dans le futur"),
  gender: z.string(),
  ageLimit: z.preprocess((val) => Number(val), z.number()),
  duration: z.preprocess((val) => Number(val), z.number()),
  favorite: z.boolean().default(false),
  active: z.boolean().default(true),
  // User: z.array(z.lazy(() => UserSchema)), // Relation
});

export type Movie = z.infer<typeof MovieSchema>;
