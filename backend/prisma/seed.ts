import 'dotenv/config';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/database';

async function main() {
  console.log('🌱 Starting database seed...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Admin
  const adminEmail = 'admin@brainforceit.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN,
        isActive: true,
        adminProfile: {
          create: {
            firstName: 'Super',
            lastName: 'Admin',
          },
        },
      },
    });
    console.log('✅ Created Admin user');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // 2. Manager
  const managerEmail = 'manager@brainforceit.com';
  const existingManager = await prisma.user.findUnique({ where: { email: managerEmail } });
  if (!existingManager) {
    await prisma.user.create({
      data: {
        email: managerEmail,
        passwordHash,
        role: Role.MANAGER,
        isActive: true,
        managerProfile: {
          create: {
            firstName: 'Project',
            lastName: 'Manager',
            department: 'Engineering',
          },
        },
      },
    });
    console.log('✅ Created Manager user');
  } else {
    console.log('ℹ️ Manager user already exists');
  }

  // 3. Developer
  const devEmail = 'developer@brainforceit.com';
  const existingDev = await prisma.user.findUnique({ where: { email: devEmail } });
  if (!existingDev) {
    await prisma.user.create({
      data: {
        email: devEmail,
        passwordHash,
        role: Role.DEVELOPER,
        isActive: true,
        developerProfile: {
          create: {
            firstName: 'Alex',
            lastName: 'Carter',
            title: 'Full-Stack Developer',
            skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
          },
        },
      },
    });
    console.log('✅ Created Developer user');
  } else {
    console.log('ℹ️ Developer user already exists');
  }

  // 4. Client
  const clientEmail = 'client@brainforceit.com';
  const existingClient = await prisma.user.findUnique({ where: { email: clientEmail } });
  if (!existingClient) {
    await prisma.user.create({
      data: {
        email: clientEmail,
        passwordHash,
        role: Role.CLIENT,
        isActive: true,
        clientProfile: {
          create: {
            companyName: 'Acme Corp',
            contactPerson: 'John Doe',
          },
        },
      },
    });
    console.log('✅ Created Client user');
  } else {
    console.log('ℹ️ Client user already exists');
  }

  // 5. Seed Pricing Plans
  console.log('Seeding Pricing Plans...');
  await prisma.pricingPlan.deleteMany(); // Reset for clean seed
  await prisma.pricingPlan.createMany({
    data: [
      {
        name: 'Starter',
        description: 'Perfect for small projects and MVPs',
        price: 999,
        billingCycle: 'one-time',
        features: ['UI/UX Design', 'Frontend Development', 'Basic Backend API', '1 Month Support'],
        isPopular: false,
        order: 1,
      },
      {
        name: 'Professional',
        description: 'Ideal for growing businesses and startups',
        price: 2499,
        billingCycle: 'one-time',
        features: ['Advanced UI/UX', 'Full-Stack Development', 'Cloud Architecture', '3 Months Support', 'SEO Optimization'],
        isPopular: true,
        order: 2,
      },
      {
        name: 'Enterprise',
        description: 'For large scale custom applications',
        price: 4999,
        billingCycle: 'monthly',
        features: ['Dedicated Team', 'Microservices Architecture', 'SLA Guarantee', '24/7 Priority Support', 'DevOps & CI/CD'],
        isPopular: false,
        order: 3,
      }
    ]
  });
  console.log('✅ Created Pricing Plans');

  // 6. Seed Homepage Content
  console.log('Seeding Homepage Content...');
  await prisma.homepageContent.deleteMany();
  await prisma.homepageContent.createMany({
    data: [
      {
        section: 'hero',
        content: {
          title: 'Transforming Ideas into Digital Excellence',
          subtitle: 'We build world-class software solutions for ambitious brands, from concept to deployment.',
          primaryCTA: 'Start a Project',
          secondaryCTA: 'View Our Work'
        }
      },
      {
        section: 'about',
        content: {
          title: 'Who We Are',
          description: 'BrainForceIT is a premium agency dedicated to delivering high-performance, scalable software solutions.'
        }
      }
    ]
  });
  console.log('✅ Created Homepage Content');

  // 7. Seed Testimonials
  console.log('Seeding Testimonials...');
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        clientName: 'Sarah Jenkins',
        company: 'TechStart Inc.',
        text: 'BrainForceIT completely revolutionized our internal tools. The team is professional, fast, and incredibly talented.',
        rating: 5,
        order: 1
      },
      {
        clientName: 'David Chen',
        company: 'Global Retail',
        text: 'The best agency we have ever worked with. They delivered our e-commerce platform ahead of schedule.',
        rating: 5,
        order: 2
      }
    ]
  });
  console.log('✅ Created Testimonials');

  // 8. Seed Projects
  console.log('Seeding Projects...');
  const clientUser = await prisma.user.findUnique({ where: { email: clientEmail }, include: { clientProfile: true } });
  const managerUser = await prisma.user.findUnique({ where: { email: managerEmail } });
  const devUser = await prisma.user.findUnique({ where: { email: devEmail } });
  
  if (clientUser && managerUser && devUser) {
    await prisma.project.create({
      data: {
        name: 'E-Commerce Platform Rebuild',
        description: 'A complete overhaul of the existing e-commerce platform.',
        status: 'ACTIVE',
        completionPercent: 65,
        priority: 'HIGH',
        clientId: clientUser.clientProfile.id,
        managerId: managerUser.id,
        budget: 15000,
        estimatedDelivery: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // +30 days
        technologies: ['Next.js', 'PostgreSQL', 'TailwindCSS'],
        developers: {
          create: [
            { userId: devUser.id }
          ]
        }
      }
    });

    await prisma.project.create({
      data: {
        name: 'Mobile Application MVP',
        description: 'First version of the mobile app for iOS and Android.',
        status: 'PENDING',
        completionPercent: 10,
        priority: 'MEDIUM',
        clientId: clientUser.clientProfile.id,
        managerId: managerUser.id,
        budget: 20000,
        estimatedDelivery: new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000), // +60 days
        technologies: ['React Native', 'Node.js', 'MongoDB'],
      }
    });

    await prisma.project.create({
      data: {
        name: 'Landing Page Redesign',
        description: 'High-converting landing page for new product launch.',
        status: 'COMPLETED',
        completionPercent: 100,
        priority: 'LOW',
        clientId: clientUser.clientProfile.id,
        managerId: managerUser.id,
        budget: 5000,
        estimatedDelivery: new Date(),
        technologies: ['Framer Motion', 'React'],
      }
    });
    console.log('✅ Created Projects');
  }

  console.log('🎉 Seeding complete!');
  console.log('----------------------------------------------------');
  console.log('Credentials (Password for all: password123)');
  console.log(`Admin:     ${adminEmail}`);
  console.log(`Manager:   ${managerEmail}`);
  console.log(`Developer: ${devEmail}`);
  console.log(`Client:    ${clientEmail}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
