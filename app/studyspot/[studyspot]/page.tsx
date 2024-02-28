'use client';

import { School, StudySpot } from '@prisma/client';
import styles from './page.module.css';
import { getSpot } from '@/lib/getSpot';
import Image from 'next/image';
import study from '../../../public/study6.jpg';
import { useEffect, useState } from 'react';
import Stars from '@/app/components/stars/stars';

interface Props {
  params: {
    studyspot: string;
  };
}

const Spot = ({ params: { studyspot } }: Props) => {
  const [spotData, setSpotData] = useState<any>(null);
  // const spotData: StudySpot | undefined = await getSpot(studyspot);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/studySpot/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(studyspot),
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedData = await responseData.spot;
          setSpotData(parsedData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <h1 className={styles.heroText}>{`Study at ${spotData?.name}`}</h1>
          <Stars rating={Math.floor(Math.random() * 5) + 1} />
        </div>
      </section>
    </div>
  );
};

export default Spot;
