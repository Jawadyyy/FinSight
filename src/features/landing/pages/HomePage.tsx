import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { FeatureGrid } from '../components/FeatureGrid';
import { ClosingCta } from '../components/ClosingCta';
import { LandingFooter } from '../components/LandingFooter';

/**
 * The public landing page. Each section is its own component under
 * ../components; this file just orders them down the page.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <HowItWorks />
      <FeatureGrid />
      <ClosingCta />
      <LandingFooter />
    </div>
  );
}
