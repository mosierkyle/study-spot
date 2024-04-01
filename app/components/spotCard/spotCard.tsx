import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import library from '../../../public/schools/library.jpg';
import { StudySpot, Review } from '@prisma/client';
import Link from 'next/link';
import Stars from '../stars/stars';
import study from '../../../public/study3.jpg';
import StudySpotForm from '../forms/spotform';
import back from '../../../public/back.png';

interface spotCardFormProps {
  spotData: StudySpot | null;
}

const SpotCard: React.FC<spotCardFormProps> = ({ spotData }) => {
  const [reviewData, setReviewData] = useState<Review[] | null>(null);
  const [imageDisplay, setImageDisplay] = useState<number>(0);

  const handleImageChange = (side: number) => {
    setImageDisplay((prev) => prev + side);
  };

  return (
    <div className={styles.link}>
      {imageDisplay >= 1 && (
        <div
          className={styles.buttonLeftDiv}
          onClick={() => handleImageChange(-1)}
        >
          <Image
            className={styles.buttonLeft}
            src={back}
            alt="left"
            width={22}
            height={22}
          />
        </div>
      )}
      {imageDisplay < (spotData?.photos.length ?? 0) - 1 && (
        <div
          className={styles.buttonRightDiv}
          onClick={() => handleImageChange(1)}
        >
          <Image
            className={styles.buttonRight}
            src={back}
            alt="left"
            width={22}
            height={22}
          />
        </div>
      )}
      <Link href={`/studyspot/${spotData?.id}`} className={styles.spot}>
        <div className={styles.photos}>
          <Image
            alt="school header"
            className={styles.spotPhoto}
            src={spotData?.photos[imageDisplay] ?? study}
            width={2000}
            height={2000}
          />
        </div>
        <div className={styles.info}>
          <p className={styles.spotName}>{spotData?.name}</p>

          <div className={styles.spotOpinion}>
            <div className={styles.spotRating}>
              <Stars rating={spotData?.rating ?? 0} />
              <p className={styles.spotReviews}>
                <span className={styles.ratingBold}>
                  {Number.isInteger(spotData?.rating)
                    ? `${spotData?.rating}.0`
                    : `${spotData?.rating}`}
                </span>{' '}
                {`(${spotData?.reviewCount} reviews)`}
              </p>
            </div>
          </div>
          <div className={styles.spotCategory}>{spotData?.category}</div>
          <p className={styles.spotAddress}>{spotData?.address}</p>
        </div>
      </Link>
    </div>
  );
};

export default SpotCard;
