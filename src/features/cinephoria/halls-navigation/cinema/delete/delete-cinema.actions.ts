"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const DeleteCinemaSchema = z.object({
  id: z.string().min(1, { message: "Cinema ID is required" }),
  name: z.string().optional(),
  userId: z.string(),
});

export const deleteCinemaAction = orgAction
  .schema(DeleteCinemaSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.cinema.delete({
        where: { id: parsedInput.id },
      });
      return;
    } catch (error) {
      console.error("Delete cinema error:", error);
      throw error;
    }
  });

const DeleteManyCinemasSchema = z.array(
  z.object({
    id: z.string().min(1, { message: "Cinema ID is required" }),
    name: z.string().optional(),
    userId: z.string(),
  }),
);

export const deleteManyCinemasAction = orgAction
  .schema(DeleteManyCinemasSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.cinema.deleteMany({
        where: { id: { in: parsedInput.map((cinema) => cinema.id) } },
      });
      return;
    } catch (error) {
      console.error("Delete cinemas error:", error);
      throw error;
    }
  });
