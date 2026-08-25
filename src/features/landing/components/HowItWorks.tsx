import { Separator } from '@/components/ui/separator';
import { BRAND, STEPS } from './landing-data';

/** The three-step "how it works" sequence. */
export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="font-display text-center text-3xl font-bold sm:text-4xl">
        Three steps, then it is done
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
        The work is in reading the statement. FinSight does that part.
      </p>

      {/* Numbered because this genuinely is a sequence. */}
      <ol className="mt-12 grid gap-8 sm:grid-cols-3">
        {STEPS.map((item) => (
          <li key={item.step}>
            <span className="font-display text-sm font-bold" style={{ color: BRAND }}>
              {item.step}
            </span>
            <Separator className="my-3" />
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
