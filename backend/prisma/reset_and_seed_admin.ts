import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/database';
import { Role } from '@prisma/client';

async function resetAndSeedAdmin() {
  console.log('🧹 Clearing all demo data from database...');

  // Delete all dependent records in cascading sequence
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.projectFile.deleteMany();
  await prisma.progressUpdate.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.timelineStage.deleteMany();
  await prisma.projectDeveloper.deleteMany();
  await prisma.project.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.managerProfile.deleteMany();
  await prisma.developerProfile.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ All demo data successfully deleted!');

  // Create Single Official Production Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@brainforge26.tech';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword2026!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
      adminProfile: {
        create: {
          firstName: 'BrainForge',
          lastName: 'Admin',
        },
      },
    },
  });

  console.log('==================================================');
  console.log('🎉 Clean Single Admin Created Successfully!');
  console.log(`Email:    ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log('==================================================');
}

resetAndSeedAdmin()
  .catch((e) => {
    console.error('❌ Failed to reset database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
