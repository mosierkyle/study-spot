import { prisma } from '@/lib/prisma';
import type { Review, Save } from '@prisma/client';

interface CreateSaveProps {
  studentId: string;
  studySpotId: string;
}

const createReview = async (props: CreateSaveProps): Promise<Save> => {
  const { studentId, studySpotId } = props;

  // Check if a review already exists for the same author and study spot
  const existingSave = await prisma.save.findFirst({
    where: {
      studentId: studentId,
      studySpotId: studySpotId,
    },
  });

  if (existingSave) {
    throw new Error('A review already exists for this author and study spot');
  }

  // Create the review
  const save = await prisma.save.create({
    data: {
      studentId: studentId,
      studySpotId: studySpotId,
    },
  });

  // Find the corresponding study spot and update its review count
  return save;
};

export default createReview;
