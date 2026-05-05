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
    include: { plugins: true },
  });

  const defaultPlugins = ["tickets", "levels", "protection", "invites"];
  const plugins = defaultPlugins.map((name) => {
    const existing = server?.plugins.find((p: { name: string; enabled: boolean }) => p.name === name);
    return { name, enabled: existing?.enabled ?? false };
  });

  return NextResponse.json(plugins);
}

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions));
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serverId, pluginName, enabled } = await req.json();
  if (!serverId || !pluginName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  let server = await prisma.server.findUnique({ where: { discordId: serverId } });
  if (!server) {
    server = await prisma.server.create({
      data: {
        discordId: serverId,
        name: "Server",
        ownerId: session.userId,
      },
    });
  }

  await prisma.plugin.upsert({
    where: { serverId_name: { serverId: server.id, name: pluginName } },
    update: { enabled },
    create: { serverId: server.id, name: pluginName, enabled },
  });

  return NextResponse.json({ success: true });
}
