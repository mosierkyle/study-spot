import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';
import { getUserSession } from '@/lib/session';

export default async function Home() {
  const user = await getUserSession();
  return (
    <main className={styles.main}>
      <h1>This is the home page</h1>
      <p>{JSON.stringify(user)}</p>
      <Link href="api/auth/signin">Sign In</Link>
      <Link href="about">Link to About Page</Link>
    </main>
  );
}
