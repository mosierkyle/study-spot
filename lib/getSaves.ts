import { prisma } from '@/lib/prisma';
import { cache } from 'react';

const getSaves = cache(async (id: string) => {
  try {
    const saves = await prisma.save.findMany({
      where: {
        studentId: id,
      },
    });
    return saves;
  } catch (error) {
    console.log(error);
  }
});

export default getSaves;
