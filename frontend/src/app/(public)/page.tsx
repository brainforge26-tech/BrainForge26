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
    fetchHomepageContent(),
    fetchPricingPlans(),
    fetchSpecializedServices(),
    fetchPublicProjects(),
  ]);

  return (
    <div className="relative bg-[#09090B]">
      <SectionStack isHero>
        <HeroSection content={content.hero} />
      </SectionStack>

      <SectionStack>
        <StatsSection />
      </SectionStack>

      <SectionStack id="services">
        <ServicesSection initialServices={services} />
      </SectionStack>

      <SectionStack id="features">
        <FeaturesSection />
      </SectionStack>

      <SectionStack id="projects" disableSticky>
        <ProjectsSection projects={projects} />
      </SectionStack>

      <SectionStack id="pricing" disableSticky>
        <PricingSection plans={pricingPlans} />
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
