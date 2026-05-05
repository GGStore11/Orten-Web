import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { TEMPLATES } from "@/lib/templates";
import {
  getGuildChannels,
  deleteChannel,
  createChannel,
  createRole,
} from "@/lib/discord";

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions));
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serverId, templateId } = await req.json();
  if (!serverId || !templateId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const template = TEMPLATES[templateId];
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const existingServer = await prisma.server.findUnique({ where: { discordId: serverId } });
  if (existingServer && existingServer.ownerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Delete existing channels
    const existingChannels = await getGuildChannels(serverId);
    for (const channel of existingChannels) {
      try {
        await deleteChannel(channel.id);
      } catch {
        // Skip channels that can't be deleted
      }
    }

    // Create roles
    for (const role of template.roles) {
      await createRole(serverId, role);
    }

    // Create channels
    for (const category of template.channels) {
      const cat = await createChannel(serverId, {
        name: category.name,
        type: category.type,
      });

      if (category.children) {
        for (let i = 0; i < category.children.length; i++) {
          const child = category.children[i];
          await createChannel(serverId, {
            name: child.name,
            type: child.type,
            parent_id: cat.id,
            position: i,
          });
        }
      }
    }

    // Update server record
    if (!existingServer) {
      await prisma.server.create({
        data: {
          discordId: serverId,
          name: "Server",
          ownerId: session.userId,
          template: templateId,
        },
      });
    } else {
      await prisma.server.update({
        where: { id: existingServer.id },
        data: { template: templateId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Template apply error:", error);
    return NextResponse.json(
      { error: "Failed to apply template" },
      { status: 500 }
    );
  }
}
