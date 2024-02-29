import { useState } from 'react';
import star from '../../../public/star2.png';
import styles from './page.module.css';
import Image from 'next/image';

interface StarsProps {
  rating: number;
}

const Stars: React.FC<StarsProps> = ({ rating }) => {
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
      } else if (i === filledStars && hasHalfStar) {
        stars.push(
          <span className={styles.starHalf} key={i}>
            <Image src={star} alt="star" />
          </span>
        );
      } else {
        stars.push(
          <span className={styles.starEmpty} key={i}>
            <Image src={star} alt="star" />
          </span>
        );
      }
    }
    return stars;
  };

  return <div className={styles.stars}>{renderStars()}</div>;
};

export default Stars;
