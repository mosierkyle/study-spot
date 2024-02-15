'use client';

import type { Prisma, School } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useSession, getSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import study from '../../../../public/study2.jpg';
import back from '../../../../public/back.png';
import upload from '../../../../public/upload3.png';

interface Props {
  params: {
    newStudySpot: string;
  };
}

const NewStudySpot = ({ params: { newStudySpot } }: Props) => {
  const [school, setSchool] = useState<School | null>(null);
  const [formPage, setformPage] = useState<Number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

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
          const parsedData = await responseData.school;
          setSchool(parsedData);
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
    router.push(`/${newStudySpot}`);
  };

  const fileInput = () => {
    const fileInput: HTMLElement | null =
      document.querySelector('input[type="file"]');

    if (fileInput) {
      fileInput.click();
    }
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
            <span className={styles.schoolName}>{school?.name}</span>
          </h1>
        </div>
      </section>
      <section className={styles.form}>
        <div onClick={goBack} className={styles.formHeader}>
          <div className={styles.back}>
            <Image
              className={styles.backButton}
              src={back}
              alt="X"
              height={29}
              width={29}
            />
            <p className={styles.backText}>{school?.name} study spots</p>
          </div>
        </div>
        <form className={styles.formPage}>
          {formPage === 1 && (
            <div className={styles.formPage1}>
              <div className={styles.inputDiv}>
                <p className={styles.header}>Name</p>
                <p className={styles.desc}>
                  Share the name or nickname of your study spot.
                </p>
                <input
                  type="text"
                  name="name"
                  // placeholder="Email"
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.inputDiv}>
                <p className={styles.header}>Address</p>
                <p className={styles.desc}>
                  Share the address of your study spot. If you are unsure of the
                  address you can enter the name or number of the building (e.g.
                  Math and Science Building, {school?.name}).
                </p>
                <input
                  type="text"
                  name="address"
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.inputDiv}>
                <p className={styles.header}>Photos</p>
                <p className={styles.desc}>
                  Share some photos of your study spot. The photos could be of
                  the working spaces, key features, the building, or whatever
                  helps the most.
                </p>
                <label
                  onClick={fileInput}
                  htmlFor="photos"
                  className={styles.fileLabel}
                >
                  <Image src={upload} alt="" height={50} width={50}></Image>

                  <p className={styles.preview}>Click to browse files</p>
                  <input
                    type="file"
                    name="photos"
                    className={styles.fileInput}
                    accept=".jpg, .jpeg, .png"
                    multiple
                  />
                </label>
              </div>
              <div className={styles.buttons}>
                <button
                  type="button"
                  className={styles.next}
                  onClick={() => setformPage(2)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

export default NewStudySpot;
