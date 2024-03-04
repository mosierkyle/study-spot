'use client';

import { Review, School, StudySpot } from '@prisma/client';
import styles from './page.module.css';
import { getSpot } from '@/lib/getSpot';
import Image from 'next/image';
import study from '../../../public/study6.jpg';
import { useEffect, useState, useRef, use } from 'react';
import Stars from '@/app/components/stars/stars';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import back from '../../../public/back.png';
import emptyStar from '../../../public/emptyStar.png';
import camera from '../../../public/upload5.png';
import save from '../../../public/save.png';
import share from '../../../public/share.png';
import location from '../../../public/location.png';
import x from '../../../public/x.png';
import check from '../../../public/check3.png';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import profile from '../../../public/account.png';

interface Props {
  params: {
    studyspot: string;
  };
}

const Spot = ({ params: { studyspot } }: Props) => {
  const [spotData, setSpotData] = useState<StudySpot | undefined>(undefined);
  const [reviewData, setReviewData] = useState<Review[] | undefined>(undefined);
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState<string | null>(null); // Set default value as needed
  const [lat, setLat] = useState<string | null>(null); // Set default value as needed
  const [zoom, setZoom] = useState(15);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/studySpot/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(studyspot),
        });
        if (response.ok) {
          const responseData = await response.json();
          const parsedData = await responseData.spot;
          setSpotData(parsedData);
          setLat(parsedData?.latitude);
          setLng(parsedData?.longitude);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lat && lng) {
      mapboxgl.accessToken = mapboxToken ?? '';
      if (!mapContainer.current || map.current) {
        return;
      }
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [Number(lng), Number(lat)],
        zoom: zoom,
        interactive: false,
      });

      if (map.current)
        new mapboxgl.Marker({ color: '#ff735c' })
          .setLngLat([Number(lng), Number(lat)])
          .addTo(map.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lng]);

  useEffect(() => {
    const fetchMoreData = async () => {
      try {
        const response = await fetch('/api/reviews/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(studyspot),
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
    fetchMoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goBack = () => {
    router.push(`/school/${spotData?.schoolId}`);
  };

  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <Link className={styles.seePhotos} href={'/'}>
          {`See all photos`}
        </Link>
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
            {spotData ? `Study at ${spotData?.name}` : 'Study at ...'}
          </h1>
          <div className={styles.heroTextBottom}>
            <Stars rating={Math.floor(Math.random() * 5) + 1} />
            <p>4.2 (9 reviews)</p>
          </div>
        </div>
      </section>
      <section className={styles.buttons}>
        <div onClick={goBack} className={styles.formHeader}>
          <div className={styles.back}>
            <Image
              className={styles.backButton}
              src={back}
              alt="X"
              height={29}
              width={29}
            />
          </div>
        </div>
        <div className={styles.rightButtons}>
          <Link href={'/'} className={styles.rightButton}>
            Save
            <Image className={styles.buttonImg} src={save} alt="star"></Image>
          </Link>
          <Link href={'/'} className={styles.rightButton}>
            Share
            <Image className={styles.buttonImg} src={share} alt="star"></Image>
          </Link>
          <Link href={'/'} className={styles.rightButton}>
            Add photo
            <Image
              className={styles.buttonImg}
              src={camera}
              alt="camera"
            ></Image>
          </Link>
          <Link href={'/'} className={styles.writeReview}>
            Write a review{' '}
            <Image
              className={styles.buttonImg}
              src={emptyStar}
              alt="star"
            ></Image>
          </Link>
        </div>
      </section>
      <section className={styles.content}>
        <div className={styles.left}>
          <p className={styles.contentTitle}>Browse 7 Reviews</p>
          <div className={styles.reviews}>
            <div className={styles.review}>
              <div className={styles.userSection}>
                <Image src={profile} alt="profile" height={35} width={35} />
                <div className={styles.userSectionInfo}>
                  <p>Kyle</p>8 months ago
                </div>
                <div className={styles.stars}>
                  <Stars rating={Math.floor(Math.random() * 5) + 1} />
                </div>
              </div>
              <div className={styles.contentSection}>
                {reviewData && reviewData[1].content}
              </div>
              <div className={styles.like}></div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.info}>
            <p className={styles.infoTitle}>Location / Hours</p>
            <div className={styles.infoContent}>
              <div className={styles.directions}>
                <div className={styles.mapContainer} ref={mapContainer}></div>
                <div className={styles.address}>{spotData?.address}</div>
                <p>
                  <Link className={styles.getDirections} href={'/'}>
                    Get Directions
                  </Link>
                </p>
              </div>
              <div className={styles.hours}>
                <div className={styles.hour}>
                  Mon
                  <p>{`8:00 AM - 5:00 PM`}</p>
                </div>
                <div className={styles.hour}>
                  Tue
                  <p>{`8:00 AM - 5:00 PM`}</p>
                </div>
                <div className={styles.hour}>
                  Wed
                  <p>{`8:00 AM - 5:00 PM`}</p>
                </div>
                <div className={styles.hour}>
                  Thu
                  <p>{`8:00 AM - 5:00 PM`}</p>
                </div>
                <div className={styles.hour}>
                  Fri
                  <p>{`8:00 AM - 5:00 PM`}</p>
                </div>
                <div className={styles.hour}>
                  Sat
                  <p>{`8:00 AM - 5:00 PM`}</p>
                </div>
                <div className={styles.hour}>
                  Sun
                  <p>{`8:00 AM - 5:00 PM`}</p>
                </div>
              </div>
            </div>
            <p className={styles.infoTitle}>Amenities</p>
            <div className={styles.infoContent}>
              <div className={styles.amenities}>
                <div className={styles.amenity}>
                  <Image
                    // className={styles.buttonImg}
                    src={x}
                    alt="x"
                    height={20}
                    width={20}
                  />
                  Free Wifi
                </div>
                <div className={styles.amenity}>
                  <Image
                    // className={styles.buttonImg}
                    src={x}
                    alt="x"
                    height={20}
                    width={20}
                  />
                  WhiteBoards
                </div>
                <div className={styles.amenity}>
                  <Image
                    // className={styles.buttonImg}
                    src={x}
                    alt="x"
                    height={20}
                    width={20}
                  />
                  Charging
                </div>
                <div className={styles.amenity}>
                  <Image
                    // className={styles.buttonImg}
                    src={check}
                    alt="x"
                    height={20}
                    width={20}
                  />
                  Printers
                </div>
                <div className={styles.amenity}>
                  <Image
                    // className={styles.buttonImg}
                    src={x}
                    alt="x"
                    height={20}
                    width={20}
                  />
                  Open 24 hours
                </div>
                <div className={styles.amenity}>
                  <Image
                    // className={styles.buttonImg}
                    src={check}
                    alt="x"
                    height={20}
                    width={20}
                  />
                  On Campus
                </div>
              </div>
            </div>
            <p className={styles.infoTitle}>About</p>
            <div className={styles.infoContent}>
              <p>{spotData?.description}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Spot;
