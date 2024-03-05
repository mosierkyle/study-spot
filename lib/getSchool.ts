import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export const getSchool = cache(async (id: string) => {
  try {
    const school = await prisma.school.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    return school;
  } catch (error) {
    console.log(error);
  }
});
