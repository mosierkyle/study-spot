import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import library from '../../../public/schools/library.jpg';
import { StudySpot, Review } from '@prisma/client';
import Link from 'next/link';
import Stars from '../stars/stars';

interface spotCardFormProps {
  spotData: StudySpot | null;
}

const SpotCard: React.FC<spotCardFormProps> = ({ spotData }) => {
  const [reviewData, setReviewData] = useState<Review[] | null>(null);

  useEffect(() => {
    const fetchMoreData = async () => {
      try {
        const response = await fetch('/api/reviews/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(spotData?.id),
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedData = await responseData.reviews;
          setReviewData(parsedData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <Stars rating={spotData?.rating ?? 0} />
            </p>
          </div>
          <p
            className={styles.spotReviews}
          >{`${reviewData?.length} reviews`}</p>
          <p className={styles.spotAddress}>{spotData?.address}</p>
        </div>
      </div>
    </Link>
  );
};

export default SpotCard;
