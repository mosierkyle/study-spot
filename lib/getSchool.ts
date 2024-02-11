import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { get } from 'http';

export const getSchool = cache(async (name: string) => {
  const school = await prisma.school.findFirst({
    where: {
      name: name,
    },
  });

  console.log(school);
  return school;
});
