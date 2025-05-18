"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { generateItemIdentifier } from "@/lib/utils";
import { nanoid } from "nanoid";
import { z } from "zod";

const CreateMovieSchema = z.object({
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

export const createMovieAction = orgAction
  .schema(CreateMovieSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      const getLastMovieCreated = await prisma.movie.findFirst({
        orderBy: { createdAt: "desc" },
        select: { identifier: true },
      });

      const newMovieIdentifier = getLastMovieCreated
        ? generateItemIdentifier(getLastMovieCreated.identifier, "MOVIE")
        : "MOVIE-0001";

      await prisma.movie.create({
        data: {
          ...parsedInput,
          id: nanoid(),
          identifier: newMovieIdentifier,
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
      console.error("Create movie error:", error);
      throw error;
    }
  });
