import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export const getSpot = cache(async (id: string) => {
  try {
    const spots = await prisma.studySpot.findMany({
      where: {
        schoolId: id,
      },
    });
    return spots;
  } catch (error) {
    console.log(error);
  }
});
