import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import { Review } from '@prisma/client';

export const updateRating = cache(async (id: string) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        studySpotId: id,
      },
    });
    const averageRating = calculateAverageRating(reviews);

    if (averageRating != 0) {
      const updatedStudySpot = await prisma.studySpot.update({
        where: {
          id: id,
        },
        data: {
          rating: averageRating,
        },
      });

      return updatedStudySpot;
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
  }
});

function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;

  const totalRating = reviews.reduce((acc, review) => {
    if (review.rating !== null) {
      return acc + review.rating;
    }
    return acc;
  }, 0);

  const numberOfRatings = reviews.filter(
    (review) => review.rating !== null
  ).length;

  const averageRating = totalRating / numberOfRatings;

  return Math.round(averageRating * 100) / 100;
}
