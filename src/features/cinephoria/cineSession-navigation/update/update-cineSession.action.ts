"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateCineSessionSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  hallId: z.string(),
  sessionStart: z.date(),
  sessionEnd: z.date(),
  date: z.date(),
  cineId: z.string(),
  note: z.preprocess((val) => Number(val), z.number()),
  pricing: z.preprocess((val) => Number(val), z.number()),
});

export const updateCineSessionAction = orgAction
  .schema(UpdateCineSessionSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      // console.log("Server received dates:", {
      //   sessionStart: parsedInput.sessionStart,
      //   sessionEnd: parsedInput.sessionEnd,
      //   date: parsedInput.date,
      // });

      // Extraire uniquement l'heure pour sessionStart et sessionEnd
      const sessionStart = new Date(parsedInput.sessionStart);
      const sessionEnd = new Date(parsedInput.sessionEnd);
      const date = new Date(parsedInput.date);

      // Créer une date avec l'heure spécifiée mais la date du jour
      const today = new Date();
      const finalSessionStart = new Date(today);
      finalSessionStart.setHours(
        sessionStart.getHours(),
        sessionStart.getMinutes(),
        0,
        0,
      );

      const finalSessionEnd = new Date(today);
      finalSessionEnd.setHours(
        sessionEnd.getHours(),
        sessionEnd.getMinutes(),
        0,
        0,
      );

      const updatedSession = await prisma.cineSession.update({
        where: { id: parsedInput.id },
        data: {
          movieId: parsedInput.movieId,
          hallId: parsedInput.hallId,
          sessionStart: finalSessionStart,
          sessionEnd: finalSessionEnd,
          date: date,
          cineId: parsedInput.cineId,
          note: parsedInput.note,
          pricing: parsedInput.pricing,
        },
      });

      // console.log("Updated session:", updatedSession);
      return updatedSession;
    } catch (error) {
      console.error("Update cineSession error:", error);
      throw error;
    }
  });
