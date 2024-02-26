'use client';

import { getSchool } from '@/lib/getSchool';
import { School } from '@prisma/client';
import styles from './page.module.css';
import Image from 'next/image';
import calpoly from '../../public/schools/calpoly.png';
import library from '../../public/schools/library.jpg';
import Link from 'next/link';
import study from '../../public/study6.jpg';
import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

interface Props {
  params: {
    school: string;
  };
}

const School = ({ params: { school } }: Props) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-120.6625);
  const [lat, setLat] = useState(35.305);
  const [zoom, setZoom] = useState(13.9);
  const [schoolData, setSchoolData] = useState<School | undefined>(undefined);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/school/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(school),
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedData = await responseData.school;
          setSchoolData(parsedData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mapboxgl.accessToken = mapboxToken ?? '';
    if (!mapContainer.current || map.current) {
      return;
    }
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.main}>
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
          <h1 className={styles.heroText}>{schoolData?.name}</h1>
        </div>
      </section>
      <div className={styles.bottom}>
        <section className={styles.left}>
          <div className={styles.header}>
            <div>
              {/* <h1 className="header">{schoolData?.name}</h1> */}
              <h3>{`17 places to study`}</h3>
            </div>
            <Link
              href={`/${schoolData?.id}/add/${schoolData?.id}/`}
              className={styles.sort}
            >
              Sort
            </Link>
          </div>
          <div className={styles.spots}>
            <div className={styles.spot}>
              <div className={styles.photos}>
                <Image
                  alt="school header"
                  className={styles.spotPhoto}
                  src={library}
                />
              </div>
              <div className={styles.info}>
                <p className={styles.spotName}>Kennedy Library</p>
                <div className={styles.spotOpinion}>
                  <p className={styles.spotRating}>4/5 stars</p>
                  <p className={styles.spotReviews}>9 reviews</p>
                </div>
                <p className={styles.spotAddress}>
                  1 Grand Ave Building 35, San Luis Obispo, CA 93401
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.right}>
          <div className={styles.mapContainer} ref={mapContainer}></div>
        </section>
      </div>
    </div>
  );
};

export default School;
