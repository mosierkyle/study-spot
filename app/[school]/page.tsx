'use client';

import { getSchool } from '@/lib/getSchool';
import { School, StudySpot } from '@prisma/client';
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

const markers = [
  {
    name: 'BUS lab',
    latCoord: 35.3,
    longCoord: -120.66505,
  },
  {
    name: 'Baker',
    latCoord: 35.30148,
    longCoord: -120.66048,
  },
  {
    name: 'Kennedy Library',
    latCoord: 35.30188,
    longCoord: -120.66382,
  },
  {
    name: 'University Union',
    latCoord: 35.30001,
    longCoord: -120.65869,
  },
];

const School = ({ params: { school } }: Props) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-120.6625);
  const [lat, setLat] = useState(35.305);
  const [zoom, setZoom] = useState(14.2);
  const [schoolData, setSchoolData] = useState<School | undefined>(undefined);
  const [spotsData, setSpotsData] = useState<StudySpot | undefined>(undefined);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const bounds: mapboxgl.LngLatBoundsLike = [
    [lng - 0.01, lat - 0.01], // Southwest coordinates
    [lng + 0.01, lat + 0.01], // Northeast coordinates
  ];
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
    mapboxgl.accessToken = mapboxToken ?? '';
    if (!mapContainer.current || map.current) {
      return;
    }
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
      maxZoom: 20,
      minZoom: 13,
    });
    map.current?.addControl(new mapboxgl.NavigationControl());
    map.current?.on('load', () => {
      map.current?.fitBounds(bounds, {
        padding: 0,
        linear: true,
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchMoreData = async () => {
      try {
        const response = await fetch('/api/studySpots/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(school),
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedData = await responseData.spots;
          setSpotsData(parsedData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    map.current?.on('load', () => {
      markers.forEach((marker) => {
        // console.log(marker);
        if (map.current)
          new mapboxgl.Marker()
            .setLngLat([marker.longCoord, marker.latCoord])
            .addTo(map.current);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  map.current?.on('move', () => {
    setLng(
      (prevLng: number) =>
        Number(map.current?.getCenter().lng.toFixed(4)) ?? prevLng
    );
    setLat(
      (prevLat: number) =>
        Number(map.current?.getCenter().lat.toFixed(4)) ?? prevLat
    );
    setZoom(
      (prevZoom: number) =>
        Number(map.current?.getZoom().toFixed(2)) ?? prevZoom
    );
  });

  console.log(spotsData);

  return (
    <div className={styles.main}>
      {/* <section className={styles.hero}>
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
      </section> */}
      <div className={styles.bottom}>
        <section className={styles.filters}>
          <div>Filters</div>
        </section>
        <section className={styles.left}>
          <div className={styles.header}>
            <div className={styles.breadCrumbs} data-testid="bread-crumb">
              <Link className={styles.breadCrumbText} href={'/'}>
                Home
              </Link>{' '}
              &gt;{' '}
              <Link className={styles.breadCrumbText} href={`/${school}`}>
                Living
              </Link>
            </div>
            <div>
              <h1 className="header">{schoolData?.name} study spots</h1>
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
          {/* <div className={styles.sidebar}>
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
          </div> */}
          <div className={styles.mapContainer} ref={mapContainer}></div>
        </section>
      </div>
    </div>
  );
};

export default School;
