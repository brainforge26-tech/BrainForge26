import { fetchServices } from '@/features/manager/manager.actions';
import { ServicesClient } from '@/features/manager/ServicesClient';

export default async function AdminServicesPage() {
  const services = await fetchServices();
  return <ServicesClient initialServices={services} />;
}
