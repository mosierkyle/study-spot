import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { get } from 'http';

export const getSpotsFromSave = cache(async (ids: string[] | undefined) => {
  try {
    const savedSpots = await prisma.studySpot.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return savedSpots;
  } catch (error) {
    console.log(error);
  }
});
