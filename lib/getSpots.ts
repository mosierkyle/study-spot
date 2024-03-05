import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { get } from 'http';

export const getSpots = cache(async (id: string) => {
  try {
    const spots = await prisma.studySpot.findMany({
      where: {
        schoolId: id,
      },
    });
    return spots;
  } catch (error) {
    console.log(error);
  }
});
