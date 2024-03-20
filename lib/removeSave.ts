import { prisma } from '@/lib/prisma';
import type { Save } from '@prisma/client';

interface RemoveSaveProps {
  studentId: string;
  studySpotId: string;
}

const removeSave = async (props: RemoveSaveProps): Promise<boolean> => {
  const { studentId, studySpotId } = props;

  // Check if the save entry exists
  const existingSave = await prisma.save.findFirst({
    where: {
      studentId: studentId,
      studySpotId: studySpotId,
    },
  });

  if (!existingSave) {
    return false; // Save entry not found, return false
  }

  // Remove the save entry
  await prisma.save.delete({
    where: {
      id: existingSave.id,
    },
  });

  return true; // Save entry deleted successfully
};

export default removeSave;
