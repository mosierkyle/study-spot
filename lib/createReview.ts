import { prisma } from '@/lib/prisma';
import type { Review } from '@prisma/client';

interface CreateReviewProps {
  content: string;
  rating: number;
  photos: string[];
  authorId: string;
  studySpotId: string;
}

const createReview = async (props: CreateReviewProps): Promise<Review> => {
  const { content, rating, photos, authorId, studySpotId } = props;

  // Check if a review already exists for the same author and study spot
  const existingReview = await prisma.review.findFirst({
    where: {
      authorId: authorId,
      studySpotId: studySpotId,
    },
  });

  if (existingReview) {
    throw new Error('A review already exists for this author and study spot');
  }

  // Create the review
  const review = await prisma.review.create({
    data: {
      content: content,
      rating: rating,
      photos: photos,
      authorId: authorId,
      studySpotId: studySpotId,
    },
  });

  // Find the corresponding study spot and update its review count
  const studySpot = await prisma.studySpot.update({
    where: {
      id: studySpotId,
    },
    data: {
      reviewCount: {
        increment: 1,
      },
    },
  });

  return review;
};

export default createReview;
