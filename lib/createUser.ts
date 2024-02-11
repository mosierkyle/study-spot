import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';

interface CreateUserProps {
  email: string;
  name?: string;
  password?: string;
}

const createUser = async (
  props: CreateUserProps
): Promise<Prisma.UserSelect> => {
  const { email, name, password } = props;

  if (!password) {
    throw new Error('Password is required');
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    throw new Error('Student with this email already exists');
  }

  //   const hashedPassword = await hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email: email },
    update: {
      name: name,
      password: password,
    },
    create: {
      email: email,
      name: name,
      password: password,
    },
  });
  console.log(user);
  return user;
};

export default createUser;
