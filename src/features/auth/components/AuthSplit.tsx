import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

const BRAND = '#644fef';

const SLIDES = [
  {
    title: 'Every statement, read for you',
    body: 'CSV or PDF, mixed date formats, multi-line rows. It handles what banks actually send.',
  },
  {
    title: 'Sorted before you look',
    body: 'Merchants matched, categories assigned, and any correction you make is remembered.',
  },
  {
    title: 'Know your month early',
    body: 'Budgets track spending against how far through the month you are, not just a total.',
  },
];

/** A few rows of the product, rendered in glass — the panel's illustration. */
const PREVIEW = [
  { merchant: 'FOODPANDA', amount: '1,850', category: 'Food', tint: '#eb6834' },
  { merchant: 'IESCO', amount: '8,920', category: 'Bills', tint: '#e34948' },
  { merchant: 'NETFLIX', amount: '2,500', category: 'Entertainment', tint: '#e87ba4' },
];

function Panel() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    // Auto-advance is motion; readers who opted out choose their own slide.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between"
      style={{ backgroundColor: BRAND }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 60% at 50% 0%, rgba(255,255,255,0.20), transparent 65%)',
        }}
        aria-hidden
      />

      <div className="relative flex flex-1 items-center justify-center p-10">
        {/* Glass slab holding a slice of the dashboard. */}
        <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
              August 2026
            </span>
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white">
              Sorted
            </span>
          </div>

          <p className="mt-6 text-3xl font-bold text-white">PKR 117,884</p>
          <p className="text-xs text-white/60">spent across 20 transactions</p>

          {/* The pace bar, the same idea the dashboard opens on. */}
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[72%] rounded-full bg-white/85" />
          </div>
          <p className="mt-1.5 text-[11px] text-white/60">72% of budget · day 19 of 31</p>

          <div className="mt-6 space-y-2.5">
            {PREVIEW.map((row) => (
              <div
                key={row.merchant}
                className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-6 w-1 rounded-full"
                    style={{ backgroundColor: row.tint }}
                  />
                  <div>
                    <p className="text-xs font-semibold text-white">{row.merchant}</p>
                    <p className="text-[10px] text-white/55">{row.category}</p>
                  </div>
                </div>
                <span className="text-xs font-medium tabular-nums text-white">
                  {row.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative px-10 pb-12">
        <h2 className="font-display text-2xl font-bold text-white">
          {SLIDES[slide].title}
        </h2>
        <p className="mt-2 max-w-md text-sm text-white/70">{SLIDES[slide].body}</p>

        {/* Real controls, not decoration — each dot selects its slide. */}
        <div className="mt-6 flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setSlide(i)}
              aria-label={`Show: ${s.title}`}
              aria-current={i === slide}
              className={`h-2 rounded-full transition-all ${
                i === slide ? 'w-7 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The split auth layout. `panel` decides which side the purple half sits on,
 * so login and register mirror each other.
 */
export default function AuthSplit({
  panel = 'right',
  title,
  subtitle,
  children,
  footer,
}: {
  panel?: 'left' | 'right';
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    // The split is a card on the page, not the page itself — the surrounding
    // ground keeps it feeling like one contained object.
    <div className="flex min-h-screen items-center justify-center bg-muted/60 p-4 sm:p-8">
      <div
        className={`grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-white shadow-xl lg:min-h-[620px] lg:grid-cols-2 ${
          panel === 'left' ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        <div className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
          <Link to="/" className="mx-auto mb-8 flex w-fit items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: BRAND }}
            >
              <Wallet className="h-5 w-5 text-white" />
            </span>
            <span className="font-display text-lg font-bold">FinSight</span>
          </Link>

          <div className="mb-7 text-center">
            <h1 className="font-display text-2xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}

            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          </div>
        </div>

        <Panel />
      </div>
    </div>
  );
}
