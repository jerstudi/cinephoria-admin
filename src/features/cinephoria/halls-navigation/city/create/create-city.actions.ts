"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { generateItemIdentifier } from "@/lib/utils";
import { nanoid } from "nanoid";
import { z } from "zod";

const CreateCitySchema = z.object({
  name: z.string(),
  cp: z.preprocess((val) => Number(val), z.number()),
  country: z.string(),
  region: z.string(),
});

export const createCityAction = orgAction
  .schema(CreateCitySchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      const getLastCityCreated = await prisma.city.findFirst({
        orderBy: { createdAt: "desc" },
        select: { identifier: true },
      });

      const newCityIdentifier = getLastCityCreated
        ? generateItemIdentifier(getLastCityCreated.identifier, "CITY")
        : "CITY-0001";

      await prisma.city.create({
        data: {
          ...parsedInput,
          id: nanoid(),
          identifier: newCityIdentifier,
          name: parsedInput.name,
          cp: parsedInput.cp,
          country: parsedInput.country,
          region: parsedInput.region,
        },
      });
      // console.log("New city data", newCity);
      return;
    } catch (error) {
      console.error("Create city error:", error);
      throw error;
    }
  });
