"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateCinemaSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
});

export const updateCinemaAction = orgAction
  .schema(UpdateCinemaSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.cinema.update({
        where: { id: parsedInput.id },
        data: {
          ...parsedInput,
          name: parsedInput.name,
          city: parsedInput.city,
        },
      });
      // console.log("New cinema data", newCinema);
      return;
    } catch (error) {
      console.error("Update cinema error:", error);
      throw error;
    }
  });
