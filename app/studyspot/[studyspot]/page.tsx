import { School, StudySpot } from '@prisma/client';
import styles from './page.module.css';
import { getSpot } from '@/lib/getSpot';
import Image from 'next/image';
import study from '../../../public/study7.jpg';

interface Props {
  params: {
    studyspot: string;
  };
}

const StudySpot = async ({ params: { studyspot } }: Props) => {
  const spotData: StudySpot | undefined = await getSpot(studyspot);

  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroImgDiv}>
          <Image
            className={styles.heroImg}
            alt="University photo"
            src={study}
            priority
          />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroText}>{spotData?.name}</h1>
        </div>
      </section>
    </div>
  );
};

export default StudySpot;
