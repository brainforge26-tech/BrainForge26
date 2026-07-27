import { fetchHomepageContent, fetchTestimonials } from '@/features/homepage/homepage.actions';
import { HomepageClient } from './HomepageClient';

export default async function ManagerHomepagePage() {
  const content = await fetchHomepageContent();
  const testimonials = await fetchTestimonials();
  
  return <HomepageClient initialContent={content} initialTestimonials={testimonials} />;
}
