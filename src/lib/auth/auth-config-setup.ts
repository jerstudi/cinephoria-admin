import type { User } from "next-auth";
import { z } from "zod";
import { createOrganizationQuery } from "../../query/org/org-create.query";
import { env } from "../env";
import { generateSlug, getNameFromEmail } from "../format/id";
import { resend } from "../mail/resend";
import { prisma } from "../prisma";

export const setupResendCustomer = async (user: User) => {
  if (!user.email) {
    return;
  }

  if (!env.RESEND_AUDIENCE_ID) {
    return;
  }

  const contact = await resend.contacts.create({
    audienceId: env.RESEND_AUDIENCE_ID,
    email: user.email,
    firstName: user.name ?? "",
    unsubscribed: false,
  });

  if (!contact.data) return;

  return contact.data.id;
};

const TokenSchema = z.object({
  orgId: z.string(),
});

export const setupDefaultOrganizationsOrInviteUser = async (user: User) => {
  if (!user.email || !user.id) {
    console.error("Missing email or id for user:", user);
    throw new Error("Missing email or id for user");
  }

  try {
    const tokens = await prisma.verificationToken.findMany({
      where: {
        identifier: {
          startsWith: `${user.email}-invite-`,
        },
      },
    });

    // If there is no token, there is no invitation
    // We create a default organization for the user
    if (tokens.length === 0) {
      console.log("Creating default organization for user", user.id);
      const orgSlug = generateSlug(user.name ?? getNameFromEmail(user.email));

      try {
        await createOrganizationQuery({
          slug: orgSlug,
          name: `${user.name ?? getNameFromEmail(user.email)}'s organization`,
          email: user.email,
          image: user.image,
          members: {
            create: {
              userId: user.id,
              roles: ["OWNER"],
            },
          },
        });
        console.log("Default organization created successfully");
      } catch (error) {
        console.error("Error creating default organization:", error);
        throw error;
      }
    }

    for await (const token of tokens) {
      try {
        const tokenData = TokenSchema.parse(token.data);

        if (tokenData.orgId) {
          await prisma.organizationMembership.create({
            data: {
              organizationId: tokenData.orgId,
              userId: user.id,
              roles: ["MEMBER"],
            },
          });
          await prisma.verificationToken.delete({
            where: {
              token: token.token,
            },
          });
        }
      } catch (error) {
        console.error("Error processing token:", error);
        throw error;
      }
    }
  } catch (error) {
    console.error("Error in setupDefaultOrganizationsOrInviteUser:", error);
    throw error;
  }
};
