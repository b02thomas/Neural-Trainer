import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdmin, getAllUsers, type UserProfile } from '@/lib/auth';
import { AdminUserTable } from '@/components/admin/user-table';
import { Brain, Users, Shield, Crown } from 'lucide-react';
import Link from 'next/link';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userIsAdmin = await isAdmin(user.id);
  if (!userIsAdmin) {
    redirect('/access-denied?reason=admin_required');
  }

  const users = await getAllUsers();

  // Calculate stats
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const premiumCount = users.filter(u => u.role === 'premium').length;
  const regularCount = users.filter(u => u.role === 'user').length;

  return (
    <div className="min-h-screen neural-bg grid-overlay">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-lg font-bold text-white">Neural Trainer</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            <span className="text-white/70 text-sm">Admin Panel</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/60">Manage users and their access levels</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="text-white/60 text-sm">Total Users</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalUsers}</p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-red-400" />
              <span className="text-white/60 text-sm">Admins</span>
            </div>
            <p className="text-3xl font-bold text-white">{adminCount}</p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-white/60 text-sm">Premium</span>
            </div>
            <p className="text-3xl font-bold text-white">{premiumCount}</p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-white/40" />
              <span className="text-white/60 text-sm">Regular</span>
            </div>
            <p className="text-3xl font-bold text-white">{regularCount}</p>
          </div>
        </div>

        {/* User Management */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">User Management</h2>
            <p className="text-white/60 text-sm mt-1">
              View and manage user roles. Click on a role to change it.
            </p>
          </div>
          <AdminUserTable users={users} currentUserId={user.id} />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/play"
            className="glass-card rounded-xl p-6 hover:bg-white/5 transition-colors group"
          >
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
              Go to Training
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Test the Stroop game as a user
            </p>
          </Link>

          <Link
            href="/stats"
            className="glass-card rounded-xl p-6 hover:bg-white/5 transition-colors group"
          >
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
              View Statistics
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Check overall performance metrics
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
