'use server';

import { publicFetch } from '@/lib/api';
import { redirect } from 'next/navigation';

export async function fetchPublicServices() {
  try {
    const res = await publicFetch<any>('/services/public');
    return Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    console.error('Failed to fetch public services:', error);
    return [];
  }
}

export async function fetchFeaturedServices() {
  try {
    const res = await publicFetch<any>('/services/public?featured=true');
    return Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    console.error('Failed to fetch featured services:', error);
    return [];
  }
}

export async function fetchPublicServiceCategories() {
  try {
    const res = await publicFetch<any>('/services/categories');
    return Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    console.error('Failed to fetch public service categories:', error);
    return [];
  }
}

export async function fetchPublicProjects() {
  try {
    const res = await publicFetch<any>('/portfolio/public');
    return Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    console.error('Failed to fetch public portfolio projects:', error);
    return [];
  }
}

export async function fetchPublicTeam() {
  try {
    const res = await publicFetch<any>('/team/public');
    return Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    console.error('Failed to fetch public team members:', error);
    return [];
  }
}

export async function fetchPublicTechnologies() {
  try {
    const res = await publicFetch<any>('/technologies/public');
    return Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    console.error('Failed to fetch public technologies:', error);
    return [];
  }
}

export async function fetchPublicTestimonials() {
  try {
    const res = await publicFetch<any>('/testimonials/public');
    return Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    console.error('Failed to fetch public testimonials:', error);
    return [];
  }
}

export async function fetchPublicFaqs() {
  try {
    const res = await publicFetch<any>('/faqs/public');
    return Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    console.error('Failed to fetch public faqs:', error);
    return [];
  }
}

export async function fetchPublicClients() {
  try {
    const res = await publicFetch<any>('/clients/public');
    return Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    console.error('Failed to fetch public clients:', error);
    return [];
  }
}

export async function fetchSiteSettings() {
  try {
    const res = await publicFetch<any>('/site-settings/public');
    const raw = res?.data || {};

    const general = raw.general || {};
    const hero = raw.hero || {};

    return {
      raw,
      general,
      hero,
      companyName: general.companyName || 'BrainForge26 Software Ltd.',
      siteName: general.companyName || 'BrainForge26 Software Ltd.',
      tagline: general.tagline || 'Enterprise Software & AI Solutions Company',
      contactEmail: general.contactEmail || 'contact@brainforge26.tech',
      contactPhone: general.contactPhone || '+880 1818 293 914',
      address: general.address || 'Level 12, Enterprise Tower, Dhaka, Bangladesh',
      workingHours: general.workingHours || '24/7 Technical Support',
      heroHeading: hero.heading || 'Smarter Digital. Stronger Brands.',
      heroSubheading: hero.subheading || 'We design, build, and scale enterprise web platforms, mobile applications, and artificial intelligence solutions.',
      heroBadge: hero.badgeText || 'Elite Software Engineering Agency',
      primaryCtaText: hero.primaryCtaText || 'Start Your Project',
    };
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    return {};
  }
}

export async function submitContactAction(formData: FormData): Promise<void> {
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    service: formData.get('service') || undefined,
    subject: formData.get('subject') || undefined,
    message: formData.get('message'),
  };

  try {
    await publicFetch<{ success: boolean; message: string }>('/contact-messages/submit', {
      method: 'POST',
      body: payload,
    });
  } catch {
    /* ignore error on form submit */
  }

  redirect('/contact?success=true');
}

export async function submitApplicationAction(_prevState: any, formData: FormData) {
  try {
    const raw = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone') || undefined,
      skills: (formData.get('skills') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
      experience: String(formData.get('experience')),
      linkedinUrl: formData.get('linkedinUrl') || undefined,
      portfolioUrl: formData.get('portfolioUrl') || undefined,
    };

    const res = await publicFetch<{ success: boolean; message: string }>('/jobs/applications/apply', {
      method: 'POST',
      body: raw
    });

    if (!res?.success) throw new Error(res?.message || 'Failed to submit application');
    return { success: true, message: 'Application submitted successfully! We will be in touch.' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
