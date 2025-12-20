'use client';

import { useState } from 'react';
import { type UserProfile, type UserRole } from '@/lib/auth';
import { Shield, Crown, User, Loader2 } from 'lucide-react';

interface AdminUserTableProps {
  users: UserProfile[];
  currentUserId: string;
}

const roleConfig: Record<UserRole, { icon: typeof Shield; color: string; label: string }> = {
  admin: { icon: Shield, color: 'text-red-400', label: 'Admin' },
  premium: { icon: Crown, color: 'text-yellow-400', label: 'Premium' },
  user: { icon: User, color: 'text-white/40', label: 'User' },
};

export function AdminUserTable({ users, currentUserId }: AdminUserTableProps) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [userList, setUserList] = useState(users);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (userId === currentUserId) {
      alert('You cannot change your own role');
      return;
    }

    setLoadingUserId(userId);

    try {
      const response = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      // Update local state
      setUserList(prev =>
        prev.map(u => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role');
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
              Discord
            </th>
            <th className="px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {userList.map((user) => {
            const config = roleConfig[user.role];
            const Icon = config.icon;
            const isLoading = loadingUserId === user.id;
            const isCurrentUser = user.id === currentUserId;

            return (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-400">
                        {(user.email || user.discord_username || '?')[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.email || 'No email'}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-cyan-400">(you)</span>
                        )}
                      </p>
                      <p className="text-xs text-white/40">{user.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.discord_username ? (
                    <span className="text-sm text-[#5865F2]">
                      {user.discord_username}
                    </span>
                  ) : (
                    <span className="text-sm text-white/30">Not linked</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white/40" />
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      disabled={isCurrentUser}
                      className={`
                        bg-transparent border border-white/10 rounded-lg px-3 py-1.5 text-sm
                        ${config.color} focus:outline-none focus:border-purple-500/50
                        ${isCurrentUser ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5'}
                      `}
                    >
                      <option value="admin" className="bg-gray-900 text-red-400">Admin</option>
                      <option value="premium" className="bg-gray-900 text-yellow-400">Premium</option>
                      <option value="user" className="bg-gray-900 text-white">User</option>
                    </select>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-white/40">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {userList.length === 0 && (
        <div className="text-center py-12 text-white/40">
          No users found
        </div>
      )}
    </div>
  );
}
