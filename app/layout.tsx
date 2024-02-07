import type { Metadata } from 'next';
import { inter } from '@/app/fonts';
import './globals.css';
import { Providers } from './providers';
import styles from './page.module.css';
import Link from 'next/link';

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
      </body>
    </html>
  );
}
