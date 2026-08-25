import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BRAND } from './landing-data';

/** The final call-to-action block above the footer. */
export function ClosingCta() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="rounded-3xl px-8 py-14 text-center" style={{ backgroundColor: BRAND }}>
        <Badge className="bg-white/15 text-white hover:bg-white/15">Free to start</Badge>
        <h2 className="font-display mx-auto mt-5 max-w-lg text-3xl font-bold text-white sm:text-4xl">
          Your last statement is still unread.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-white/75">
          Upload it and see where the month went.
        </p>
        <Button asChild size="lg" className="mt-7 bg-white text-[#3a2bb8] hover:bg-white/90">
          <Link to="/register">Create your account</Link>
        </Button>
      </div>
    </section>
  );
}
