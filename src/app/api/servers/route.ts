import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getUserGuilds, getAdminGuilds, isBotInGuild } from "@/lib/discord";

export async function GET() {
  const session = (await getServerSession(authOptions));
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const guilds = await getUserGuilds(session.accessToken);
    const adminGuilds = getAdminGuilds(guilds);

    const guildsWithBotStatus = await Promise.all(
      adminGuilds.map(async (guild) => ({
        ...guild,
        botAdded: await isBotInGuild(guild.id),
        iconUrl: guild.icon
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
          : null,
      }))
    );

    return NextResponse.json(guildsWithBotStatus);
  } catch {
    return NextResponse.json({ error: "Failed to fetch servers" }, { status: 500 });
  }
}
