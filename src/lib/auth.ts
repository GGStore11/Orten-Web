import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify guilds guilds.join",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!account || !profile) return false;
      const discordProfile = profile as { id: string; username: string; avatar?: string; email?: string };
      await prisma.user.upsert({
        where: { discordId: discordProfile.id },
        update: {
          username: discordProfile.username,
          avatar: discordProfile.avatar || null,
          email: discordProfile.email || null,
        },
        create: {
          discordId: discordProfile.id,
          username: discordProfile.username,
          avatar: discordProfile.avatar || null,
          email: discordProfile.email || null,
          isAdmin: discordProfile.id === process.env.ADMIN_DISCORD_ID,
        },
      });
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const discordProfile = profile as { id: string };
        token.discordId = discordProfile.id;
        token.accessToken = account.access_token;
        const user = await prisma.user.findUnique({
          where: { discordId: discordProfile.id },
          include: { subscription: true },
        });
        if (user) {
          token.userId = user.id;
          token.isAdmin = user.isAdmin;
          token.plan = user.subscription?.plan || "free";
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.discordId = token.discordId || "";
      session.accessToken = token.accessToken || "";
      session.userId = token.userId || "";
      session.isAdmin = token.isAdmin || false;
      session.plan = token.plan || "free";
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
