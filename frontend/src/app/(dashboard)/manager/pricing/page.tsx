import { fetchPricingPlans } from '@/features/manager/manager.actions';
import { PricingClient } from './PricingClient';

export default async function ManagerPricingPage() {
  const plans = await fetchPricingPlans();
  return <PricingClient initialPlans={plans} />;
}
