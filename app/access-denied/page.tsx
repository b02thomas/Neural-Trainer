'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, ShieldX, ExternalLink, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

export default function AccessDeniedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  const handleBackToLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getMessage = () => {
    switch (reason) {
      case 'User is not a member of the Discord server':
        return {
          title: 'Not a Server Member',
          description: 'You need to join our Discord server first to access the Neural Trainer.',
          action: 'Join Discord Server',
          showDiscordLink: true,
        };
      case 'admin_required':
        return {
          title: 'Admin Access Required',
          description: 'This area is restricted to administrators only.',
          action: 'Go Home',
          showDiscordLink: false,
        };
      case 'premium_required':
      default:
        return {
          title: 'Premium Access Required',
          description: 'Only premium Discord members can access the Neural Trainer. Upgrade your membership to unlock access.',
          action: 'Get Premium',
          showDiscordLink: true,
        };
    }
  };

  const message = getMessage();

  return (
    <div className="min-h-screen neural-bg grid-overlay flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <span className="text-xl font-bold text-white">Neural Trainer</span>
        </Link>

        {/* Access Denied Card */}
        <div className="glass-card rounded-2xl p-8 border border-red-500/30">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{message.title}</h1>
          <p className="text-white/60 text-sm mb-6">
            {message.description}
          </p>

          <div className="space-y-3">
            {message.showDiscordLink ? (
              <Button className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white gap-2" asChild>
                <a
                  href="https://discord.gg/your-server"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                  {message.action}
                </a>
              </Button>
            ) : (
              <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white" asChild>
                <Link href="/">
                  {message.action}
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              className="w-full text-white/60 hover:text-white hover:bg-white/5 gap-2"
              onClick={handleBackToLogin}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Button>
          </div>
        </div>

        <p className="text-white/40 text-xs mt-6">
          Already have premium?{' '}
          <Link href="/login" className="text-purple-400 hover:underline">
            Login with Discord
          </Link>
        </p>
      </div>
    </div>
  );
}
