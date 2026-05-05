import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions));
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const search = req.nextUrl.searchParams.get("search") || "";

  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [
            { discordId: { contains: search } },
            { username: { contains: search } },
          ],
        }
      : undefined,
    include: { subscription: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions));
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, plan } = await req.json();
  if (!userId || !plan) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const subscription = await prisma.subscription.upsert({
    where: { userId },
    update: { plan, status: "active" },
    create: { userId, plan, status: "active" },
  });

  return NextResponse.json(subscription);
}
