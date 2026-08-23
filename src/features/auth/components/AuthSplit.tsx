import { Link } from 'react-router-dom';
import { ArrowLeft, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BRAND = '#644fef';

/**
 * The split auth layout. `panel` decides which side the coloured half sits on,
 * so login and register mirror each other.
 *
 * The panel's job is to send you to the other page — that is why it carries the
 * cross-link. It is hidden below lg, so `footer` repeats that link for phones.
 */
export default function AuthSplit({
  panel = 'right',
  title,
  panelTitle,
  panelBody,
  panelCta,
  children,
  footer,
}: {
  panel?: 'left' | 'right';
  title: string;
  panelTitle: string;
  panelBody: string;
  panelCta: { label: string; to: string };
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    // The split is a card on the page, not the page itself — the surrounding
    // ground keeps it feeling like one contained object.
    <div className="flex min-h-screen items-center justify-center bg-muted/60 p-4 sm:p-8">
      <div
        className={`grid w-full max-w-4xl overflow-hidden rounded-2xl border bg-white shadow-xl lg:min-h-[560px] lg:grid-cols-2 ${
          panel === 'left' ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        <div className="relative flex items-center justify-center px-6 py-14">
          {/* Sits in the form column rather than the card corner, so it stays
              on the white half when register mirrors the layout. */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="absolute left-4 top-4 text-muted-foreground"
          >
            <Link to="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Home
            </Link>
          </Button>

          <div className="w-full max-w-sm">
            <h1 className="text-center font-display text-3xl font-bold tracking-tight">
              {title}
            </h1>

            {children}

            <div className="mt-6 text-center text-sm text-muted-foreground lg:hidden">
              {footer}
            </div>
          </div>
        </div>

        <div
          className="relative hidden flex-col items-center justify-center px-12 text-center lg:flex"
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

          <div className="relative">
            <span className="mx-auto mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <Wallet className="h-6 w-6 text-white" />
            </span>

            <h2 className="font-display text-3xl font-bold text-white">{panelTitle}</h2>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/75">
              {panelBody}
            </p>

            <Button
              asChild
              variant="outline"
              className="mt-8 rounded-full border-white/70 bg-transparent px-10 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white hover:text-[#644fef]"
            >
              <Link to={panelCta.to}>{panelCta.label}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
