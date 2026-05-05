import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    discordId: string;
    accessToken: string;
    userId: string;
    isAdmin: boolean;
    plan: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId?: string;
    accessToken?: string;
    userId?: string;
    isAdmin?: boolean;
    plan?: string;
  }
}
