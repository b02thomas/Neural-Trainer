import { createClient } from '@/lib/supabase/server';

export type UserRole = 'admin' | 'premium' | 'user';

export interface UserProfile {
  id: string;
  role: UserRole;
  discord_id: string | null;
  discord_username: string | null;
  email: string | null;
  created_at: string;
}

/**
 * Get the current user's role from the profiles table
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching user role:', error);
    return 'user'; // Default to 'user' if error
  }

  return data.role as UserRole;
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin';
}

/**
 * Check if user has access (admin or premium)
 */
export async function hasAccess(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin' || role === 'premium';
}

/**
 * Update user role in profiles table
 */
export async function updateUserRole(userId: string, role: UserRole): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user role:', error);
    return false;
  }

  return true;
}

/**
 * Update user's Discord info in profile
 */
export async function updateDiscordInfo(
  userId: string,
  discordId: string,
  discordUsername: string,
  isPremium: boolean
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .update({
      discord_id: discordId,
      discord_username: discordUsername,
      role: isPremium ? 'premium' : 'user',
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating Discord info:', error);
    return false;
  }

  return true;
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data as UserProfile[];
}
