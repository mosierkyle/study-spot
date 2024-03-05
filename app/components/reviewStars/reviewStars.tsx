import { useState } from 'react';
import star from '../../../public/regularStar.png';
import styles from './page.module.css';
import Image from 'next/image';
import star2 from '../../../public/star2.png';
import star3 from '../../../public/unfilledStar.png';

interface ReviewStarsProps {
  rating: number | null;
}

const ReviewStars: React.FC<ReviewStarsProps> = ({ rating }) => {
  if (!rating) {
    rating = 0;
  }
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const renderStars = () => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < filledStars) {
        stars.push(
          <span className={styles.star} key={i}>
            <Image src={star} alt="star" />
          </span>
        );
      } else {
        stars.push(
          <span className={styles.starEmpty} key={i}>
            <Image src={star3} alt="star" />
          </span>
        );
      }
    }
    return stars;
  };

  return <div className={styles.stars}>{renderStars()}</div>;
};

export default ReviewStars;
