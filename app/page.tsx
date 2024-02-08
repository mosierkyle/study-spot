import styles from './page.module.css';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from './user';
import Image from 'next/image';
import school1 from '../public/school1.jpg';
import search from '../public/search.jpg';
import study from '../public/study.jpg';
import review from '../public/review.jpg';
import SignIn from './components/signin';

export default async function Home() {
  const session = await getServerSession(authOptions);
  // const user = await getUserSession();
  return (
    <main className={styles.main}>
      <SignIn />
      <section className={styles.hero}>
        <div className={styles.heroImgDiv}>
          <Image
            className={styles.heroImg}
            alt="University photo"
            src={school1}
          />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroText}>Find a better place to study</h1>
          <div className={styles.searchDiv}>
            <input
              className={styles.search}
              type="text"
              placeholder="Search for your school"
            />
          </div>
        </div>
      </section>
      <section className={styles.info}>
        <div className={styles.step}>
          <div className={styles.stepImgDiv}>
            <Image
              className={styles.stepImg}
              src={search}
              alt="Search For your school"
            />
          </div>
          <div className={styles.stepText}>
            <h2>Search for your school</h2>
            <p>
              Find you college so you can look for study spots on your campus.
              Dont see your college? Click Here
            </p>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.stepText}>
            <h2>Find your ideal workspace</h2>
            <p>
              Find you college so you can look for study spots on your campus.
              Dont see your college? Click Here
            </p>
          </div>
          <div className={styles.stepImgDiv}>
            <Image className={styles.stepImg} src={study} alt="Study" />
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.stepImgDiv}>
            <Image
              className={styles.stepImg}
              src={review}
              alt="Search For your school"
            />
          </div>
          <div className={styles.stepText}>
            <h2>Leave a review</h2>
            <p>
              Find you college so you can look for study spots on your campus.
              Dont see your college? Click Here
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

{
  /* <Link href="api/auth/signin">Sign In</Link>
        <Link href="about">Link to About Page</Link>
        <h2>Server Session</h2>
        <pre>{JSON.stringify(session)}</pre>
        <h2>Client Call</h2>
        <User /> */
}
