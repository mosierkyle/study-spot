import styles from './page.module.css';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from './user';

export default async function Home() {
  const session = await getServerSession(authOptions);
  // const user = await getUserSession();
  return (
    <main className={styles.main}>
      <h1>This is the home page</h1>
      {/* <p>{JSON.stringify(user)}</p> */}
      <Link href="api/auth/signin">Sign In</Link>
      <Link href="about">Link to About Page</Link>
      <h2>Server Session</h2>
      <pre>{JSON.stringify(session)}</pre>
      <h2>Client Call</h2>
      <User />
    </main>
  );
}
