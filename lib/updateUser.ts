import { prisma } from '@/lib/prisma';
import type { User } from '@prisma/client';

interface UpdateUserProps {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const updateUser = async (props: UpdateUserProps): Promise<User> => {
  const { id, name, email, avatar } = props;

  // Find the existing user by ID
  const existingUser = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!existingUser) {
    throw new Error('User with the provided ID not found');
  }

  // Check if the emails match or if the email is already in use by another user
  if (existingUser.email !== email) {
    const userWithEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userWithEmail) {
      throw new Error('Email is already in use by another user');
    }
  }

  // Update the user with the new information
  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      name: name,
      email: email,
      avatar: avatar,
    },
  });

  return updatedUser;
};

export default updateUser;
