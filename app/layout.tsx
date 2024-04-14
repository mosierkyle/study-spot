import './globals.css';
import { Providers } from './providers';
import styles from './page.module.css';
import Link from 'next/link';
import github2 from '../public/github2.png';
import linkedin2 from '../public/linkedin2.png';
import Image from 'next/image';
import twitter from '../public/twitter.png';
import SignedOutNav from './components/navBars/signedOut';
import SignedInNav from './components/navBars/signedIn';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { StaticImageData } from 'next/image';
import getUser from '@/lib/getUser';
import { userInfo } from 'os';
import { User } from '@prisma/client';

export const metadata: Metadata = {
  title: 'StudySpot',
  description:
    'A community driven app to find the best study places on your campus',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const userInfo = await getUser(user?.email ?? '');

  return (
    <html lang="en">
      <body>
        {session ? (
          <SignedInNav
            userEmail={user?.email || undefined}
            userAvatar={userInfo?.avatar ?? undefined}
          />
        ) : (
          <SignedOutNav />
        )}
        <div>
          <Providers>{children}</Providers>
        </div>
        <div className={styles.footer}>
          <div className={styles.logoSocial}>
            <Link className={styles.footerLogo} href={'/'}>
              StudySpot
            </Link>
            <Link
              className={styles.footerSocial}
              href={'https://github.com/mosierkyle'}
            >
              <Image height={30} width={30} alt="Github" src={github2} />
            </Link>
            <Link
              className={styles.footerSocial}
              href={'https://www.linkedin.com/in/kylemosier/'}
            >
              <Image height={30} width={30} alt="LinkedIn" src={linkedin2} />
            </Link>
            <Link
              className={styles.footerSocial}
              href={'https://github.com/mosierkyle'}
            >
              <Image height={30} width={30} alt="Twitter" src={twitter} />
            </Link>
          </div>
          <div className={styles.footerLinks}>
            <Link className={styles.footerLink1} href={'/'}>
              About
            </Link>
            <Link className={styles.footerLink1} href={'/account'}>
              Account
            </Link>
            <Link className={styles.footerLink1} href={'/'}>
              Contact
            </Link>
          </div>
          <div className={styles.footerHelp}>
            <Link className={styles.footerLink2} href={'/'}>
              Terms & Conditions
            </Link>
            <Link className={styles.footerLink2} href={'/'}>
              Privacy Policy
            </Link>
            <Link className={styles.footerLink2} href={'/'}>
              All Rights Reserved
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

// userAvatar={user?.image}
