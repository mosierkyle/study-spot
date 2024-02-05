import { prisma } from '@/lib/prisma';
import { session } from '@/lib/session';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { NextAuthOptions, User, getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'hello@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );
        console.log('Is the password correct ' + isPasswordValid);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id + '',
          email: user.email,
          name: user.name ?? 'Student',
          randomKey: 'Hey cool',
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ profile, user }) {
      if (user.email) {
        return true;
      }
      if (!profile?.email) {
        throw new Error('No profile');
      }

      await prisma.user.upsert({
        where: {
          email: profile.email,
        },
        create: {
          email: profile.email,
          name: profile.name,
        },
        update: {
          name: profile.name,
        },
      });
      return true;
    },
    session,
    async jwt({ token, user, profile }) {
      if (profile) {
        const user = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        });
        if (!user) {
          throw new Error('No user found');
        }
        token.id = user.id;
      }
      return token;
    },
  },
};

// export async function loginIsRequiredServer() {
//   const session = await getServerSession(authOptions);
//   if (!session) return redirect('/');
// }

// export function loginIsRequiredClient() {
//   if (typeof window !== 'undefined') {
//     const session = useSession();
//     const router = useRouter();
//     if (!session) router.push('/');
//   }
// }

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
