import { ApplyClient } from './ApplyClient';

export default function ApplyPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="section-wrapper max-w-3xl">
        <h1 className="text-3xl font-extrabold mb-2 text-center">Join Our Team</h1>
        <p className="text-[#AAB3C5] mb-8 text-center">We're always looking for talented developers to join our elite network.</p>
        <ApplyClient />
      </div>
    </div>
  );
}
