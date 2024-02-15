import { getSchool } from '@/lib/getSchool';
import { School } from '@prisma/client';
import styles from './page.module.css';
import Image from 'next/image';
import calpoly from '../../public/schools/calpoly.png';
import library from '../../public/schools/library.jpg';
import Link from 'next/link';

interface Props {
  params: {
    school: string;
  };
}
export async function generateMetadata({ params: { school } }: Props) {
  const schoolData: School | undefined = await getSchool(school);

  const displayTerm = schoolData?.name.replaceAll('%20', ' ');

  return {
    title: displayTerm,
    description: `Search Results for ${displayTerm}`,
  };
}

const School = async ({ params: { school } }: Props) => {
  const schoolData: School | undefined = await getSchool(school);
  console.log(schoolData);

  return (
    <div className={styles.main}>
      <section className={styles.left}>
        <div className={styles.header}>
          <div>
            <h1 className="header">{schoolData?.name}</h1>
            <h3>{`17 places to study`}</h3>
          </div>
          <Link
            href={`/${schoolData?.id}/add/${schoolData?.id}/`}
            className={styles.sort}
          >
            Sort
          </Link>
        </div>
        <div className={styles.spots}>
          <div className={styles.spot}>
            <div className={styles.photos}>
              <Image
                alt="school header"
                className={styles.spotPhoto}
                src={library}
              />
            </div>
            <div className={styles.info}>
              <p className={styles.spotName}>Kennedy Library</p>
              <div className={styles.spotOpinion}>
                <p className={styles.spotRating}>4/5 stars</p>
                <p className={styles.spotReviews}>9 reviews</p>
              </div>
              <p className={styles.spotAddress}>
                1 Grand Ave Building 35, San Luis Obispo, CA 93401
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.right}>
        {schoolData?.photos && (
          <Image
            alt="school header"
            className={styles.rightImg}
            src={calpoly}
          />
        )}
      </section>
    </div>
  );
};

export default School;
