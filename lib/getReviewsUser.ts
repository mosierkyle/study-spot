import { prisma } from '@/lib/prisma';
import { cache } from 'react';

const getReviewsUser = cache(async (id: string) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        authorId: id,
      },
    });
    return reviews;
  } catch (error) {
    console.log(error);
  }
});

export default getReviewsUser;
