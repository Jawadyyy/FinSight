import { Card, CardContent } from '@/components/ui/card';
import { BRAND, FEATURES } from './landing-data';

/** The three feature cards. */
export function FeatureGrid() {
  return (
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
  );
}
