import { prisma } from '@/lib/prisma';
import { cache } from 'react';

const getUser = cache(async (email: string) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
});

export default getUser;
