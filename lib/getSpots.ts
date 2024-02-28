import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { get } from 'http';

export const getSpots = cache(async (id: string) => {
  console.log('we here at aleast');
  try {
    const spots = await prisma.studySpot.findMany();
    return spots;
  } catch (error) {
    console.log(error);
  }
});
