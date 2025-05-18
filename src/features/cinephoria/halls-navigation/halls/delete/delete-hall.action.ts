"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const DeleteHallSchema = z.object({
  id: z.string().min(1, { message: "Hall ID is required" }),
  hallNumber: z.preprocess((val) => Number(val), z.number()),
  userId: z.string(),
});

export const deleteHallAction = orgAction
  .schema(DeleteHallSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.hall.delete({
        where: { id: parsedInput.id },
      });
      return;
    } catch (error) {
      console.error("Delete hall error:", error);
      throw error;
    }
  });

const DeleteManyHallsSchema = z.array(
  z.object({
    id: z.string().min(1, { message: "Hall ID is required" }),
    name: z.string().optional(),
    userId: z.string(),
  }),
);

export const deleteManyHallsAction = orgAction
  .schema(DeleteManyHallsSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.hall.deleteMany({
        where: { id: { in: parsedInput.map((hall) => hall.id) } },
      });
      return;
    } catch (error) {
      console.error("Delete halls error:", error);
      throw error;
    }
  });
