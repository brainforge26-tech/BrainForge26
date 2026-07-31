'use server';

import { publicFetch } from '@/lib/api';

export async function fetchHomepageContent() {
  try {
    const res = await publicFetch<{ data: any }>('/homepage/content');
    return res?.data || {};
  } catch (error) {
    console.error('Failed to fetch homepage content:', error);
    return {};
  }
}

export async function fetchSpecializedServices() {
  try {
    const res = await publicFetch<any>('/services?active=true');
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.services)) return data.services;
    return [];
  } catch (error) {
    console.error('Failed to fetch specialized services:', error);
    return [];
  }
}

export async function fetchTestimonials() {
  try {
    const res = await publicFetch<any>('/homepage/testimonials');
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.testimonials)) return data.testimonials;
    return [];
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return [];
  }
}

export async function fetchPricingPlans() {
  try {
    const res = await publicFetch<any>('/pricing');
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.pricingPlans)) return data.pricingPlans;
    if (Array.isArray(data?.plans)) return data.plans;
    return [];
  } catch (error) {
    console.error('Failed to fetch pricing plans:', error);
    return [];
  }
}

export async function fetchPublicProjects() {
  try {
    const res = await publicFetch<any>('/projects/public');
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.projects)) return data.projects;
    return [];
  } catch (error) {
    console.error('Failed to fetch public projects:', error);
    return [];
  }
}

export async function submitApplicationAction(prevState: any, formData: FormData) {
  try {
    const raw = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      skills: (formData.get('skills') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
      experience: Number(formData.get('experience')),
      linkedinUrl: formData.get('linkedinUrl') || undefined,
      portfolioUrl: formData.get('portfolioUrl') || undefined,
    };

    const res = await publicFetch<{ success: boolean; message: string }>('/hiring/apply', {
      method: 'POST',
      body: raw
    });

    if (!res?.success) throw new Error(res?.message || 'Failed to submit application');
    return { success: true, message: 'Application submitted successfully! We will be in touch.' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
