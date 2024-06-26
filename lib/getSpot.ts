import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export const getSpot = cache(async (id: string) => {
  try {
    const spot = await prisma.studySpot.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    return spot;
  } catch (error) {
    console.log(error);
  }
});
