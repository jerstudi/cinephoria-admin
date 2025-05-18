import type { Prisma } from "@/generated/prisma";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const createOrganizationQuery = async (
  params: Prisma.OrganizationUncheckedCreateInput,
) => {
  let stripeCustomerId: string | undefined;

  console.log("Creating organization with params:", params);
  console.log("Stripe key exists:", !!env.STRIPE_SECRET_KEY);
  console.log("NODE_ENV:", env.NODE_ENV);

  // En développement, on ne crée pas de client Stripe si la clé n'est pas définie
  if (env.NODE_ENV === "development" && !env.STRIPE_SECRET_KEY) {
    console.log("Skipping Stripe customer creation in development mode");
  } else {
    try {
      console.log("Attempting to create Stripe customer...");
      const customer = await stripe.customers.create({
        email: params.email,
        name: params.name,
      });
      console.log("Stripe customer created successfully:", customer.id);
      stripeCustomerId = customer.id;
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      // On continue même si Stripe échoue
    }
  }

  // Vérifier si le plan FREE existe, sinon le créer
  let freePlan = await prisma.organizationPlan.findUnique({
    where: { id: "FREE" },
  });

  if (!freePlan) {
    console.log("Creating FREE plan...");
    freePlan = await prisma.organizationPlan.create({
      data: {
        id: "FREE",
        name: "Free",
        maximumMembers: 1,
      },
    });
    console.log("FREE plan created successfully");
  }

  console.log("Creating organization with stripeCustomerId:", stripeCustomerId);
  const organization = await prisma.organization.create({
    data: {
      ...params,
      planId: "FREE",
      stripeCustomerId,
    },
  });
  console.log("Organization created successfully:", organization.id);

  return organization;
};
