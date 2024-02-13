import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { get } from 'http';

export const getSchools = cache(async () => {
  const schools = await prisma.school.findMany();
  return schools;
});
