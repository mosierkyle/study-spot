import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { get } from 'http';

export const getSchool = cache(async (name: string) => {
  const school = await prisma.school.findFirst({
    where: {
      name: name,
    },
  });

  console.log(school);
  return school;
});

interface CreateUserProps {
  email: string;
  name?: string;
  avatar?: string;
  password?: string;
  schoolName?: string;
}

export const createUser = async (
  props: CreateUserProps
): Promise<Prisma.UserSelect> => {
  const { email, name, avatar, password, schoolName } = props;

  const hashedPassword = await hash('test123', 12);

  let getSchool = await prisma.school.findFirst({
    where: {
      name: schoolName,
    },
  });
  if (getSchool) {
    console.log(getSchool);
  } else {
    // Handle the case where the school is not found
    throw new Error(`School with name ${schoolName} not found`);
  }

  const user = await prisma.user.upsert({
    where: { email: email },
    update: {
      name: name,
      avatar: avatar,
      password: hashedPassword,
      schoolId: getSchool.id,
    },
    create: {
      email: email,
      name: name,
      avatar: avatar,
      password: hashedPassword,
      schoolId: getSchool.id,
    },
  });
  console.log(user);
  return user;
};
