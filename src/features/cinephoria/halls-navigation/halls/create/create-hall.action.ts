"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { generateItemIdentifier } from "@/lib/utils";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateHallSchema = z.object({
  hallNumber: z.preprocess((val) => Number(val), z.number()),
  type: z.string(),
  capacity: z.preprocess((val) => Number(val), z.number()),
  disabled_places: z.preprocess((val) => Number(val), z.number()),
});

export const createHallAction = orgAction
  .schema(CreateHallSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      const getLastHallCreated = await prisma.hall.findFirst({
        orderBy: { createdAt: "desc" },
        select: { identifier: true },
      });

      const newHallIdentifier = getLastHallCreated
        ? generateItemIdentifier(getLastHallCreated.identifier, "HALL")
        : "HALL-0001";

      await prisma.hall.create({
        data: {
          ...parsedInput,
          id: nanoid(),
          identifier: newHallIdentifier,
          hallNumber: parsedInput.hallNumber,
          type: parsedInput.type,
          capacity: parsedInput.capacity,
          disabled_places: parsedInput.disabled_places,
        },
      });
      // console.log("New hall data", newHall);
      return;
    } catch (error) {
      console.error("Create hall error:", error);
      throw error;
    }
  });
