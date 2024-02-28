import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import library from '../../../public/schools/library.jpg';
import { StudySpot } from '@prisma/client';
import Link from 'next/link';
import Stars from '../stars/stars';

interface spotCardFormProps {
  spotData: StudySpot | null;
}

const SpotCard: React.FC<spotCardFormProps> = ({ spotData }) => {
  return (
    <Link className={styles.link} href={`/studyspot/${spotData?.id}`}>
      <div className={styles.spot}>
        <div className={styles.photos}>
          <Image
            alt="school header"
            className={styles.spotPhoto}
            src={library}
          />
        </div>
        <div className={styles.info}>
          <p className={styles.spotName}>{spotData?.name}</p>

          <div className={styles.spotOpinion}>
            <p className={styles.spotRating}>
              {' '}
              <Stars rating={Math.floor(Math.random() * 5) + 1} />
            </p>
          </div>
          <p className={styles.spotReviews}>{`${
            Math.floor(Math.random() * 10) + 1
          } reviews`}</p>
          <p className={styles.spotAddress}>{spotData?.address}</p>
        </div>
      </div>
    </Link>
  );
};

export default SpotCard;
