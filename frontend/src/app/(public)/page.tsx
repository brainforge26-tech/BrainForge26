import { HeroSection }     from '@/features/homepage/HeroSection';
import { StatsSection }    from '@/features/homepage/StatsSection';
import { ServicesSection } from '@/features/homepage/ServicesSection';
import { FeaturesSection } from '@/features/homepage/FeaturesSection';
import { ProjectsSection } from '@/features/homepage/ProjectsSection';
import { PricingSection }  from '@/features/homepage/PricingSection';
import { TeamSection }     from '@/features/homepage/TeamSection';
import { CTASection }      from '@/features/homepage/CTASection';
import { SectionStack }    from '@/components/layout/SectionStack';
import { fetchHomepageContent, fetchPricingPlans, fetchSpecializedServices, fetchPublicProjects } from '@/features/homepage/homepage.actions';

export default async function HomePage() {
  const [content, pricingPlans, services, projects] = await Promise.all([
    fetchHomepageContent().catch(() => ({})),
    fetchPricingPlans().catch(() => []),
    fetchSpecializedServices().catch(() => []),
    fetchPublicProjects().catch(() => []),
  ]);

  const safeContent = content || {};
  const safePricingPlans = Array.isArray(pricingPlans) ? pricingPlans : [];
  const safeServices = Array.isArray(services) ? services : [];
  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <div className="relative bg-[#09090B]">
      <SectionStack isHero>
        <HeroSection content={safeContent.hero} />
      </SectionStack>

      <SectionStack>
        <StatsSection />
      </SectionStack>

      <SectionStack id="services">
        <ServicesSection initialServices={safeServices} />
      </SectionStack>

      <SectionStack id="features">
        <FeaturesSection />
      </SectionStack>

      <SectionStack id="projects" disableSticky>
        <ProjectsSection projects={safeProjects} />
      </SectionStack>

      <SectionStack id="pricing" disableSticky>
        <PricingSection plans={safePricingPlans} />
      </SectionStack>

      <SectionStack id="team">
        <TeamSection />
      </SectionStack>

      <SectionStack id="contact">
        <CTASection />
      </SectionStack>
    </div>
  );
}
