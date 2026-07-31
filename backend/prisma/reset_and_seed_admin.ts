import 'dotenv/config';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/config/database';

async function resetAndSeedAdmin() {
  console.log('🧹 [Production Cleanup] Purging all demo data...');

  // 1. Delete all dependent records in cascading sequence
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

  console.log('✅ Demo data purged successfully.');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Super Admin Account
  const adminEmail = 'admin@brainforge26.tech';
  await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
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

  // 3. Manager Account
  const managerEmail = 'manager@brainforge26.tech';
  await prisma.user.create({
    data: {
      email: managerEmail,
      passwordHash,
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

  console.log('==================================================');
  console.log('🎉 Production Setup Complete!');
  console.log(`Admin:   ${adminEmail} (password: password123)`);
  console.log(`Manager: ${managerEmail} (password: password123)`);
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
