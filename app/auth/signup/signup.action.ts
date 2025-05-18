"use server";

import { ActionError, action } from "@/lib/actions/safe-actions";
import {
  setupDefaultOrganizationsOrInviteUser,
  setupResendCustomer,
} from "@/lib/auth/auth-config-setup";
import {
  hashStringWithSalt,
  validatePassword,
} from "@/lib/auth/credentials-provider";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { LoginCredentialsFormScheme } from "./signup.schema";

export const signUpAction = action
  .schema(LoginCredentialsFormScheme)
  .action(async ({ parsedInput: { email, password, name } }) => {
    if (!validatePassword(password)) {
      throw new ActionError(
        "Invalid new password. Must be at least 8 characters, and contain at least one letter and one number",
      );
    }

    try {
      const userData = {
        email,
        passwordHash: hashStringWithSalt(password, env.AUTH_SECRET),
        name,
      };

      const resendContactId = await setupResendCustomer(userData);

      const user = await prisma.user.create({
        data: {
          ...userData,
          resendContactId,
        },
      });

      try {
        await setupDefaultOrganizationsOrInviteUser(user);
      } catch (error) {
        console.error("Error creating organization:", error);
        // Si l'organisation n'est pas créée, on supprime l'utilisateur
        await prisma.user.delete({
          where: { id: user.id },
        });
        throw new ActionError("Failed to create organization");
      }

      return user;
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      // Vérifier si c'est une erreur de duplication d'email
      if (
        error instanceof Error &&
        error.message.includes("Unique constraint")
      ) {
        throw new ActionError("Email already exists");
      }
      console.error("Signup error:", error);
      throw new ActionError("An error occurred during signup");
    }
  });
