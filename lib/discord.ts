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
  const premiumRoleIds = process.env.DISCORD_PREMIUM_ROLE_IDS?.split(',') || [];

  // Debug logging for configuration
  console.log('[Discord Verify] Configuration:', {
    guildId: guildId ? `${guildId.slice(0, 6)}...` : 'NOT SET',
    premiumRoleIds: premiumRoleIds.length > 0 ? premiumRoleIds : 'EMPTY',
    hasAccessToken: !!accessToken,
  });

  if (!guildId || premiumRoleIds.length === 0) {
    console.error('[Discord Verify] FAILED: Guild ID or premium role IDs not configured');
    return { isPremium: false, error: 'Server configuration error' };
  }

  try {
    // First, get the current user's info
    console.log('[Discord Verify] Fetching user info...');
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      console.error('[Discord Verify] FAILED: User fetch failed', {
        status: userResponse.status,
        statusText: userResponse.statusText,
      });
      return { isPremium: false, error: `Failed to fetch Discord user (${userResponse.status})` };
    }

    const user = await userResponse.json();
    console.log('[Discord Verify] User fetched:', {
      userId: user.id,
      username: user.username,
    });

    // Get user's guild member info (includes roles)
    console.log('[Discord Verify] Fetching guild membership...');
    const memberResponse = await fetch(
      `https://discord.com/api/users/@me/guilds/${guildId}/member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!memberResponse.ok) {
      console.error('[Discord Verify] FAILED: Guild member fetch failed', {
        status: memberResponse.status,
        statusText: memberResponse.statusText,
      });
      // User might not be in the server
      if (memberResponse.status === 404) {
        return {
          isPremium: false,
          userId: user.id,
          username: user.username,
          error: 'User is not a member of the Discord server'
        };
      }
      return { isPremium: false, error: `Failed to fetch guild membership (${memberResponse.status})` };
    }

    const member: DiscordGuildMember = await memberResponse.json();

    // Check if user has any of the premium roles (Seeker or Mentee)
    const hasPremiumRole = premiumRoleIds.some(roleId => member.roles.includes(roleId));

    // Detailed logging for role verification
    console.log('[Discord Verify] Role check:', {
      userRoles: member.roles,
      requiredRoles: premiumRoleIds,
      hasPremiumRole,
      matchedRoles: premiumRoleIds.filter(roleId => member.roles.includes(roleId)),
    });

    if (!hasPremiumRole) {
      console.log('[Discord Verify] DENIED: User does not have any premium roles');
    } else {
      console.log('[Discord Verify] SUCCESS: User has premium access');
    }

    return {
      isPremium: hasPremiumRole,
      userId: user.id,
      username: user.username,
    };
  } catch (error) {
    console.error('[Discord Verify] EXCEPTION:', error);
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
