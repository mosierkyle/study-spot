'use client';

import { Review, School, StudySpot, User } from '@prisma/client';
import styles from './page.module.css';
import { getSpot } from '@/lib/getSpot';
import Image from 'next/image';
import study from '../../../public/study6.jpg';
import { useEffect, useState, useRef, Suspense } from 'react';
import Stars from '@/app/components/stars/stars';
import ReviewStars from '@/app/components/reviewStars/reviewStars';
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
import photo from '../../../public/camera.png';
import ReviewCard from '@/app/components/review/review';
import ReviewForm from '@/app/components/reviewForm/reviewForm';
import Loading from './loading';
import filledSave from '../../../public/saved.png';
import useCheckSignIn from '@/lib/hooks/useAuthorize';

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
  const [lng, setLng] = useState<string | null>(null);
  const [lat, setLat] = useState<string | null>(null);
  const [zoom, setZoom] = useState(15);
  const [user, setUser] = useState<User | undefined>(undefined);
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const isSignedIn = useCheckSignIn();

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
          const parsedUser = await responseData.user;
          setSpotData(parsedData);
          setLat(parsedData?.latitude);
          setLng(parsedData?.longitude);
          setUser(parsedUser);
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

  const createSave = async () => {
    try {
      const response = await fetch('/api/createSave/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studySpotId: spotData?.id,
          studentId: user?.id,
        }),
      });
      if (response.ok) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeSave = async () => {
    try {
      const response = await fetch('/api/removeSave/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studySpotId: spotData?.id,
          studentId: user?.id,
        }),
      });
      if (response.ok) {
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveClick = () => {
    saved == true ? removeSave() : createSave();
    saved == true ? setSaved(false) : setSaved(true);
  };

  const handleRedirectToMaps = () => {
    const address = encodeURIComponent(spotData?.address ?? '');
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className={styles.main}>
      {showReviewForm && (
        <ReviewForm
          setShowReviewForm={setShowReviewForm}
          showReviewForm={showReviewForm}
          spotName={spotData?.name}
          userId={user?.id}
          spotId={spotData?.id}
        />
      )}
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
            <Stars rating={spotData?.rating ?? 0} />
            <p>
              {spotData?.rating} ({reviewData?.length} reviews)
            </p>
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
            />{' '}
            school study spots
          </div>
        </div>
        <div className={styles.rightButtons}>
          {isSignedIn ? (
            <div onClick={handleSaveClick} className={styles.rightButton}>
              Save
              <Image
                className={styles.buttonImg}
                src={saved ? filledSave : save}
                alt="star"
              ></Image>
            </div>
          ) : (
            <div
              onClick={() => alert('You must be signed in to save this spot')}
              className={styles.rightButton}
            >
              Save
              <Image
                className={styles.buttonImg}
                src={saved ? filledSave : save}
                alt="star"
              ></Image>
            </div>
          )}

          <Link href={'/'} className={styles.rightButton}>
            Share
            <Image className={styles.buttonImg} src={share} alt="star"></Image>
          </Link>
          {/* <Link href={'/'} className={styles.rightButton}>
            Add photo
            <Image
              className={styles.buttonImg}
              src={camera}
              alt="camera"
            ></Image>
          </Link> */}
          {isSignedIn ? (
            <div
              onClick={() => setShowReviewForm(true)}
              className={styles.writeReview}
            >
              Write a review{' '}
              <Image
                className={styles.buttonImg}
                src={emptyStar}
                alt="star"
              ></Image>
            </div>
          ) : (
            <div
              onClick={() => alert('You must be signed in to write a review')}
              className={styles.writeReview}
            >
              Write a review{' '}
              <Image
                className={styles.buttonImg}
                src={emptyStar}
                alt="star"
              ></Image>
            </div>
          )}
        </div>
      </section>
      <section className={styles.content}>
        <div className={styles.left}>
          <p className={styles.contentTitle}>
            Browse {reviewData?.length} Reviews
          </p>
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
        <div className={styles.right}>
          <div className={styles.info}>
            <p className={styles.infoTitle}>Location / Hours</p>
            <div className={styles.infoContent}>
              <div className={styles.directions}>
                <div className={styles.mapContainer} ref={mapContainer}></div>
                <div className={styles.address}>{spotData?.address}</div>
                <p>
                  <div
                    className={styles.getDirections}
                    onClick={handleRedirectToMaps}
                  >
                    Get Directions
                  </div>
                </p>
              </div>
              {/* <div className={styles.hours}>
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
              </div> */}
            </div>
            <p className={styles.infoTitle}>Amenities</p>
            <div className={styles.infoContent}>
              <div className={styles.amenities}>
                <div className={styles.amenity}>
                  <Image
                    // className={styles.buttonImg}
                    src={spotData?.wifi ? check : x}
                    alt="x"
                    height={20}
                    width={20}
                  />
                  Wifi
                </div>
                <div className={styles.amenity}>
                  <Image
                    // className={styles.buttonImg}
                    src={spotData?.onCampus ? check : x}
                    alt="x"
                    height={20}
                    width={20}
                  />
                  On Campus
                </div>
                <div className={styles.amenity}>
                  <Image
                    // className={styles.buttonImg}
                    src={spotData?.hour24 ? check : x}
                    alt="x"
                    height={20}
                    width={20}
                  />
                  Open 24 hours
                </div>
                <div className={styles.amenity}>
                  <Image
                    // className={styles.buttonImg}
                    src={spotData?.restrooms ? check : x}
                    alt="x"
                    height={20}
                    width={20}
                  />
                  Restrooms
                </div>
                <div className={styles.amenity}>
                  <Image
                    // className={styles.buttonImg}
                    src={
                      spotData?.studyResources.includes('printers') ? check : x
                    }
                    alt="x"
                    height={20}
                    width={20}
                  />
                  Printers
                </div>
                <div className={styles.amenity}>
                  <Image
                    // className={styles.buttonImg}
                    src={
                      spotData?.studyResources.includes('whiteboards')
                        ? check
                        : x
                    }
                    alt="x"
                    height={20}
                    width={20}
                  />
                  Whiteboards
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
