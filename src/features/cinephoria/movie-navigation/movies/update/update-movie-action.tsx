"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateMovieSchema = z.object({
  id: z.string(),
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
});

export const updateMovieAction = orgAction
  .schema(UpdateMovieSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.movie.update({
        where: { id: parsedInput.id },
        data: {
          ...parsedInput,
          title: parsedInput.title,
          poster: parsedInput.poster,
          description: parsedInput.description,
          actors: parsedInput.actors,
          directors: parsedInput.directors,
          musicComposer: parsedInput.musicComposer,
          synopsis: parsedInput.synopsis,
          movieDate: parsedInput.movieDate,
          gender: parsedInput.gender,
          ageLimit: parsedInput.ageLimit,
          duration: parsedInput.duration,
          favorite: parsedInput.favorite,
          active: parsedInput.active,
        },
      });
      // console.log("New movie data", newMovie);
      return;
    } catch (error) {
      console.error("Update movie error:", error);
      throw error;
    }
  });
