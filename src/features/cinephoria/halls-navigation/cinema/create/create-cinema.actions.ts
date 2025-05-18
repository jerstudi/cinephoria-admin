"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { generateItemIdentifier } from "@/lib/utils";
import { nanoid } from "nanoid";
import { z } from "zod";

const CreateCinemaSchema = z.object({
  name: z.string(),
  city: z.string(),
});

export const createCinemaAction = orgAction
  .schema(CreateCinemaSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      const getLastCinemaCreated = await prisma.cinema.findFirst({
        orderBy: { createdAt: "desc" },
        select: { identifier: true },
      });

      const newCinemaIdentifier = getLastCinemaCreated
        ? generateItemIdentifier(getLastCinemaCreated.identifier, "CINE")
        : "CINE-0001";

      await prisma.cinema.create({
        data: {
          ...parsedInput,
          id: nanoid(),
          identifier: newCinemaIdentifier,
          name: parsedInput.name,
          city: parsedInput.city,
        },
      });
      // console.log("New cinema data", newCinema);
      return;
    } catch (error) {
      console.error("Create cinema error:", error);
      throw error;
    }
  });
