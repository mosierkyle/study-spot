import styles from './page.module.css';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from './user';
import Image from 'next/image';
import school1 from '../public/school1.jpg';

export default async function Home() {
  const session = await getServerSession(authOptions);
  // const user = await getUserSession();
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.heroImgDiv}>
          <Image
            className={styles.heroImg}
            alt="University photo"
            src={school1}
          />
        </div>
        <h1 className={styles.heroText}>Find a better place to study</h1>
        <div className={styles.searchDiv}>
          <input
            className={styles.search}
            type="text"
            placeholder="Search for your school"
          />
        </div>
        <Link href="api/auth/signin">Sign In</Link>
        <Link href="about">Link to About Page</Link>
        <h2>Server Session</h2>
        <pre>{JSON.stringify(session)}</pre>
        <h2>Client Call</h2>
        <User />
      </div>
    </main>
  );
}
