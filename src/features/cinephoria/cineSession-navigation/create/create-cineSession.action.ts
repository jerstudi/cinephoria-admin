"use server";

import { orgAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { generateItemIdentifier } from "@/lib/utils";
import { nanoid } from "nanoid";
import { z } from "zod";

const CreateCineSessionSchema = z.object({
  movieId: z.string(),
  hallId: z.string(),
  cineId: z.string(),
  sessionStart: z.date(),
  sessionEnd: z.date(),
  date: z.date(),
  note: z.preprocess((val) => Number(val), z.number()),
  pricing: z.preprocess((val) => Number(val), z.number()),
});

export const createCineSessionAction = orgAction
  .schema(CreateCineSessionSchema)
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  .action(async ({ parsedInput }) => {
    try {
      const getLastCineSessionCreated = await prisma.cineSession.findFirst({
        orderBy: { createdAt: "desc" },
        select: { identifier: true },
      });

      const newCineSessionIdentifier = getLastCineSessionCreated
        ? generateItemIdentifier(
            getLastCineSessionCreated.identifier,
            "CINE_SESSION",
          )
        : "CINE_SESSION-0001";

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

      await prisma.cineSession.create({
        data: {
          ...parsedInput,
          id: nanoid(),
          identifier: newCineSessionIdentifier,
          movieId: parsedInput.movieId,
          hallId: parsedInput.hallId,
          cineId: parsedInput.cineId,
          sessionStart: finalSessionStart,
          sessionEnd: finalSessionEnd,
          date: date,
          note: parsedInput.note,
          pricing: parsedInput.pricing,
        },
      });
      // console.log("New Cine Session data", newCineSession);
      return;
    } catch (error) {
      console.error("Create cine session error:", error);
      throw error;
    }
  });
