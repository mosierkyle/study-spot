'use client';

import React, { useState, useEffect } from 'react';
import SchoolCard from '../schoolCard/schoolCard';
import styles from './page.module.css';
import { School } from '@prisma/client';

const SchoolsContainer: React.FC = () => {
  const [data, setData] = useState<School[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/schools/');
        if (response.ok) {
          const responseData = await response.json();
          const schools = await responseData.schools;
          setData(schools);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.gallery}>
      {data.map((school: School) => (
        <SchoolCard key={school.id} school={school} />
      ))}
    </div>
  );
};

export default SchoolsContainer;
