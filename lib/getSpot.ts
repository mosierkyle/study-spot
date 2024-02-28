import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { get } from 'http';

export const getSpot = cache(async (id: string) => {
  try {
    const school = await prisma.studySpot.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    return school;
  } catch (error) {
    console.log(error);
  }
});
