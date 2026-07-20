import { HeroSection }     from '@/features/homepage/HeroSection';
import { StatsSection }    from '@/features/homepage/StatsSection';
import { ServicesSection } from '@/features/homepage/ServicesSection';
import { FeaturesSection } from '@/features/homepage/FeaturesSection';
import { ProjectsSection } from '@/features/homepage/ProjectsSection';
import { PricingSection }  from '@/features/homepage/PricingSection';
import { TeamSection }     from '@/features/homepage/TeamSection';
import { CTASection }      from '@/features/homepage/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <FeaturesSection />
      <ProjectsSection />
      <PricingSection />
      <TeamSection />
      <CTASection />
    </>
  );
}
