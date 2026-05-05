import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions));
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serverId = req.nextUrl.searchParams.get("serverId");
  if (!serverId) {
    return NextResponse.json({ error: "serverId required" }, { status: 400 });
  }

  const server = await prisma.server.findUnique({
    where: { discordId: serverId },
    include: { branding: true },
  });

  if (server && server.ownerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(server?.branding || { botName: null, botAvatar: null, nameStyle: null });
}

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions));
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { subscription: true },
  });
  const plan = user?.subscription?.plan || "free";
  if (plan !== "premium" && plan !== "elite") {
    return NextResponse.json({ error: "Premium subscription required" }, { status: 403 });
  }

  const { serverId, botName, botAvatar, nameStyle } = await req.json();
  if (!serverId) {
    return NextResponse.json({ error: "serverId required" }, { status: 400 });
  }

  let server = await prisma.server.findUnique({ where: { discordId: serverId } });
  if (server && server.ownerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!server) {
    server = await prisma.server.create({
      data: { discordId: serverId, name: "Server", ownerId: session.userId },
    });
  }

  await prisma.branding.upsert({
    where: { serverId: server.id },
    update: { botName, botAvatar, nameStyle },
    create: { serverId: server.id, botName, botAvatar, nameStyle },
  });

  return NextResponse.json({ success: true });
}
