const DISCORD_API = "https://discord.com/api/v10";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

export async function getUserGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch guilds");
  return res.json();
}

export function getAdminGuilds(guilds: DiscordGuild[]): DiscordGuild[] {
  const ADMIN_PERMISSION = BigInt(0x8);
  return guilds.filter(
    (g) => g.owner || (BigInt(g.permissions) & ADMIN_PERMISSION) === ADMIN_PERMISSION
  );
}

export async function isBotInGuild(guildId: string): Promise<boolean> {
  if (!BOT_TOKEN) return false;
  try {
    const res = await fetch(`${DISCORD_API}/guilds/${guildId}`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getGuildChannels(guildId: string) {
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` },
  });
  if (!res.ok) throw new Error("Failed to fetch channels");
  return res.json();
}

export async function deleteChannel(channelId: string) {
  await fetch(`${DISCORD_API}/channels/${channelId}`, {
    method: "DELETE",
    headers: { Authorization: `Bot ${BOT_TOKEN}` },
  });
}

export async function createChannel(
  guildId: string,
  data: { name: string; type: number; parent_id?: string; position?: number }
) {
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create channel");
  return res.json();
}

export async function createRole(
  guildId: string,
  data: { name: string; color?: number; permissions?: string }
) {
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create role");
  return res.json();
}

export function getBotInviteUrl(clientId: string, guildId: string): string {
  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands&guild_id=${guildId}&disable_guild_select=true`;
}
