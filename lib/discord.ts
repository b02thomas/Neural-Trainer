/**
 * Discord role verification utilities
 * Checks if a user has the premium role in your Discord server
 */

interface DiscordGuildMember {
  roles: string[];
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
}

/**
 * Check if a Discord user has the premium role
 * @param accessToken - Discord OAuth access token from Supabase
 * @returns Object with isPremium status and user info
 */
export async function verifyDiscordPremium(accessToken: string): Promise<{
  isPremium: boolean;
  userId?: string;
  username?: string;
  error?: string;
}> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const premiumRoleId = process.env.DISCORD_PREMIUM_ROLE_ID;

  if (!guildId || !premiumRoleId) {
    console.error('Discord guild ID or premium role ID not configured');
    return { isPremium: false, error: 'Server configuration error' };
  }

  try {
    // First, get the current user's info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return { isPremium: false, error: 'Failed to fetch Discord user' };
    }

    const user = await userResponse.json();

    // Get user's guild member info (includes roles)
    const memberResponse = await fetch(
      `https://discord.com/api/users/@me/guilds/${guildId}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!memberResponse.ok) {
      // User might not be in the server
      if (memberResponse.status === 404) {
        return {
          isPremium: false,
          userId: user.id,
          username: user.username,
          error: 'User is not a member of the Discord server'
        };
      }
      return { isPremium: false, error: 'Failed to fetch guild membership' };
    }

    const member: DiscordGuildMember = await memberResponse.json();

    // Check if user has the premium role
    const hasPremiumRole = member.roles.includes(premiumRoleId);

    return {
      isPremium: hasPremiumRole,
      userId: user.id,
      username: user.username,
    };
  } catch (error) {
    console.error('Error verifying Discord premium:', error);
    return { isPremium: false, error: 'Verification failed' };
  }
}

/**
 * Get Discord user avatar URL
 */
export function getDiscordAvatarUrl(userId: string, avatarHash: string | null, size = 128): string {
  if (!avatarHash) {
    // Default avatar based on user ID
    const defaultAvatarIndex = Number(BigInt(userId) >> BigInt(22)) % 6;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=${size}`;
}
