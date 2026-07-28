import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('Admin@1234', 12);
  
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@uniintern.com' },
  });

  if (existing) {
    console.log('Admin already exists:', existing.role);
    await prisma.$disconnect();
    return;
  }

  const admin = await prisma.user.create({
    data: {
      email: 'admin@uniintern.com',
      password: hashed,
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
    },
  });

  console.log('Admin created successfully:', admin.email);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});