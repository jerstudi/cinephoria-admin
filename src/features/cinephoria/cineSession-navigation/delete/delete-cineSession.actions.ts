"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const DeleteCineSessionSchema = z.object({
  id: z.string().min(1, { message: "CineSession ID is required" }),
  name: z.string().optional(),
  userId: z.string(),
});

export const deleteCineSessionAction = orgAction
  .schema(DeleteCineSessionSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.cineSession.delete({
        where: { id: parsedInput.id },
      });
      return;
    } catch (error) {
      console.error("Delete cineSession error:", error);
      throw error;
    }
  });

const DeleteManyCineSessionsSchema = z.array(
  z.object({
    id: z.string().min(1, { message: "CineSession ID is required" }),
    name: z.string().optional(),
    userId: z.string(),
  }),
);

export const deleteManyCineSessionsAction = orgAction
  .schema(DeleteManyCineSessionsSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      await prisma.cineSession.deleteMany({
        where: { id: { in: parsedInput.map((cineSession) => cineSession.id) } },
      });
      return;
    } catch (error) {
      console.error("Delete cineSessions error:", error);
      throw error;
    }
  });
