import { DiscordLoginButton } from '@/components/auth/discord-login-button';
import { EmailLoginForm } from '@/components/auth/email-login-form';
import { Brain, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  // Middleware handles redirect if user is already logged in
  return (
    <div className="min-h-screen neural-bg grid-overlay flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <span className="text-xl font-bold text-foreground">Neutral Trainer</span>
        </Link>

        {/* Login Card */}
        <div className="glass-card glow-border rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#5865F2]/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#5865F2]" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to access the Neutral Trainer
            </p>
          </div>

          {/* Discord Login */}
          <DiscordLoginButton size="lg" className="w-full" />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-foreground/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Email Login */}
          <EmailLoginForm />

          {/* Features */}
          <div className="mt-6 pt-6 border-t border-foreground/10">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              What you get
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-foreground/80">
                <Zap className="w-4 h-4 text-cyan-400" />
                Unlimited training sessions
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground/80">
                <Zap className="w-4 h-4 text-cyan-400" />
                Detailed performance analytics
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground/80">
                <Zap className="w-4 h-4 text-cyan-400" />
                Progress tracking over time
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Premium Discord members get instant access.{' '}
          <a
            href="https://discord.gg/your-server"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:underline"
          >
            Join our Discord
          </a>
        </p>
      </div>
    </div>
  );
}
