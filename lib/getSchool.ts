import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { get } from 'http';

export const getSchool = cache(async (id: string) => {
  console.log(id);
  try {
    const school = await prisma.school.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    console.log(school);
    return school;
  } catch (error) {
    console.log(error);
  }
});
