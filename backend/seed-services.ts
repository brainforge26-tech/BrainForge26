import { prisma } from './src/config/database';

async function main() {
  const existing = await prisma.specializedService.count();
  if (existing > 0) {
    console.log(`Services already seeded (${existing} found), skipping.`);
    return;
  }
  await prisma.specializedService.createMany({
    data: [
      {
        icon: 'Globe', title: 'Website', order: 0,
        features: ['Customized Design', 'SEO/GEO Optimized', 'Google Analytics', 'Performance Optimized', 'Scalable Architecture', 'AI Agent Integration', 'Payment Integration', 'Secure Systems', 'Responsive Design'],
      },
      {
        icon: 'Smartphone', title: 'Mobile App', order: 1,
        features: ['Real-Time Features', 'Scalable Architecture', 'API Integration', 'Offline Support', 'Smooth Performance', 'Multi-Platform Support', 'App Testing', 'Secure Authentication', 'Store Deployment'],
      },
      {
        icon: 'Cpu', title: 'AI/ML', order: 2,
        features: ['AI Strategy', 'ML Models', 'NLP Systems', 'AI Agents', 'Process Automation', 'Data Pipelines', 'Predictive Analytics', 'Model Optimization', 'MLOps Deployment'],
      },
      {
        icon: 'Palette', title: 'UI/UX Design', order: 3,
        features: ['User Research', 'Journey Mapping', 'Information Architecture', 'Wireframe Design', 'Interactive Prototypes', 'Visual Interface', 'Design Usability', 'Testing', 'Conversion Optimization'],
      },
    ],
  });
  console.log('✅ 4 specialized services seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

