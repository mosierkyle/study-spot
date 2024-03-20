'use client';
import { Review, Save, StudySpot, User } from '@prisma/client';
import styles from './page.module.css';
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import user2 from '../../public/user2.png';
import ReviewCard from '../components/review/review';
import Loading from './loading';
import SpotCard from '../components/spotCard/spotCard';

interface Props {
  params: {
    school: string;
  };
}

const Account = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<'Reviews' | 'Saved Spots' | 'Edit Profile'>(
    'Reviews'
  );
  const [reviewData, setReviewData] = useState<Review[]>([]);
  const [savesData, setSavesData] = useState<StudySpot[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getUser/', {
          method: 'GET',
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedUser = await responseData.user;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePage = (newPage: 'Reviews' | 'Saved Spots' | 'Edit Profile') => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/userReviews/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user?.id),
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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/userSaves/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user?.id),
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedData = await responseData.saves;
          setSavesData(parsedData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <main className={styles.mainStyle}>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.userCard}>
            <Image
              className={styles.userPhoto}
              src={user?.avatar ? user.avatar : user2}
              alt="Account Avatar"
              width={120}
              height={120}
            />
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userSchool}>{user?.schoolId ?? 'student'}</p>
            <div className={styles.options}>
              <div
                className={styles.option}
                onClick={() => handlePage('Edit Profile')}
              >
                <Image height={25} width={25} src={user2} alt="option"></Image>
                <p className={styles.optionText}>Edit Profile</p>
              </div>
              <div
                className={styles.option}
                onClick={() => handlePage('Saved Spots')}
              >
                <Image height={25} width={25} src={user2} alt="option"></Image>
                <p className={styles.optionText}>Saved Spots</p>
              </div>
              <div
                className={styles.option}
                onClick={() => handlePage('Reviews')}
              >
                <Image height={25} width={25} src={user2} alt="option"></Image>
                <p className={styles.optionText}>Reviews</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <p className={styles.rightHeader}>{page}</p>
          {page === 'Reviews' && (
            <div className={styles.reviewsPage}>
              <div className={styles.reviews}>
                {reviewData ? (
                  reviewData.map((review) => {
                    return <ReviewCard key={review.id} reviewData={review} />;
                  })
                ) : (
                  <Loading></Loading>
                )}
              </div>
            </div>
          )}
          {page === 'Edit Profile' && (
            <div className={styles.editPage}>
              <p>Edit Profile</p>
            </div>
          )}
          {page === 'Saved Spots' && (
            <div className={styles.spotsPage}>
              {savesData.map((spot) => (
                <SpotCard key={spot.id} spotData={spot} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Account;
