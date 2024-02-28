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
          <div className={styles.star} key={i}>
            <Image src={star} alt="star" />
          </div>
        );
      } else if (i === filledStars && hasHalfStar) {
        stars.push(
          <div className={styles.starHalf} key={i}>
            <Image src={star} alt="star" />
          </div>
        );
      } else {
        stars.push(
          <div className={styles.starEmpty} key={i}>
            <Image src={star} alt="star" />
          </div>
        );
      }
    }
    return stars;
  };

  return <div className={styles.stars}>{renderStars()}</div>;
};

export default Stars;
