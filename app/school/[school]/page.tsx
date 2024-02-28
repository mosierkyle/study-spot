'use client';

import { School, StudySpot } from '@prisma/client';
import styles from './page.module.css';
import Image from 'next/image';
import calpoly from '../../public/schools/calpoly.png';
import library from '../../public/schools/library.jpg';
import Link from 'next/link';
import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import SpotCard from '../../components/spotCard/spotCard';
import type { LngLatLike } from 'mapbox-gl';
import marker from '../../public/icons8-location-24.png';

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
  const [zoom, setZoom] = useState(14.7);
  const [schoolData, setSchoolData] = useState<School | undefined>(undefined);
  const [spotsData, setSpotsData] = useState<StudySpot[] | undefined>(
    undefined
  );
  const [geoJson, setGeoJson] = useState<any>(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const bounds: mapboxgl.LngLatBoundsLike = [
    [lng - 0.01, lat - 0.01],
    [lng + 0.01, lat + 0.01],
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
      minZoom: 14.5,
    });
    map.current?.scrollZoom.disable();
    map.current?.addControl(new mapboxgl.NavigationControl());
    // map.current?.on('load', () => {
    //   if (geoJson && map.current) {
    //     map.current?.addLayer({
    //       id: 'locations',
    //       type: 'circle',
    //       /* Add a GeoJSON source containing place coordinates and information. */
    //       source: {
    //         type: 'geojson',
    //         data: geojson,
    //       },
    //     });
    //   }
    // });

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
    spotsData?.forEach((spot) => {
      if (map.current)
        new mapboxgl.Marker({ color: '#ff735c' })
          .setLngLat([Number(spot.longitude), Number(spot.latitude)])
          .addTo(map.current);
    });

    //   const features =
    //     spotsData?.map((spot, i) => ({
    //       type: 'Feature',
    //       geometry: {
    //         type: 'Point',
    //         coordinates: [Number(spot.longitude), Number(spot.latitude)],
    //       },
    //       properties: {
    //         name: spot.name,
    //         address: spot.address,
    //         description: spot.description,
    //         id: i,
    //       },
    //     })) ?? [];

    //   const spotsGeoJSON = {
    //     type: 'FeatureCollection',
    //     features: features,
    //   };
    //   setGeoJson(spotsGeoJSON);
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotsData]);

  // useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [geoJson]);

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

  return (
    <div className={styles.main}>
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
              <h3>{spotsData && `${spotsData?.length} places to study`}</h3>
            </div>
            <Link
              href={`/${schoolData?.id}/add/${schoolData?.id}/`}
              className={styles.sort}
            >
              Sort
            </Link>
          </div>
          {spotsData ? (
            <div className={styles.spots}>
              {spotsData.map((spot) => (
                <SpotCard key={spot.id} spotData={spot} />
              ))}
            </div>
          ) : (
            <div className={styles.spots}>
              <p className={styles.loadingText}>Loading...</p>
            </div>
          )}
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