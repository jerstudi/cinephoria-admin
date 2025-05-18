"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const DeleteCitySchema = z.object({
  id: z.string().min(1, { message: "City ID is required" }),
  name: z.string().optional(),
  userId: z.string(),
});

export const deleteCityAction = orgAction
  .schema(DeleteCitySchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.city.delete({
        where: { id: parsedInput.id },
      });
      return;
    } catch (error) {
      console.error("Delete city error:", error);
      throw error;
    }
  });

const DeleteManyCitiesSchema = z.array(
  z.object({
    id: z.string().min(1, { message: "City ID is required" }),
    name: z.string().optional(),
    userId: z.string(),
  }),
);

export const deleteManyCitiesAction = orgAction
  .schema(DeleteManyCitiesSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.city.deleteMany({
        where: { id: { in: parsedInput.map((city) => city.id) } },
      });
      return;
    } catch (error) {
      console.error("Delete cities error:", error);
      throw error;
    }
  });
