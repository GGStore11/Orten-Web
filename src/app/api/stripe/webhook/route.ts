import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      const discordId = session.metadata?.discordId;
      const plan = session.metadata?.plan || "elite";

      if (discordId) {
        const user = await prisma.user.findUnique({
          where: { discordId },
        });
        if (user) {
          await prisma.subscription.upsert({
            where: { userId: user.id },
            update: {
              plan,
              stripeCustomerId: customerId,
              stripeSubId: subscriptionId,
              status: "active",
            },
            create: {
              userId: user.id,
              plan,
              stripeCustomerId: customerId,
              stripeSubId: subscriptionId,
              status: "active",
            },
          });
        }
      }
      break;
    }

    case "customer.subscription.deleted":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const sub = await prisma.subscription.findFirst({
        where: { stripeSubId: subscription.id },
        include: { user: { include: { servers: { include: { branding: true } } } } },
      });

      if (sub) {
        if (subscription.status === "canceled" || subscription.status === "unpaid") {
          // Revoke subscription and reset branding
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { plan: "free", status: "canceled" },
          });

          // Reset branding for all servers
          for (const server of sub.user.servers) {
            if (server.branding) {
              await prisma.branding.delete({
                where: { id: server.branding.id },
              });
            }
          }
        } else if (subscription.status === "active") {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: "active" },
          });
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
