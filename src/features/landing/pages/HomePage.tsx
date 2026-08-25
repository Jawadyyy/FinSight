import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Sparkles, Target, Wallet } from 'lucide-react';
import DotGrid from '@/components/DotGrid';

const BRAND = '#644fef';

/**
 * The hero visual: the product's own output, fanned like a hand of cards.
 * FinSight does not issue cards — what it hands you is a pile of statement
 * lines already sorted, so that is what the arc shows.
 */
const FANNED = [
  { merchant: 'FOODPANDA', amount: '1,850', category: 'Food', tint: '#eb6834' },
  { merchant: 'IESCO', amount: '8,920', category: 'Bills', tint: '#e34948' },
  { merchant: 'NETFLIX', amount: '2,500', category: 'Entertainment', tint: '#e87ba4' },
  { merchant: 'SHELL', amount: '5,780', category: 'Transport', tint: '#2a78d6' },
  { merchant: 'DARAZ.PK', amount: '3,299', category: 'Shopping', tint: '#4a3aa7' },
];

const NAV = [
  { label: 'How it works', href: '#how' },
  { label: 'Features', href: '#features' },
];

const FEATURES = [
  {
    icon: FileText,
    title: 'Reads messy statements',
    body: 'CSV and PDF, mixed date formats, multi-line rows, reference numbers glued to amounts. It handles the statements banks actually produce.',
  },
  {
    icon: Sparkles,
    title: 'Categorizes automatically',
    body: 'Known merchants match instantly. Everything else goes to AI, with a confidence score on each answer. You can correct any of it, and your correction sticks.',
  },
  {
    icon: Target,
    title: 'Budgets that track pace',
    body: 'Set a monthly limit per category and see spending against how far through the month you are, not just a running total.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ---------- Hero ---------- */}
      <div className="relative overflow-hidden" style={{ backgroundColor: BRAND }}>
        {/* Dot field sits furthest back. Colours are two steps of the brand
            rather than white, so it reads as texture until the cursor lights
            it up — the hero copy has to stay the loudest thing here. */}
        <div className="pointer-events-none absolute inset-0">
          <DotGrid
            dotSize={4}
            gap={22}
            baseColor="#7b68f5"
            activeColor="#ffffff"
            proximity={130}
            shockRadius={240}
            shockStrength={4}
            resistance={750}
            returnDuration={1.5}
          />
        </div>

        {/* Depth without a gradient wash: one soft light source, top centre. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0.22), transparent 60%)',
          }}
          aria-hidden
        />

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

        <div className="relative mx-auto max-w-3xl px-6 pt-16 text-center sm:pt-20">
          <p className="rise text-sm font-semibold tracking-wide text-white/75">
            Upload. Sorted. Understood.
          </p>

          <h1
            className="rise font-display mt-5 text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl"
            style={{ animationDelay: '60ms' }}
          >
            Know where your
            <br />
            money actually goes.
          </h1>

          <p
            className="rise mx-auto mt-5 max-w-xl text-base text-white/75 sm:text-lg"
            style={{ animationDelay: '120ms' }}
          >
            Upload a bank statement. FinSight reads every line, sorts it into
            categories, and shows you what you are really spending.
          </p>

          <div
            className="rise mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '180ms' }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-[#3a2bb8] shadow-sm hover:bg-white/90"
            >
              <Link to="/register">Get started free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href="#how">See how it works</a>
            </Button>
          </div>
        </div>

        {/* The signature: parsed transactions fanned out, cropped by the fold. */}
        <div className="relative mx-auto mt-16 h-[260px] max-w-4xl sm:h-[300px]" aria-hidden>
          {FANNED.map((row, i) => {
            const middle = (FANNED.length - 1) / 2;
            const offset = i - middle;
            return (
              // Two elements on purpose: the wrapper holds the fan position,
              // the card holds the entrance. A keyframe that animates transform
              // outranks an inline transform, so one element cannot do both —
              // the cards would stack in the centre instead of fanning out.
              <div
                key={row.merchant}
                // The outermost pair is barely on screen at phone widths, so
                // the fan drops to three rather than showing two slivers.
                className={`absolute left-1/2 top-0 ${
                  Math.abs(offset) === 2 ? 'hidden sm:block' : ''
                }`}
                style={{
                  transform: `translateX(-50%) translateX(${offset * 132}px) translateY(${Math.abs(offset) * 26}px) rotate(${offset * 9}deg)`,
                  zIndex: 10 - Math.abs(offset),
                }}
              >
              <article
                className="deal w-[186px] rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md sm:w-[210px]"
                style={{ animationDelay: `${240 + i * 70}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-white/60">
                    Aug 2026
                  </span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: row.tint }}
                  />
                </div>

                <p className="font-display mt-6 text-2xl font-bold text-white">
                  {row.amount}
                </p>
                <p className="text-[11px] font-medium text-white/55">PKR</p>

                <p className="mt-5 truncate text-sm font-semibold text-white">
                  {row.merchant}
                </p>
                <span
                  className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: row.tint }}
                >
                  {row.category}
                </span>
              </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- How it works ---------- */}
      <section id="how" className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="font-display text-center text-3xl font-bold sm:text-4xl">
          Three steps, then it is done
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
          The work is in reading the statement. FinSight does that part.
        </p>

        {/* Numbered because this genuinely is a sequence. */}
        <ol className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            { step: '01', title: 'Upload a statement', body: 'Drop in a CSV or PDF from your bank. Duplicates from a re-upload are skipped.' },
            { step: '02', title: 'It gets sorted', body: 'Every row is parsed, matched to a merchant, and given a category you can change.' },
            { step: '03', title: 'See the picture', body: 'Budgets, spending by category, trends, and what you actually saved.' },
          ].map((item) => (
            <li key={item.step}>
              <span
                className="font-display text-sm font-bold"
                style={{ color: BRAND }}
              >
                {item.step}
              </span>
              <Separator className="my-3" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className="bg-muted/40 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-center text-3xl font-bold sm:text-4xl">
            Built for statements from real banks
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${BRAND}1a`, color: BRAND }}
                  >
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Closing ---------- */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div
          className="rounded-3xl px-8 py-14 text-center"
          style={{ backgroundColor: BRAND }}
        >
          <Badge className="bg-white/15 text-white hover:bg-white/15">
            Free to start
          </Badge>
          <h2 className="font-display mx-auto mt-5 max-w-lg text-3xl font-bold text-white sm:text-4xl">
            Your last statement is still unread.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/75">
            Upload it and see where the month went.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-7 bg-white text-[#3a2bb8] hover:bg-white/90"
          >
            <Link to="/register">Create your account</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" style={{ color: BRAND }} />
            <span className="font-medium text-foreground">FinSight</span>
          </div>
          <p>Personal finance, without the spreadsheet.</p>
        </div>
      </footer>
    </div>
  );
}
