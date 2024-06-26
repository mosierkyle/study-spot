'use client';

import type { Prisma, School, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useSession, getSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import study from '../../../../../public/study2.jpg';
import back from '../../../../../public/back.png';
import upload from '../../../../../public/upload3.png';
import StudySpotForm from '@/app/components/forms/spotform';
import ProgressBar from '@/app/components/progressBar/progressBar';

interface Props {
  params: {
    newStudySpot: string;
  };
}

const NewStudySpot = ({ params: { newStudySpot } }: Props) => {
  const [school, setSchool] = useState<School | null>(null);
  const [formPage, setformPage] = useState<Number>(1);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<Boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/school/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newStudySpot),
        });
        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          const parsedData = await responseData.school;
          const parsedUser = await responseData.user;
          setSchool(parsedData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  const goBack = () => {
    router.push(`/school/${newStudySpot}`);
  };

  return (
    <div>
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
          <h1 className={styles.heroText}>
            New study spot for{' '}
            <span className={styles.schoolName}>
              {!school?.name ? '...' : school?.name}
            </span>
          </h1>
        </div>
      </section>
      <section className={styles.form}>
        <div className={styles.formHeader}>
          <div onClick={goBack} className={styles.back}>
            <Image
              className={styles.backButton}
              src={back}
              alt="X"
              height={29}
              width={29}
            />
            <p className={styles.backText}>
              {!school?.name ? 'School' : school?.name} study spots
            </p>
          </div>
        </div>
        <div className={styles.progressBar}>
          <ProgressBar formPage={formPage} />
        </div>
        <StudySpotForm
          userData={user}
          schoolData={school}
          formPage={formPage}
          setFormPage={setformPage}
        />
      </section>
    </div>
  );
};

export default NewStudySpot;
