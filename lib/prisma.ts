import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL, // Use process.env to access environment variables
    },
  },
});

export default prisma;
