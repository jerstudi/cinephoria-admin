"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateHallSchema = z.object({
  id: z.string(),
  hallNumber: z.preprocess((val) => Number(val), z.number()),
  type: z.string(),
  capacity: z.preprocess((val) => Number(val), z.number()),
  disabled_places: z.preprocess((val) => Number(val), z.number()),
});

export const updateHallAction = orgAction
  .schema(UpdateHallSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.hall.update({
        where: { id: parsedInput.id },
        data: {
          ...parsedInput,
          hallNumber: parsedInput.hallNumber,
          type: parsedInput.type,
          capacity: parsedInput.capacity,
          disabled_places: parsedInput.disabled_places,
        },
      });
      // console.log("New hall data", newHall);
      return;
    } catch (error) {
      console.error("Update hall error:", error);
      throw error;
    }
  });
