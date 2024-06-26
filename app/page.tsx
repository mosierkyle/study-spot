import styles from './page.module.css';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Image from 'next/image';
import school1 from '../public/school1.jpg';
import search from '../public/search.jpg';
import study from '../public/study.jpg';
import review from '../public/review.jpg';
import Search from './components/search/page';
import { Storage } from '@google-cloud/storage';
import SchoolsContainer from './components/schoolGallery/schoolGallery';

export default async function Home() {
  const session = await getServerSession(authOptions);

  const gc = new Storage({
    keyFilename: process.env.GOOGLE_KEY_FILE,
    projectId: process.env.GOOGLE_PROJECT_ID,
  });

  const studySpotBucket = gc.bucket('studyspot');

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroImgDiv}>
          <Image
            className={styles.heroImg}
            alt="University photo"
            src={school1}
            priority
          />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroText}>Find a better place to study</h1>
          <Search />
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
              Find your college so you can look for study spots on your campus.
              Dont see your college?{' '}
              <a className={styles.noCollege} href="">
                Click Here
              </a>
            </p>
          </div>
        </div>
        <div className={styles.step}>
          <div className={styles.stepText}>
            <h2>Find your ideal workspace</h2>
            <p>
              Discover the perfect study spot to optimize your productivity and
              comfort.
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
              Share your experience and help others by leaving a review or
              rating.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.schools}>
        <SchoolsContainer></SchoolsContainer>
      </section>
    </main>
  );
}
