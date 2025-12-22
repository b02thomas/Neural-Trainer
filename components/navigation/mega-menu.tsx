'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  Brain,
  BarChart3,
  Home,
  Menu,
  X,
  Activity,
  LogIn,
  Shield,
  Wind
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/auth/user-menu';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
    description: 'Back to main page',
  },
  {
    label: 'Training',
    href: '/play',
    icon: Brain,
    description: 'Start neural training session',
  },
  {
    label: 'Meditation',
    href: '/meditate',
    icon: Wind,
    description: 'Breathing & mindfulness exercises',
  },
  {
    label: 'Statistics',
    href: '/stats',
    icon: BarChart3,
    description: 'View your performance data',
  },
];

interface MegaMenuProps {
  className?: string;
}

export function MegaMenu({ className }: MegaMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user and check admin status
    const fetchUserAndRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        setIsAdmin(profile?.role === 'admin');
      }

      setIsLoading(false);
    };

    fetchUserAndRole();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
        setIsAdmin(profile?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className={cn('mega-menu fixed top-0 left-0 right-0 z-50', className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <span className="font-bold text-lg hidden sm:block">
              <span className="text-gradient-purple-cyan">Neural</span>
              <span className="text-muted-foreground ml-1">Trainer</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
            {isAdmin && (
              <NavLink
                item={{
                  label: 'Admin',
                  href: '/admin',
                  icon: Shield,
                  description: 'Manage users and settings',
                }}
              />
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Activity className="w-3 h-3 text-cyan-400 status-indicator" />
              <span className="text-xs text-muted-foreground font-mono">ONLINE</span>
            </div>

            <ThemeToggle />

            {/* Auth: User Menu or Login Button */}
            {!isLoading && (
              user ? (
                <UserMenu />
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg neural-btn"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mega-menu-dropdown mx-4 mb-4"
          >
            <div className="py-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-t border-white/10"
                >
                  <Shield className="w-5 h-5 text-red-400" />
                  <div>
                    <div className="font-medium text-red-400">Admin</div>
                    <div className="text-xs text-muted-foreground">
                      Manage users and settings
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ item }: { item: NavItem }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
          'hover:bg-white/5 text-muted-foreground hover:text-foreground'
        )}
      >
        <item.icon className="w-4 h-4" />
        <span className="text-sm font-medium">{item.label}</span>
      </Link>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && item.description && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 mega-menu-dropdown text-xs text-muted-foreground whitespace-nowrap"
          >
            {item.description}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MegaMenuSpacer() {
  return <div className="h-16" />;
}
