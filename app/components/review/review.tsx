import { Review, User } from '@prisma/client';
import Image from 'next/image';
import ReviewStars from '../reviewStars/reviewStars';
import styles from './page.module.css';
import profile from '../../../public/account.png';
import photo from '../../../public/camera.png';
import { use, useEffect, useState } from 'react';
import like from '../../../public/like2.png';
import like2 from '../../../public/like1.png';
import { addLike } from '@/lib/addLike';
import { removeLike } from '@/lib/removeLike';
import user2 from '../../../public/user2.png';

interface reviewCardProps {
  reviewData: Review | null;
}

const ReviewCard: React.FC<reviewCardProps> = ({ reviewData }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
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

  const handleLike = () => {
    if (liked) {
      setLiked(false);
    } else {
      setLiked(true);
    }
    console.log(liked);
  };

  return (
    <div className={styles.review}>
      <div className={styles.userSection}>
        <Image src={user2} alt="profile" height={40} width={40} />
        <div className={styles.userSectionInfo}>
          <p>{userData?.name?.split(' ')[0]}</p>8 months ago
        </div>
      </div>
      <div className={styles.stars}>
        <ReviewStars rating={reviewData?.rating ?? null} />
      </div>
      {reviewData?.photos.length != 0 && (
        <div className={styles.photos}>
          {' '}
          <Image src={photo} alt="photos" className={styles.camera} />
          {reviewData?.photos.length}{' '}
          {reviewData?.photos.length == 1 ? 'photo' : 'photos'}
        </div>
      )}
      <div className={styles.contentSection}>{reviewData?.content}</div>
      {reviewData?.photos.length != 0 && (
        <div className={styles.photosDiv}>
          {reviewData?.photos.map((url, index) => (
            <div key={`photo-${url}`} className={styles.photoPreview}>
              <Image
                src={url}
                alt={`Photo ${index + 1}`}
                className={styles.uploadedPhotoPreview}
                width={150}
                height={300}
              />
            </div>
          ))}
        </div>
      )}
      <div className={styles.likes}>
        <div className={styles.like} onClick={handleLike}>
          {liked ? (
            <Image
              className={styles.like}
              height={25}
              width={25}
              src={like2}
              alt={'like'}
            />
          ) : (
            <Image
              className={styles.like}
              height={25}
              width={25}
              src={like}
              alt={'like'}
            />
          )}
        </div>
        0
      </div>
    </div>
  );
};

export default ReviewCard;
