import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { School, StudySpot } from '@prisma/client';
import styles from './page.module.css';
import Link from 'next/link';

interface SchoolCardProps {
  school: School;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school }) => {
  const [studySpots, setStudySpots] = useState<StudySpot[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/studySpots/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(school.id),
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedData = await responseData.spots;
          setStudySpots(parsedData);
          console.log(parsedData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Link href={`/school/${school.id}`} className={styles.schoolCard}>
      {/* <Image
        src={school.address}
        alt={school.name}
        className={styles.schoolImage}
      /> */}
      <div className={styles.schoolImage}></div>
      <div className={styles.schoolInfo}>
        <p className={styles.schoolName}>{school.name}</p>
        <p className={styles.schoolCity}>{school.city}</p>
        <p className={styles.schoolSpots}>{studySpots.length} Study Spots</p>
      </div>
    </Link>
  );
};

export default SchoolCard;
