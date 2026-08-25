import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DotGrid from '@/components/DotGrid';
import { BRAND } from './landing-data';
import { LandingNav } from './LandingNav';
import { FannedCards } from './FannedCards';

/** The purple hero: animated dot field, headline, CTAs, and the fanned cards. */
export function Hero() {
  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: BRAND }}>
      {/* Dot field sits furthest back. Colours are two steps of the brand
          rather than white, so it reads as texture until the cursor lights it
          up — the hero copy has to stay the loudest thing here. */}
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

      <LandingNav />

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

      <FannedCards />
    </div>
  );
}
