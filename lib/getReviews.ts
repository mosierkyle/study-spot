import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export const getReviews = cache(async (id: string) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        studySpotId: id,
      },
    });
    return reviews;
  } catch (error) {
    console.log(error);
  }
});
