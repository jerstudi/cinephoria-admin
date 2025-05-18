"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const DeleteMovieSchema = z.object({
  id: z.string().min(1, { message: "Movie ID is required" }),
  title: z.string().optional(),
  userId: z.string(),
});

export const deleteMovieAction = orgAction
  .schema(DeleteMovieSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.movie.delete({
        where: { id: parsedInput.id },
      });
      return;
    } catch (error) {
      console.error("Delete movie error:", error);
      throw error;
    }
  });

const DeleteManyMoviesSchema = z.array(
  z.object({
    id: z.string().min(1, { message: "Movie ID is required" }),
    title: z.string().optional(),
    userId: z.string(),
  }),
);

export const deleteManyMoviesAction = orgAction
  .schema(DeleteManyMoviesSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.movie.deleteMany({
        where: { id: { in: parsedInput.map((movie) => movie.id) } },
      });
      return;
    } catch (error) {
      console.error("Delete movie error:", error);
      throw error;
    }
  });
