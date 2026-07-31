import 'dotenv/config';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/database';

async function main() {
  console.log('🧹 [Production Seed] Purging all demo data...');

  // 1. Wipe all demo records
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.projectFile.deleteMany();
  await prisma.progressUpdate.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.timelineStage.deleteMany();
  await prisma.projectDeveloper.deleteMany();
  await prisma.project.deleteMany();
  await prisma.hiringApplication.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.managerProfile.deleteMany();
  await prisma.developerProfile.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Demo data purged.');

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // 2. Create Super Admin Account
  const adminEmail = 'admin@brainforge26.tech';
  await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash: defaultPasswordHash,
      role: Role.ADMIN,
      isActive: true,
      isVerified: true,
      adminProfile: {
        create: {
          firstName: 'Super',
          lastName: 'Admin',
        },
      },
    },
  });
  console.log(`✅ Super Admin created: ${adminEmail}`);

  // 3. Create Manager Account
  const managerEmail = 'manager@brainforge26.tech';
  await prisma.user.create({
    data: {
      email: managerEmail,
      passwordHash: defaultPasswordHash,
      role: Role.MANAGER,
      isActive: true,
      isVerified: true,
      managerProfile: {
        create: {
          firstName: 'Operations',
          lastName: 'Manager',
          department: 'Engineering',
        },
      },
    },
  });
  console.log(`✅ Manager created: ${managerEmail}`);

  // 4. Seed Production Baseline Pricing Plans
  await prisma.pricingPlan.deleteMany();
  await prisma.pricingPlan.createMany({
    data: [
      {
        name: 'MVP Launch',
        description: 'For startups looking to validate their core product idea rapidly.',
        price: 1499,
        billingCycle: 'one-time',
        features: [
          'Custom UI/UX Prototype',
          'Responsive Next.js Frontend',
          'Express & Node.js Backend API',
          'PostgreSQL Database Architecture',
          '1 Month Dedicated Maintenance',
        ],
        isPopular: false,
        order: 1,
      },
      {
        name: 'Growth Solution',
        description: 'Ideal for scaling businesses requiring robust web and API infrastructure.',
        price: 3499,
        billingCycle: 'one-time',
        features: [
          'Custom Design System & UI',
          'Full-Stack Cloud Solution',
          'Realtime WebSockets & Notifications',
          'CI/CD Automated Deployment',
          'SEO & Performance Optimization',
          '3 Months Dedicated Support',
        ],
        isPopular: true,
        order: 2,
      },
      {
        name: 'Enterprise Scale',
        description: 'High-availability microservices and custom software architecture.',
        price: 6999,
        billingCycle: 'monthly',
        features: [
          'Dedicated Development Team',
          'Scalable Microservices Architecture',
          'Custom Security & Compliance SLA',
          '24/7 Priority Support & Monitoring',
          'DevOps Infrastructure Engineering',
        ],
        isPopular: false,
        order: 3,
      },
    ],
  });
  console.log('✅ Baseline Pricing Plans seeded.');

  // 5. Seed Production Baseline Services
  await prisma.specializedService.deleteMany();
  await prisma.specializedService.createMany({
    data: [
      {
        icon: 'Globe',
        title: 'Web Application Development',
        features: [
          'Custom Next.js & React Architectures',
          'High Performance & SEO Optimized',
          'Scalable RESTful & GraphQL APIs',
        ],
        order: 1,
      },
      {
        icon: 'Smartphone',
        title: 'Mobile App Development',
        features: [
          'Cross-Platform iOS & Android Apps',
          'Native Performance & UI Animations',
          'Offline Sync & Cloud Backends',
        ],
        order: 2,
      },
      {
        icon: 'Cpu',
        title: 'Cloud Architecture & DevOps',
        features: [
          'AWS & VPS Infrastructure Setup',
          'CI/CD Pipeline Automation',
          'Containerization & Kubernetes',
        ],
        order: 3,
      },
      {
        icon: 'ShieldCheck',
        title: 'Enterprise Software Engineering',
        features: [
          'Custom ERP & CRM Platforms',
          'High Security & Compliance Assurance',
          'Legacy Migration & Refactoring',
        ],
        order: 4,
      },
    ],
  });
  console.log('✅ Baseline Specialized Services seeded.');

  // 6. Seed Baseline Homepage CMS Content
  await prisma.homepageContent.deleteMany();
  await prisma.homepageContent.createMany({
    data: [
      {
        section: 'hero',
        content: {
          title: 'Transforming Ideas into Digital Excellence',
          subtitle: 'We engineer high-performance web applications, cloud architectures, and digital products for ambitious enterprises.',
          primaryCTA: 'Start Your Project',
          secondaryCTA: 'Explore Services',
        },
      },
      {
        section: 'about',
        content: {
          title: 'Who We Are',
          description: 'BrainForge26 is a premium technology studio delivering scalable software, modern user interfaces, and robust cloud systems.',
        },
      },
    ],
  });
  console.log('✅ Baseline Homepage CMS content seeded.');

  console.log('----------------------------------------------------');
  console.log('🎉 Production Seed Complete!');
  console.log('Admin:   admin@brainforge26.tech   (password: password123)');
  console.log('Manager: manager@brainforge26.tech (password: password123)');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
