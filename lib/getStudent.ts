import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export const getStudent = cache(async (id: string) => {
  try {
    const student = await prisma.user.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    return student;
  } catch (error) {
    console.log(error);
  }
});
