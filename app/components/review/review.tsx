import { Review, User } from '@prisma/client';
import Image from 'next/image';
import ReviewStars from '../reviewStars/reviewStars';
import styles from './page.module.css';
import profile from '../../../public/account.png';
import photo from '../../../public/camera.png';
import { useEffect, useState } from 'react';

interface reviewCardProps {
  reviewData: Review | null;
}

const ReviewCard: React.FC<reviewCardProps> = ({ reviewData }) => {
  const [userData, setUserData] = useState<User | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/student/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData?.authorId),
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedData = await responseData.student;
          setUserData(parsedData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.review}>
      <div className={styles.userSection}>
        <Image src={profile} alt="profile" height={40} width={40} />
        <div className={styles.userSectionInfo}>
          <p>{userData?.name?.split(' ')[0]}</p>8 months ago
        </div>
      </div>
      <div className={styles.stars}>
        <ReviewStars rating={reviewData?.rating ?? null} />
      </div>
      <div className={styles.photos}>
        {' '}
        <Image src={photo} alt="photos" className={styles.camera} />2 photos
      </div>
      <div className={styles.contentSection}>{reviewData?.content}</div>
      <div className={styles.like}></div>
    </div>
  );
};

export default ReviewCard;
