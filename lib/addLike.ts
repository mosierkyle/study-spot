import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export const addLike = cache(async (prev: number, id: string) => {
  const newNum = prev + 1;
  try {
    const updatedReview = await prisma.review.update({
      where: {
        id: id,
      },
      data: {
        likes: newNum,
      },
    });
    return updatedReview;
  } catch (error) {
    console.error('Error adding like:', error);
    throw error;
  }
});
