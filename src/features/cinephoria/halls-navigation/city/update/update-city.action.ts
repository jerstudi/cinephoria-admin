"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateCitySchema = z.object({
  id: z.string(),
  name: z.string(),
  cp: z.preprocess((val) => Number(val), z.number()),
  country: z.string(),
  region: z.string(),
});

export const updateCityAction = orgAction
  .schema(UpdateCitySchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.city.update({
        where: { id: parsedInput.id },
        data: {
          ...parsedInput,
          name: parsedInput.name,
          cp: parsedInput.cp,
          country: parsedInput.country,
          region: parsedInput.region,
        },
      });
      // console.log("New city data", newCity);
      return;
    } catch (error) {
      console.error("Update city error:", error);
      throw error;
    }
  });
