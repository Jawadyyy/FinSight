import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAV } from './landing-data';

/** The top bar inside the hero — logo, anchor links, log in / sign up. */
export function LandingNav() {
  return (
    <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
          <Wallet className="h-4 w-4 text-white" />
        </span>
        <span className="font-display text-lg font-bold text-white">FinSight</span>
      </div>

      <nav className="hidden items-center gap-7 md:flex">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          className="text-white hover:bg-white/10 hover:text-white"
        >
          <Link to="/login">Log in</Link>
        </Button>
        <Button asChild className="bg-white text-[#3a2bb8] shadow-sm hover:bg-white/90">
          <Link to="/register">Sign up</Link>
        </Button>
      </div>
    </header>
  );
}
