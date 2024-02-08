import type { Metadata } from 'next';
import { inter } from '@/app/fonts';
import './globals.css';
import { Providers } from './providers';
import styles from './page.module.css';
import Link from 'next/link';
import github2 from '../public/github2.png';
import linkedin2 from '../public/linkedin2.png';
import Image from 'next/image';
import twitter from '../public/twitter.png';

export const metadata: Metadata = {
  title: 'StudySpot',
  description:
    'A community driven app to find the best study places on your campus',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.landingHeader}>
          <div className={styles.landingLogo}>
            <p>
              Study<span>Spot</span>
            </p>
          </div>
          <div className={styles.links}>
            <ul className={styles.navLinks}>
              {/* <li className={styles.navLink}>Search</li> */}
              <li className={styles.navLink}>Login</li>
              <Link href="api/auth/signin" className={styles.signUp}>
                Sign up
              </Link>
            </ul>
          </div>
        </div>
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
            <Link className={styles.footerLink1} href={'/'}>
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
