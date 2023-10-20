import { Authenticator } from "remix-auth";
import type { DiscordProfile } from "remix-auth-discord";
import { DiscordStrategy } from "remix-auth-discord";
import { sessionStorage } from "./session.server";

export interface DiscordUser {
  id: DiscordProfile["id"];
  displayName: DiscordProfile["displayName"];
  avatar: DiscordProfile["__json"]["avatar"];
  discriminator: DiscordProfile["__json"]["discriminator"];
  email: DiscordProfile["__json"]["email"];
  accessToken: string;
  refreshToken?: string;
}

export const auth = new Authenticator<DiscordUser>(sessionStorage);

const discordStrategy = new DiscordStrategy(
  {
    clientID: process.env.DISCORD_AUTH_CLIENT_ID ?? "",
    clientSecret: process.env.DISCORD_AUTH_CLIENT_SECRET ?? "",
    callbackURL: process.env.DISCORD_AUTH_CALLBACK_URL ?? "",
    // Provide all the scopes you want as an array
    scope: [ "email", "identify" ],
  },
  async ({
    accessToken,
    refreshToken,
    extraParams,
    profile,
  }): Promise<DiscordUser> => {
    // Get extra data?

    return {
      id: profile.id,
      displayName: profile.__json.username,
      avatar: profile.__json.avatar,
      discriminator: profile.__json.discriminator,
      email: profile.__json.email,
      accessToken,
      refreshToken,
    };
  }
);

auth.use(discordStrategy);